<script setup>
import { onMounted, ref, computed } from 'vue'
import { useProjectStore } from '@/store/projectsStore'

const store = useProjectStore()

const quantidade = ref(4)

const projetosVisiveis = computed(() => {
  return store.projects.slice(0, quantidade.value)
})

function verMais() {
  quantidade.value += 4
}

onMounted(() => {
  store.getProjects()
})
</script>

<template>
  <section class="container">
    <div class="grid">
      <article class="card" v-for="project in projetosVisiveis" :key="project.id">
        <div class="left">
          <div class="image">
            <img
              v-if="project.image_perfil"
              :src="project.image_perfil.file"
              :alt="project.titulo"
            />

            <div v-else class="no-image">
              <span class="mdi mdi-robot-outline"></span>
            </div>
          </div>
        </div>

        <div class="rigth">
          <span class="status" :class="project.status?.toLowerCase()">
            {{
              project.status === 'EM_ANDAMENTO'
                ? 'Em andamento'
                : project.status === 'CONCLUIDO'
                  ? 'Concluído'
                  : 'Cancelado'
            }}
          </span>

          <div class="content">
            <h2>{{ project.titulo }}</h2>

            <p>
              {{ project.desc_curta }}
            </p>

            <div class="team">
              <div class="info-item">
                <span class="mdi mdi-account-group"></span>
                <span class="equipe">{{ project.equipe }}</span>
              </div>

              <div class="info-item">
                <span class="mdi mdi-map-marker"></span>
                <span class="instituicao">{{ project.instituicao }}</span>
              </div>
            </div>

            <div class="detalhe">
              <button>Ver detalhes</button>
            </div>
          </div>
        </div>
      </article>
    </div>

    <div class="ver-mais" v-if="quantidade < store.projects.length">
      <button @click="verMais">Ver mais projetos</button>
    </div>
  </section>
</template>

<style scoped>
.container {
  width: min(1200px, 95%);
  margin: 40px auto;
}

.card {
  background: white;
  margin-bottom: 15px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #ddd;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.12);
  transition: 0.2s;
  display: flex;
  height: 220px;
  padding: 0px;
}

.left {
  width: 40%;
  height: 100%;
} 

.image {
  width: 100%;
  height: 100%;
}

.image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  width: 100%;
  height: 100%;
  background: rgba(33, 150, 243, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-image .mdi {
  font-size: 60px;
  color: #2196f3;
}

.rigth {
  flex: 1;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  min-width: 0;
}

.status {
  padding: 3px 10px;
  border-radius: 5px;
  color: #ffff;
  align-self: flex-start;
  white-space: nowrap;
}

.em_andamento {
  background: #003d66;
}
.concluido {
  background: #386641;
}
.cancelado {
  background: #b91c1c;
}

h2 {
  font-size: 21px;
  margin-top: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

button {
  color: var(--principal-claro);
  border: var(--principal-claro) solid 1px;
  background: white;
  padding: 5px 20px;
  border-radius: 5px;
}

.team {
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
}

.info-item {
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
}

.info-item span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.info-item .mdi {
  margin-right: 6px;
  flex-shrink: 0;
  color: var(--principal-claro);
}

p {
  margin: 0;
}

.ver-mais{
  display:flex;
  justify-content:center;
  margin-top:30px;
}

.ver-mais button{
  padding:10px 28px;
  border:none;
  border-radius:8px;
  background:var(--principal-claro);
  color:#fff;
  font-size:16px;
  font-weight:600;
  cursor:pointer;
  transition:.25s;
}

.ver-mais button:hover{
  opacity:.9;
  transform:translateY(-2px);
}
</style>