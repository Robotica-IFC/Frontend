<script setup>
import { computed, ref } from 'vue'
import router from '@/router'

const props = defineProps({
  teachers: {
    required: true,
  },
  students: {
    required: true,
  },
})

const teachersExpanded = ref(false)
const studentsExpanded = ref(false)

const visibleTeachers = computed(() => {
  const teachers = props.teachers || []
  return teachersExpanded.value ? teachers : teachers.slice(0, 4)
})

const visibleStudents = computed(() => {
  const students = props.students || []
  return studentsExpanded.value ? students : students.slice(0, 4)
})

function goToStudent(id) {
  router.push({ name: 'studentDetails', params: { id } })
}

function goToTeacher(id) {
  router.push({ name: 'teacherDetails', params: { id } })
}
</script>
<template>
  <div class="members">
    <div v-if="props.teachers?.length" class="member-group">
      <div class="group-header">
        <span class="mdi mdi-account-tie"></span>
        <h3>Professores</h3>
      </div>

      <ul class="teachers">
        <li v-for="t in visibleTeachers" :key="t.id" @click="goToTeacher(t.id)">
          <img
            class="image-teacher"
            :src="t.imagem_perfil?.url || t.imagem_perfil?.file"
            :alt="t.user?.name"
          />
          <div class="text">
            <h2>Professor: {{ t.user?.name }}</h2>
            <h3>{{ t.user?.email }}</h3>
          </div>
        </li>
      </ul>

      <button
        v-if="props.teachers.length > 5"
        type="button"
        class="show-more"
        @click="teachersExpanded = !teachersExpanded"
      >
        {{ teachersExpanded ? 'Ver menos' : 'Ver mais' }}
      </button>
    </div>

    <div v-if="props.students?.length" class="member-group">
      <div class="group-header">
        <span class="mdi mdi-account-group"></span>
        <h3>Alunos</h3>
      </div>

      <ul class="students">
        <li v-for="s in visibleStudents" :key="s.id" @click="goToStudent(s.id)">
          <img :src="s.imagem_perfil?.url || s.imagem_perfil?.file" :alt="s.user?.name" />
          <h2>{{ s.user?.name }}</h2>
        </li>
      </ul>

      <button
        v-if="props.students.length > 5"
        type="button"
        class="show-more"
        @click="studentsExpanded = !studentsExpanded"
      >
        {{ studentsExpanded ? 'Ver menos' : 'Ver mais' }}
      </button>
    </div>
  </div>
</template>
<style scoped src="./membersOfTeamComponent.css"></style>
