<script setup>
import { computed, useId } from 'vue'
import robotImage from '@/assets/gif/acenar.gif'
import LoadingOverlay from '../LoadingOverlay.vue'
import { useAuthPageLoading } from '@/composables/useAuthPageLoading'

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  icon: { type: String, default: 'mdi-account-plus-outline' },
  back: { type: Boolean, default: true },
  busy: { type: Boolean, default: false },
  loadingMessage: { type: String, default: 'Aguarde...' },
  progressLabel: { type: String, default: 'Etapas do cadastro' },
})
defineEmits(['back'])
const titleId = useId()
const { pageLoading, pageImage } = useAuthPageLoading()
const isBusy = computed(() => pageLoading.value || props.busy)
</script>

<template>
  <div
    class="auth-layout"
    :class="{ 'auth-layout--login': !back }"
    :inert="isBusy"
    :aria-busy="isBusy"
  >
    <button
      v-if="back"
      class="auth-back"
      type="button"
      aria-label="Voltar"
      :disabled="isBusy"
      @click="$emit('back')"
    >
      <span class="mdi mdi-arrow-left" aria-hidden="true"></span>
    </button>

    <div class="auth-content">
      <section class="auth-hero" aria-label="Bem-vindo à Robótica">
        <h1>Bem vindo(a) a <span>Robótica</span></h1>
        <p>Sua plataforma para aprender, criar e transformar ideias em inovação.</p>
        <img ref="pageImage" :src="robotImage" alt="Robô acenando" />
      </section>

      <section class="auth-card" :aria-labelledby="titleId" :aria-busy="isBusy">
        <div class="auth-card-icon" aria-hidden="true">
          <span class="mdi" :class="icon"></span>
        </div>
        <h2 :id="titleId">{{ title }}</h2>
        <p v-if="subtitle" class="auth-subtitle">{{ subtitle }}</p>
        <div class="auth-form"><slot /></div>
        <div v-if="$slots.footer" class="auth-footer"><slot name="footer" /></div>
      </section>
    </div>

    <nav v-if="$slots.progress" class="auth-progress" :aria-label="progressLabel">
      <slot name="progress" />
    </nav>
  </div>
  <LoadingOverlay v-if="isBusy" :message="pageLoading ? 'Carregando página...' : loadingMessage" />
</template>

<style scoped src="./AuthLayout.css"></style>
