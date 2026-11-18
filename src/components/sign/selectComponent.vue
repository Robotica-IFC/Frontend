<script setup>
import AuthLayout from '../layout/AuthLayout.vue'
import appButton from '../form/appButton.vue'
import { useTemplateStore } from '@/store/template'
import router from '@/router'

const templateStore = useTemplateStore()
</script>

<template>
  <AuthLayout
    title="Você quer se cadastrar como:"
    subtitle="Escolha seu perfil para começar sua jornada."
    @back="router.push('/')"
  >
    <div class="btns">
      <appButton @click="templateStore.sign = 1">
        <span class="btn-content">
          <span class="mdi mdi-account-school" aria-hidden="true"></span>
          Aluno
        </span>
      </appButton>
      <appButton @click="templateStore.sign = 2">
        <span class="btn-content">
          <span class="mdi mdi-human-male-board-poll" aria-hidden="true"></span>
          Professor
        </span>
      </appButton>
    </div>
    <template #footer>
      <appButton @click="router.push('/')" variant="secondary">Já possuo uma conta</appButton>
    </template>
  </AuthLayout>
</template>

<style scoped src="./selectComponent.css"></style>
