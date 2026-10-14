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
  router.push({ name: 'studentDetails', params: { id } })
}

function goToTeacher(id) {
  router.push({ name: 'teacherDetails', params: { id } })
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="emit('close')">
    <div class="modal-container">
      <div class="modal-header">
        <div class="header-text">
          <span class="title-kicker">Equipe</span>
          <h2>{{ teamName }}</h2>
        </div>
        <button type="button" class="close-btn" @click="emit('close')">&times;</button>
      </div>

      <div class="modal-body">
        <section v-if="teachersList.length" class="participants-section">
          <div class="section-title">
            <span class="mdi mdi-account-tie"></span>
            <h3>Professores</h3>
          </div>

          <ul class="participant-list">
            <li
              v-for="teacher in teachersList"
              :key="teacher.id || teacher.user?.id"
              class="participant-item"
              @click="goToTeacher(teacher.id || teacher.user?.id)"
            >
              <div class="avatar-wrap">
                <img
                  v-if="getPersonImage(teacher)"
                  :src="getPersonImage(teacher)"
                  :alt="getPersonName(teacher)"
                />
                <span v-else class="mdi mdi-account"></span>
              </div>

              <div class="participant-info">
                <strong>{{ getPersonName(teacher) }}</strong>
                <small>{{ getPersonEmail(teacher) }}</small>
              </div>
            </li>
          </ul>
        </section>

        <section v-if="studentsList.length" class="participants-section">
          <div class="section-title">
            <span class="mdi mdi-account-group"></span>
            <h3>Alunos</h3>
          </div>

          <ul class="participant-list students-list">
            <li
              v-for="student in studentsList"
              :key="student.id || student.user?.id"
              class="participant-item student-item"
              @click="goToStudent(student.id || student.user?.id)"
            >
              <div class="avatar-wrap">
                <img
                  v-if="getPersonImage(student)"
                  :src="getPersonImage(student)"
                  :alt="getPersonName(student)"
                />
                <span v-else class="mdi mdi-account"></span>
              </div>

              <div class="participant-info">
                <strong>{{ getPersonName(student) }}</strong>
                <small>{{ getPersonEmail(student) }}</small>
              </div>
            </li>
          </ul>
        </section>

        <div v-if="!teachersList.length && !studentsList.length" class="empty-state">
          <span class="mdi mdi-account-off"></span>
          <p>Nenhum participante cadastrado.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped src="./projectParticipantsModal.css"></style>
