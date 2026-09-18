<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useTeamStore } from '@/store/teamStore'
import categoryApi from '@/api/categoryApi'
import appButton from '../form/appButton.vue'
import appInput from '../form/appInput.vue'
import { useAuthStore } from '@/store/authStore'

const authStore = useAuthStore()
const emit = defineEmits(['close', 'created'])
const teamStore = useTeamStore()

const loading = ref(false)
const errorMessage = ref('')
const selectedFile = ref(null)
const imagePreview = ref(null)

// Controle de Categorias
const existingCategories = ref([])
const buscaCategoria = ref('')
const mostrarDropdown = ref(false)
const newCategory = ref(false)
const selectedCategories = ref([]) // Lista de categorias selecionadas (múltiplas)

const form = reactive({
  nome: '',
  descricao: '',
  alunos: [],
})

onMounted(async () => {
  try {
    const response = await categoryApi.getAll()
    existingCategories.value = response.data.results || response.data || []
  } catch (error) {
    console.error('Erro ao carregar categorias:', error)
  }
})

// Filtra categorias existentes excluindo as que já foram adicionadas
const categoriasFiltradas = computed(() => {
  if (!buscaCategoria.value) return []
  return existingCategories.value.filter(
    (cat) =>
      cat.nome.toLowerCase().includes(buscaCategoria.value.toLowerCase()) &&
      !selectedCategories.value.some((selected) => selected.id === cat.id),
  )
})

// Verifica se a categoria digitada bate exatamente com uma já existente
const categoriaExata = computed(() => {
  return existingCategories.value.find(
    (cat) => cat.nome.toLowerCase() === buscaCategoria.value.toLowerCase(),
  )
})

// Exibe botão de criar quando não houver resultados e não estiver em edição
const mostrarBotaoNovo = computed(() => {
  return (
    buscaCategoria.value.trim().length > 1 &&
    !categoriaExata.value &&
    categoriasFiltradas.value.length === 0 &&
    !newCategory.value
  )
})

function handleSearchInput() {
  mostrarDropdown.value = true
  newCategory.value = false
}

function adicionarCategoria(cat) {
  if (!selectedCategories.value.some((item) => item.id === cat.id)) {
    selectedCategories.value.push(cat)
  }
  buscaCategoria.value = ''
  mostrarDropdown.value = false
}

function removerCategoria(catId) {
  selectedCategories.value = selectedCategories.value.filter((cat) => cat.id !== catId)
}

function prepararNovoCadastro() {
  newCategory.value = true
  mostrarDropdown.value = false
}

async function handleCreateCategory() {
  if (!buscaCategoria.value.trim()) return

  try {
    loading.value = true
    const novaCat = await teamStore.createCategory(buscaCategoria.value)

    existingCategories.value.push(novaCat)
    adicionarCategoria(novaCat)

    buscaCategoria.value = ''
    newCategory.value = false
  } catch (error) {
    errorMessage.value = 'Erro ao criar categoria.'
  } finally {
    loading.value = false
  }
}

// Manipulação do upload de imagem e preview
function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) {
    // Revoga a URL anterior se já existir uma para evitar vazamento de memória
    if (imagePreview.value) {
      URL.revokeObjectURL(imagePreview.value)
    }
    selectedFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

function removeImage() {
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
  }
  selectedFile.value = null
  imagePreview.value = null
}

async function handleSubmit() {
  if (!form.nome.trim()) {
    errorMessage.value = 'O nome da equipe é obrigatório.'
    return
  }

  // Pega o ID do usuário/professor logado
  const professorId = authStore.user?.id // Ou authStore.userId

  try {
    loading.value = true
    errorMessage.value = ''

    await teamStore.createTeam(
      {
        nome: form.nome,
        descricao: form.descricao,
        categorias: selectedCategories.value.map((cat) => cat.id),
        // O Django espera uma LISTA de IDs para o campo M2M 'professores'
        professores: professorId ? [professorId] : [],
      },
      selectedFile.value,
    )

    emit('created')
    emit('close')
  } catch (error) {
    console.error('Erro ao criar equipe:', error)
    errorMessage.value = error.response?.data?.detail || 'Erro ao processar a requisição.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-container">
      <div class="modal-header">
        <h2>Criar Nova Equipe</h2>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-body">
        <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

        <!-- Upload de Imagem Personalizado com Preview -->
        <div class="form-group align-center">
          <label>Imagem da Equipe</label>
          <div class="image-upload-wrapper">
            <label for="team-image-input" class="image-preview-container">
              <img
                v-if="imagePreview"
                :src="imagePreview"
                alt="Preview da Equipe"
                class="preview-img"
              />
              <div v-else class="upload-placeholder">
                <i class="mdi mdi-camera-plus-outline"></i>
                <span>Adicionar Foto</span>
              </div>
            </label>
            <input
              id="team-image-input"
              type="file"
              accept="image/*"
              class="hidden-file-input"
              @change="handleFileUpload"
              required
            />
            <button
              v-if="imagePreview"
              type="button"
              class="btn-remove-image"
              @click="removeImage"
              title="Remover imagem"
            >
              <i class="mdi mdi-close"></i>
            </button>
          </div>
        </div>

        <div class="form-group">
          <label>Nome da Equipe *</label>
          <appInput
            placeholder="Nome da equipe"
            icon="mdi mdi-account-group"
            v-model="form.nome"
            required
          />
        </div>

        <!-- Autocomplete de Múltiplas Categorias -->
        <div class="form-group cat-container">
          <label>Categorias *</label>

          <!-- Badges de Categorias Selecionadas -->
          <div v-if="selectedCategories.length > 0" class="selected-tags-container">
            <div v-for="cat in selectedCategories" :key="cat.id" class="category-tag">
              <span>{{ cat.nome }}</span>
              <button type="button" class="btn-remove-tag" @click="removerCategoria(cat.id)">
                &times;
              </button>
            </div>
          </div>

          <div class="search-box">
            <appInput
              placeholder="Pesquisar ou criar Categoria"
              icon="mdi mdi-tag-outline"
              v-model="buscaCategoria"
              @focus="mostrarDropdown = true"
              @input="handleSearchInput"
            />

            <ul v-if="mostrarDropdown && categoriasFiltradas.length > 0" class="custom-dropdown">
              <li v-for="cat in categoriasFiltradas" :key="cat.id" @click="adicionarCategoria(cat)">
                <span class="mdi mdi-tag-text-outline"></span>
                <span class="cat-name">{{ cat.nome }}</span>
              </li>
            </ul>
          </div>

          <!-- Caixa de "Não encontrou?" -->
          <div v-if="mostrarBotaoNovo" class="not-found-box">
            <p>Não encontrou a categoria?</p>
            <button type="button" @click="prepararNovoCadastro" class="btn-novo">
              + Cadastrar Nova
            </button>
          </div>

          <!-- Cadastro Rápido de Categoria -->
          <div class="new-cat" v-if="newCategory">
            <div class="form-interno">
              <appInput
                placeholder="Nome da Categoria"
                icon="mdi mdi-tag-plus"
                v-model="buscaCategoria"
              />
              <small class="hint">A categoria será salva em caixa alta.</small>
              <appButton type="button" @click="handleCreateCategory" class="btn-salvar-cat">
                Salvar e Adicionar
              </appButton>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>Descrição</label>
          <textarea
            v-model="form.descricao"
            rows="3"
            placeholder="Descrição da equipe..."
          ></textarea>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn-cancel" @click="$emit('close')">Cancelar</button>
          <appButton type="submit" :disabled="loading">
            {{ loading ? 'Salvando...' : 'Salvar Equipe' }}
          </appButton>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background: #ffffff;
  width: 90%;
  max-width: 500px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e2e8f0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.modal-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.align-center {
  align-items: center;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #334155;
}

.form-group textarea {
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.95rem;
}

/* Upload de Imagem Estilizado */
.image-upload-wrapper {
  position: relative;
  width: 110px;
  height: 110px;
}

.image-preview-container {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px dashed #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
  background: #f8fafc;
  transition: all 0.2s ease;
}

.image-preview-container:hover {
  border-color: var(--principal-claro, #2563eb);
  background: #f1f5f9;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #64748b;
  font-size: 0.75rem;
  gap: 4px;
}

.upload-placeholder i {
  font-size: 24px;
  color: #94a3b8;
}

.hidden-file-input {
  display: none;
}

.btn-remove-image {
  position: absolute;
  top: 2px;
  right: 2px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Badges de Categorias Selecionadas */
.selected-tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 6px;
}

.category-tag {
  background-color: var(--principal-claro, #2563eb);
  color: #ffffff;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.btn-remove-tag {
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 1.1rem;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  opacity: 0.8;
}

.btn-remove-tag:hover {
  opacity: 1;
}

/* Estilos de Autocomplete */
.cat-container {
  position: relative;
}

.search-box {
  position: relative;
}

.custom-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  max-height: 180px;
  overflow-y: auto;
  list-style: none;
  padding: 0;
  margin: 0;
}

.custom-dropdown li {
  padding: 10px 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  border-bottom: 1px solid #f1f5f9;
}

.custom-dropdown li:hover {
  background: #f1f5f9;
}

.custom-dropdown .mdi {
  font-size: 18px;
  color: var(--principal-claro, #2563eb);
}

.cat-name {
  font-size: 14px;
  color: #334155;
}

.not-found-box {
  margin-top: 8px;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.02);
  padding: 10px;
  border-radius: 8px;
  border: 1px dashed var(--principal-claro, #2563eb);
}

.btn-novo {
  background: var(--principal-claro, #2563eb);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 4px;
}

.new-cat {
  margin-top: 10px;
  padding: 12px;
  border: solid var(--principal-claro, #2563eb) 1px;
  border-radius: 6px;
  background: #fafafa;
}

.form-interno {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hint {
  font-size: 0.75rem;
  color: #64748b;
}

.btn-salvar-cat {
  margin-top: 4px;
}

.error-msg {
  color: #ef4444;
  font-size: 0.875rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

.btn-cancel {
  background: transparent;
  border: 1px solid #cbd5e1;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}
</style>
