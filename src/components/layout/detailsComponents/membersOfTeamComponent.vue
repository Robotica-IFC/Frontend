<script setup>
import router from '@/router'

const props = defineProps({
  teachers: {
    required: true,
  },
  students: {
    required: true,
  },
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
    <ul class="teachers">
      <li v-for="t in props.teachers" :key="t.id" @click="goToTeacher(t.id)">
        <img
          class="image-teacher"
          :src="t.imagem_perfil?.url || t.imagem_perfil?.file"
          :alt="t.user?.name"
        />
        <div class="text">
          <h2>Professor: {{ t.user?.name }}</h2>
          <h3>
            {{ t.user?.email }}
          </h3>
        </div>
      </li>
    </ul>

    <ul class="students">
      <li v-for="s in props.students" :key="s.id" @click="goToStudent(s.id)">
        <img :src="s.imagem_perfil?.url || s.imagem_perfil?.file" :alt="s.user?.name" />
        <h2>{{ s.user?.name }}</h2>
      </li>
    </ul>
  </div>
</template>
<style scoped src="./membersOfTeamComponent.css"></style>
