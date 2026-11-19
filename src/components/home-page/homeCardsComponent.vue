<script setup>
import appButton from '../form/appButton.vue'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const emit = defineEmits(['suggest'])
</script>

<template>
  <div class="page">
    <div id="activities-card" class="card activities">
      <img
        src="/img/home/home-card-acompanhe-suas-atividades.svg"
        alt="Ilustração de dispositivos para acompanhar suas atividades"
      />

      <div class="info">
        <h2>Acompanhe Suas Atividades</h2>
        <p>Fique por dentro das novidades e acompanhe suas atividades na Robótica IFC através das notificações.</p>
        <div class="btn">
          <appButton variant="card" @click="router.push({ name: 'notifications' })">Visualizar</appButton>
        </div>
      </div>
    </div>
    <div v-if="authStore.isAuthenticated" class="card propor">
      <img src="/img/home/home-card-proponha-novas-ideias.png" alt="Lâmpada representando novas ideias" />
      <div class="info">
        <h2>Proponha novas ideias</h2>
        <p>Compartilhe sugestões criativas e contribua com futuras iniciativas em robótica.</p>
        <div class="btn">
          <appButton variant="card" @click="emit('suggest')">Sugerir</appButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped src="./homeCardsComponent.css"></style>
