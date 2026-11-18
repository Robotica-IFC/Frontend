<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <section class="tudo">
    <button
      type="button"
      class="back-button"
      aria-label="Voltar para a página anterior"
      @click="router.back()"
    >
      <span class="mdi mdi-arrow-left" aria-hidden="true"></span>
    </button>

    <div class="left">
      <h1>Explore os projetos da Robótica IFC</h1>

      <p>
        Descubra ideias, acompanhe o desenvolvimento e participe da construção
        de soluções reais através da robótica.
      </p>
    </div>

    <div class="right">
      <img src="/img/project/projetos-banner-divulgacao.png" alt="Celular e megafone representando a divulgação de projetos" />
    </div>
  </section>
</template>

<style scoped src="./bannerProjectsComponent.css"></style>
