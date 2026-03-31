<script setup>
import { useStudent } from "@/composables/useStudent";
import { onMounted } from "vue";
import api from "@/plugins/axios";

const student = useStudent();

async function getImage(id) {    
  const response = await api.get(`/media/images/${id}`);

  console.log(response.data.results)

  return response.data.results.url
}
getImage()
onMounted(() => {
  student.getStudents();
});
</script>
<template>
  <ul>
    <li v-for="aluno in student.students.value" :key="aluno.id">
      {{ aluno.nome }} - {{ aluno.cpf }} -
      {{ getImage(aluno.imagem_perfil) }}
    </li>
  </ul>
</template>
