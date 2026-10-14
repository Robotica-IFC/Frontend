<script setup>
import appButton from '../form/appButton.vue';
</script>

<template>
  <div class="page">
    <div class="card tutorial">

    <img src="/img/home/Home-Computer.png" alt="tutorial">

      <div class="info">
      <h2>Aprenda na Prática</h2>
      <p>Acesse conteúdos em vídeo e materiais educativos sobre robótica e programação.</p>
       <div class="btn">
        <appButton variant="card">Iniciar</appButton>
      </div>
      </div>


    </div>
    <div class="card propor">
     <img src="/img/home/Home-lamp.png" alt="tutorial">
    <div class="info">

      <h2>Proponha novas ideias</h2>
      <p>Compartilhe sugestões criativas e contribua com futuras iniciativas em robótica.</p>
      <div class="btn">
        <appButton variant="card">Sugerir</appButton>
      </div>
    </div>
    </div>
  </div>
</template>

<style scoped src="./homeCardsComponent.css"></style>
