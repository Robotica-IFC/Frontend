<script setup>
import { defineProps, onMounted, ref } from 'vue'
import { useProjectStore } from '@/store/projectsStore'

const projectStore = useProjectStore()
const actualProject = ref(null)

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

onMounted(async () => {
  actualProject.value = null
  console.log('inicando')
  actualProject.value = await projectStore.getProjectById(props.id)
  console.log(actualProject)
})
</script>
<template v-if="actualProject">
  <div class="page" v-if="actualProject">
    <div class="top">
      <h1>
        {{ actualProject.titulo }}
      </h1>
      <p>
        {{ actualProject.descricao }}
      </p>
    </div>
  </div>
</template>
<style scoped>
div.top {
  width: 80%;
  margin-top: 30px;
  overflow-wrap: break-word;
  word-break: break-word;
  display: flex;
  flex-direction: column;
  gap: 20px;

  & h1{
    color: var(--principal-claro);
  }
  
  & p{
      white-space: pre-line;
      text-align: justify;
  }
}
</style>
