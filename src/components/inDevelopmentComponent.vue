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

<style scoped>
.in-development-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.content-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 450px;
  width: 100%;
  padding: 40px 25px;
  background-color: var(--card-bg, #ffffff);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.icon-wrapper {
  position: relative;
  margin-bottom: 25px;
  display: inline-flex;
}

.icon-main {
  font-size: 72px;
  color: var(--principal-claro, #3b82f6);
}

.icon-badge {
  position: absolute;
  top: -5px;
  right: -10px;
  font-size: 28px;
  color: var(--destaque-claro, #f59e0b);
}

.spin {
  animation: spin 8s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 12px 0;
}

.description {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 20px 0;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: #f3f4f6;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 25px;
}

.status-dot {
  width: 8px;
  height: 8px;
  background-color: var(--destaque-claro, #f59e0b);
  border-radius: 50%;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.2);
}

.btn-back {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: var(--principal-claro, #3b82f6);
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-back:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.btn-back:active {
  transform: translateY(0);
}
</style>