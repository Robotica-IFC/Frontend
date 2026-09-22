<script setup>
import { useStorageStore } from '@/store/storageStore'
import { onMounted, ref } from 'vue'
import appArrow from '../appArrow.vue'
import router from '@/router'
import inDevelopmentComponent from '../inDevelopmentComponent.vue'

const props = defineProps({
  id: {
    type: [Number, String], // Aceita String caso a rota envie como string
    required: true,
  },
})

const storageStore = useStorageStore()
const storage = ref(null)

onMounted(async () => {
  storage.value = await storageStore.getStorageById(props.id)
})
</script>

<template>
  <div class="top">
    <appArrow @back="router.back"></appArrow>
  </div>

  <div v-if="storage && storage.equipe" class="team-details">
    <img
      v-if="storage.equipe.image_perfil?.file || storage.equipe.image_perfil?.url"
      :src="storage.equipe.image_perfil.file || storage.equipe.image_perfil.url"
      :alt="storage.equipe.nome"
    />
    <img v-else src="/img/Default.webp" alt="Equipe sem imagem" />
    <div class="nome">
      <h2>{{ storage.equipe.nome }}</h2>
      <div class="loc">
        <span class="mdi mdi-map-marker"></span><p>{{ storage.equipe.instituicao.sigla }}</p>
      </div>
    </div>
  </div>

  <div v-else>
    <p>Carregando estoque...</p>
  </div>

  <inDevelopmentComponent></inDevelopmentComponent>

</template>

<style scoped>
.top {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 15px;
}

.team-details{
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 10px;

  & img{
    width: 30%;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
  }

  & h2{
    font-size: 23px;
    color: var(--principal-claro);
  }

  & .loc{
    display: flex;
    align-items: center;

    & p {
      font-size: 12px;
    }

    & .mdi{
      color: var(--principal-claro);
      font-size: 17px;
    }
  }
}
</style>
