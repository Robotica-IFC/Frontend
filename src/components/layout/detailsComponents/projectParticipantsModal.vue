
<script setup>
import { computed } from 'vue'
import router from '@/router'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  teamName: {
    type: String,
    default: 'Equipe',
  },
  teachers: {
    type: Array,
    default: () => [],
  },
  students: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['close'])

const teachersList = computed(() => props.teachers || [])
const studentsList = computed(() => props.students || [])

function getPersonName(person) {
  const nestedUser = person?.user || person?.usuario || {}

  return (
    person?.name ||
    person?.nome ||
    person?.username ||
    nestedUser?.name ||
    nestedUser?.nome ||
    nestedUser?.username ||
    'Participante'
  )
}

function getPersonImage(person) {
  const nestedUser = person?.user || person?.usuario || {}

  return (
    person?.imagem_perfil?.url ||
    person?.imagem_perfil?.file ||
    nestedUser?.imagem_perfil?.url ||
    nestedUser?.imagem_perfil?.file ||
    person?.image_perfil?.url ||
    person?.image_perfil?.file ||
    nestedUser?.image_perfil?.url ||
    nestedUser?.image_perfil?.file ||
    null
  )
}

function getPersonEmail(person) {
  const nestedUser = person?.user || person?.usuario || {}

  return person?.email || nestedUser?.email || 'Professor'
}

function goToStudent(id) {
  if (id == null) return

  emit('close')

  router.push({
    name: 'studentDetails',
    params: { id },
  })
}

function goToTeacher(id) {
  if (id == null) return

  emit('close')

  router.push({
    name: 'teacherDetails',
    params: { id },
  })
}
</script>

<template>
  <div
    v-if="isOpen"
    class="modal-backdrop"
    @click.self="emit('close')"
  >
    <div
      class="modal-container"
      role="dialog"
      aria-modal="true"
      aria-labelledby="participants-modal-title"
    >
      <div class="modal-header">
        <div class="header-text">
          <span class="title-kicker">
            Equipe
          </span>

          <h2 id="participants-modal-title">
            {{ teamName }}
          </h2>
        </div>

        <button
          type="button"
          class="close-btn"
          aria-label="Fechar participantes"
          @click="emit('close')"
        >
          <i
            class="mdi mdi-close"
            aria-hidden="true"
          ></i>
        </button>
      </div>

      <div class="modal-body">
        <!-- Professores -->
        <section
          v-if="teachersList.length"
          class="participants-section"
        >
          <div class="section-title">
            <span
              class="mdi mdi-account-tie"
              aria-hidden="true"
            ></span>

            <h3>Professores</h3>
          </div>

          <ul class="participant-list">
            <li
              v-for="teacher in teachersList"
              :key="teacher.id ?? teacher.user?.id"
              class="participant-item"
            >
              <button
                type="button"
                class="participant-link"
                :aria-label="`Ver professor ${getPersonName(teacher)}`"
                :disabled="(teacher.id ?? teacher.user?.id) == null"
                @click="goToTeacher(teacher.id ?? teacher.user?.id)"
              >
                <div class="avatar-wrap">
                  <img
                    v-if="getPersonImage(teacher)"
                    :src="getPersonImage(teacher)"
                    :alt="getPersonName(teacher)"
                    loading="lazy"
                  />

                  <span
                    v-else
                    class="mdi mdi-account"
                    aria-hidden="true"
                  ></span>
                </div>

                <div class="participant-info">
                  <strong>
                    {{ getPersonName(teacher) }}
                  </strong>

                  <small>
                    {{ getPersonEmail(teacher) }}
                  </small>
                </div>
              </button>
            </li>
          </ul>
        </section>

        <!-- Alunos -->
        <section
          v-if="studentsList.length"
          class="participants-section"
        >
          <div class="section-title">
            <span
              class="mdi mdi-account-group"
              aria-hidden="true"
            ></span>

            <h3>Alunos</h3>
          </div>

          <ul class="participant-list students-list">
            <li
              v-for="student in studentsList"
              :key="student.id ?? student.user?.id"
              class="participant-item student-item"
            >
              <button
                type="button"
                class="participant-link"
                :aria-label="`Ver aluno ${getPersonName(student)}`"
                :disabled="(student.id ?? student.user?.id) == null"
                @click="goToStudent(student.id ?? student.user?.id)"
              >
                <div class="avatar-wrap">
                  <img
                    v-if="getPersonImage(student)"
                    :src="getPersonImage(student)"
                    :alt="getPersonName(student)"
                    loading="lazy"
                  />

                  <span
                    v-else
                    class="mdi mdi-account"
                    aria-hidden="true"
                  ></span>
                </div>

                <div class="participant-info">
                  <strong>
                    {{ getPersonName(student) }}
                  </strong>

                  <small v-if="getPersonEmail(student) !== 'Professor'">
                    {{ getPersonEmail(student) }}
                  </small>
                </div>
              </button>
            </li>
          </ul>
        </section>

        <!-- Nenhum participante -->
        <div
          v-if="!teachersList.length && !studentsList.length"
          class="empty-state"
        >
          <span
            class="mdi mdi-account-off"
            aria-hidden="true"
          ></span>

          <p>Nenhum participante cadastrado.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped src="./projectParticipantsModal.css"></style>

<style scoped>
.participant-link {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-width: 0;
  padding: 0;
  border: none;
  background: transparent;
  color: inherit;
  text-align: left;
  font: inherit;
  cursor: pointer;
}

.participant-link:focus-visible {
  outline: 2px solid var(--principal-claro, #0f4b70);
  outline-offset: 3px;
  border-radius: 8px;
}

.participant-link:disabled {
  cursor: default;
}

.participant-info {
  flex: 1;
  min-width: 0;
}
</style>
