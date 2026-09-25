<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useStorageStore } from '@/store/storageStore'
import appArrow from '../appArrow.vue'
import filterStorageComponent from './filterStorageComponent.vue'

const props = defineProps({
  id: {
    type: [Number, String],
    required: true,
  },
})

const router = useRouter()
const storageStore = useStorageStore()

const { storage } = storeToRefs(storageStore)

onMounted(async () => {
  await storageStore.getStorageById(props.id)
})
</script>

<template>
  <div class="top">
    <appArrow @back="router.back()"></appArrow>
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
        <span class="mdi mdi-map-marker"></span>
        <p>{{ storage.equipe.instituicao.sigla }}</p>
      </div>
    </div>
  </div>

  <filterStorageComponent :storage-id="props.id"></filterStorageComponent>
</template>

<style scoped>
.top {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 15px;
}

.team-details {
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 10px;

  & img {
    width: 30%;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    object-fit: cover;
  }

  & h2 {
    font-size: 23px;
    color: var(--principal-claro);
  }

  & .loc {
    display: flex;
    align-items: center;

    & p {
      font-size: 12px;
    }

    & .mdi {
      color: var(--principal-claro);
      font-size: 17px;
    }
  }
}
</style>