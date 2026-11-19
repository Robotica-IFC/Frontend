import assert from 'node:assert/strict'
import { after, before, beforeEach, test } from 'node:test'
import { setImmediate } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'
import { createPinia, setActivePinia } from 'pinia'
import { createServer } from 'vite'

let server
let api
let useProjectStore
const projects = Array.from({ length: 13 }, (_, index) => ({ id: index + 1 }))
const response = (config, data) => ({
  data,
  config,
  status: 200,
  statusText: 'OK',
  headers: {},
})

before(async () => {
  globalThis.localStorage = { getItem: () => null }
  server = await createServer({
    configFile: false,
    root: fileURLToPath(new URL('../', import.meta.url)),
    server: { middlewareMode: true, hmr: false, watch: null },
    resolve: { alias: { '@': fileURLToPath(new URL('../src', import.meta.url)) } },
    logLevel: 'silent',
  })
  const apiModule = await server.ssrLoadModule('/src/api/config.js')
  const projectModule = await server.ssrLoadModule('/src/store/projectsStore.js')
  api = apiModule.default
  useProjectStore = projectModule.useProjectStore
})

after(async () => {
  await server?.close()
})

beforeEach(() => {
  setActivePinia(createPinia())
  api.defaults.adapter = async (config) => {
    const page = Number(config.params.page)
    const pageSize = Number(config.params.page_size || 10)
    return response(config, {
      page,
      page_size: pageSize,
      total_pages: Math.ceil(projects.length / pageSize),
      results: projects.slice((page - 1) * pageSize, page * pageSize),
    })
  }
})

for (const [layout, pageSize] of [
  ['desktop', 4],
  ['mobile', 2],
]) {
  test(`${layout}: todas as páginas ficam acessíveis, com até ${pageSize} projetos`, async () => {
    const store = useProjectStore()
    const seen = []
    const totalPages = Math.ceil(projects.length / pageSize)
    for (let page = 1; page <= totalPages; page++) {
      assert.equal(await store.getProjects(page, pageSize), true)
      assert.equal(store.currentPage, page)
      assert.equal(store.totalPages, totalPages)
      assert.equal(store.loading, false)
      assert.equal(
        store.projects.length,
        Math.min(pageSize, projects.length - (page - 1) * pageSize),
      )
      seen.push(...store.projects.map((project) => project.id))
    }
    assert.deepEqual(
      seen,
      projects.map((project) => project.id),
    )
  })
}

for (const staleFirst of [true, false]) {
  test(`redimensionamento ignora resposta antiga, chegando ${staleFirst ? 'antes' : 'depois'} da atual`, async () => {
    const store = useProjectStore()
    const requests = []
    api.defaults.adapter = (config) => new Promise((resolve) => requests.push({ config, resolve }))
    const desktop = store.getProjects(2, 4)
    const mobile = store.getProjects(1, 2)
    await setImmediate()
    assert.equal(requests.length, 2)
    const resolveDesktop = () =>
      requests[0].resolve(
        response(requests[0].config, {
          page: 2,
          total_pages: 4,
          results: projects.slice(4, 8),
        }),
      )
    if (staleFirst) {
      resolveDesktop()
      assert.equal(await desktop, false)
      assert.equal(store.loading, true)
    }
    requests[1].resolve(
      response(requests[1].config, {
        page: 1,
        total_pages: 7,
        results: projects.slice(0, 2),
      }),
    )
    assert.equal(await mobile, true)
    if (!staleFirst) {
      resolveDesktop()
      assert.equal(await desktop, false)
    }
    assert.equal(store.currentPage, 1)
    assert.equal(store.totalPages, 7)
    assert.deepEqual(
      store.projects.map((project) => project.id),
      [1, 2],
    )
    assert.equal(store.loading, false)
  })
}

test('erro preserva a página atual e permite tentar carregar a próxima novamente', async (t) => {
  const store = useProjectStore()
  await store.getProjects(1, 4)
  const adapter = api.defaults.adapter
  t.mock.method(console, 'error', () => {})
  api.defaults.adapter = async () => {
    throw new Error('Sem conexão')
  }
  assert.equal(await store.getProjects(2, 4), false)
  assert.equal(store.currentPage, 1)
  assert.deepEqual(
    store.projects.map((project) => project.id),
    [1, 2, 3, 4],
  )
  assert.ok(store.errorMessage)
  assert.equal(store.loading, false)
  api.defaults.adapter = adapter
  assert.equal(await store.getProjects(2, 4), true)
  assert.equal(store.currentPage, 2)
  assert.deepEqual(
    store.projects.map((project) => project.id),
    [5, 6, 7, 8],
  )
  assert.equal(store.errorMessage, '')
})

test('projetos da equipe: paginação de dois itens permite acessar além dos dez primeiros', async () => {
  const store = useProjectStore()
  const seen = []
  const adapter = api.defaults.adapter
  api.defaults.adapter = (config) => {
    assert.equal(config.params.equipe, 'team-a')
    assert.equal(config.params.page_size, 2)
    return adapter(config)
  }
  for (let page = 1; page <= Math.ceil(projects.length / 2); page++) {
    assert.equal(await store.getProjectsByTeam('team-a', page), true)
    assert.equal(store.teamCurrentPage, page)
    assert.equal(store.teamTotalPages, 7)
    assert.ok(store.teamProjects.length <= 2)
    seen.push(...store.teamProjects.map((project) => project.id))
  }
  assert.deepEqual(
    seen,
    projects.map((project) => project.id),
  )
  assert.equal(store.teamLoading, false)
  await store.getProjectsByTeam('team-a')
  assert.equal(store.teamCurrentPage, 1)
})

test('erro ao paginar os projetos da equipe preserva os itens e permite tentar novamente', async () => {
  const store = useProjectStore()
  await store.getProjectsByTeam('team-a')
  const adapter = api.defaults.adapter
  api.defaults.adapter = async () => {
    throw new Error('Sem conexão')
  }
  assert.equal(await store.getProjectsByTeam('team-a', 2), false)
  assert.equal(store.teamCurrentPage, 1)
  assert.deepEqual(
    store.teamProjects.map((project) => project.id),
    [1, 2],
  )
  assert.ok(store.teamErrorMessage)
  assert.equal(store.teamLoading, false)
  api.defaults.adapter = adapter
  assert.equal(await store.getProjectsByTeam('team-a', 2), true)
  assert.equal(store.teamCurrentPage, 2)
  assert.deepEqual(
    store.teamProjects.map((project) => project.id),
    [3, 4],
  )
  assert.equal(store.teamErrorMessage, '')
})

for (const staleFirst of [true, false]) {
  test(`trocar de equipe ignora a resposta antiga, chegando ${staleFirst ? 'antes' : 'depois'} da atual`, async () => {
    const store = useProjectStore()
    const requests = []
    api.defaults.adapter = (config) => new Promise((resolve) => requests.push({ config, resolve }))
    const oldTeam = store.getProjectsByTeam('old-team')
    const newTeam = store.getProjectsByTeam('new-team')
    await setImmediate()
    const resolveOld = () =>
      requests[0].resolve(
        response(requests[0].config, {
          page: 1,
          total_pages: 5,
          results: [{ id: 1 }],
        }),
      )
    if (staleFirst) {
      resolveOld()
      assert.equal(await oldTeam, false)
      assert.equal(store.teamLoading, true)
    }
    requests[1].resolve(
      response(requests[1].config, {
        page: 1,
        total_pages: 2,
        results: [{ id: 21 }, { id: 22 }],
      }),
    )
    assert.equal(await newTeam, true)
    if (!staleFirst) {
      resolveOld()
      assert.equal(await oldTeam, false)
    }
    assert.deepEqual(
      store.teamProjects.map((project) => project.id),
      [21, 22],
    )
    assert.equal(store.teamTotalPages, 2)
    assert.equal(store.teamLoading, false)
  })
}

test('busca e filtros são enviados em todas as páginas de projetos', async () => {
  const store = useProjectStore()
  const filters = {
    search: 'robô',
    status: 'CONCLUIDO',
    equipe__instituicao: 'campus-a',
    equipe: 'team-a',
  }
  const adapter = api.defaults.adapter
  const pages = []
  api.defaults.adapter = (config) => {
    for (const [key, value] of Object.entries(filters)) assert.equal(config.params[key], value)
    pages.push(config.params.page)
    return adapter(config)
  }
  await store.getProjects(1, 2, filters)
  await store.getProjects(2, 2, filters)
  assert.deepEqual(pages, [1, 2])
})

test('filtros dos projetos de equipe preservam o escopo da equipe', async () => {
  const store = useProjectStore()
  const adapter = api.defaults.adapter
  api.defaults.adapter = (config) => {
    assert.equal(config.params.equipe, 'team-a')
    assert.equal(config.params.search, 'linha')
    assert.equal(config.params.status, 'EM_ANDAMENTO')
    return adapter(config)
  }
  assert.equal(
    await store.getProjectsByTeam('team-a', 1, {
      search: 'linha',
      status: 'EM_ANDAMENTO',
      equipe: 'other-team',
    }),
    true,
  )
})
