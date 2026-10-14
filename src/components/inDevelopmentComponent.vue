<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<template>
  <div class="in-development-container">
    <div class="content-card">
      <div class="icon-wrapper">
        <span class="mdi mdi-tools icon-main"></span>
        <span class="mdi mdi-cog icon-badge spin"></span>
      </div>

      <h1 class="title">Página em Desenvolvimento</h1>
      
      <p class="description">
        Estamos trabalhando duro para trazer essa funcionalidade para você! 
        Em breve esta área estará cheia de novidades.
      </p>

      <div class="status-badge">
        <span class="status-dot"></span>
        <span>Em breve</span>
      </div>

      <button class="btn-back" @click="goBack">
        <span class="mdi mdi-arrow-left"></span>
        Voltar para a página anterior
      </button>
    </div>
  </div>
</template>

<style scoped src="./inDevelopmentComponent.css"></style>