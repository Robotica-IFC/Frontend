<script setup>
import { computed, ref } from 'vue'
import router from '@/router'

const props = defineProps({
  teachers: { type: Array, default: () => [] },
  students: { type: Array, default: () => [] },
})

const teachersExpanded = ref(false)
const studentsExpanded = ref(false)
const previewCount = 4

const visibleTeachers = computed(() =>
  teachersExpanded.value ? props.teachers : props.teachers.slice(0, previewCount)
)
const visibleStudents = computed(() =>
  studentsExpanded.value ? props.students : props.students.slice(0, previewCount)
)

function goToStudent(id) {
  router.push({ name: 'studentDetails', params: { id } })
}
function goToTeacher(id) {
  router.push({ name: 'teacherDetails', params: { id } })
}
</script>

<template>
  <div class="members">
    <section v-if="teachers.length" class="member-group">
      <div class="group-header">
        <i class="mdi mdi-account-tie-outline" aria-hidden="true"></i>
        <h3>Professores</h3>
        <span class="group-count">{{ teachers.length }}</span>
      </div>
      <ul class="teachers">
        <li v-for="teacher in visibleTeachers" :key="teacher.id">
          <button type="button" class="member-link" :aria-label="'Ver professor ' + (teacher.user?.name || '')" @click="goToTeacher(teacher.id)">
            <img v-if="teacher.imagem_perfil?.url || teacher.imagem_perfil?.file"
              :src="teacher.imagem_perfil.url || teacher.imagem_perfil.file" :alt="teacher.user?.name || 'Professor'" />
            <span v-else class="avatar-placeholder mdi mdi-account" aria-hidden="true"></span>
            <span class="member-label">
              <strong :title="teacher.user?.name">{{ teacher.user?.name || 'Professor' }}</strong>
              <small :title="teacher.user?.email">{{ teacher.user?.email }}</small>
            </span>
          </button>
        </li>
      </ul>
      <button v-if="teachers.length > previewCount" type="button" class="show-more" @click="teachersExpanded = !teachersExpanded">
        {{ teachersExpanded ? 'Ver menos' : 'Ver todos os professores' }}
        <i :class="teachersExpanded ? 'mdi mdi-chevron-up' : 'mdi mdi-chevron-down'"></i>
      </button>
    </section>

    <section v-if="students.length" class="member-group">
      <div class="group-header">
        <i class="mdi mdi-account-group-outline" aria-hidden="true"></i>
        <h3>Alunos</h3>
        <span class="group-count">{{ students.length }}</span>
      </div>
      <ul class="students">
        <li v-for="student in visibleStudents" :key="student.id">
          <button type="button" class="member-link" :aria-label="'Ver aluno ' + (student.user?.name || '')" @click="goToStudent(student.id)">
            <img v-if="student.imagem_perfil?.url || student.imagem_perfil?.file"
              :src="student.imagem_perfil.url || student.imagem_perfil.file" :alt="student.user?.name || 'Aluno'" />
            <span v-else class="avatar-placeholder mdi mdi-account" aria-hidden="true"></span>
            <span class="member-label">
              <strong :title="student.user?.name">{{ student.user?.name || 'Aluno' }}</strong>
            </span>
          </button>
        </li>
      </ul>
      <button v-if="students.length > previewCount" type="button" class="show-more" @click="studentsExpanded = !studentsExpanded">
        {{ studentsExpanded ? 'Ver menos' : 'Ver todos os alunos' }}
        <i :class="studentsExpanded ? 'mdi mdi-chevron-up' : 'mdi mdi-chevron-down'"></i>
      </button>
    </section>
    <p v-if="!teachers.length && !students.length" class="empty-members">Nenhum participante cadastrado.</p>
  </div>
</template>
<style scoped src="./membersOfTeamComponent.css"></style>
