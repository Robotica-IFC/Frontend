<script setup>
import appButton from '../form/appButton.vue';
</script>

<template>
 <div class="page">
    <div class="tutorial">
    <img src="/img/home/Home-Computer.png" alt="tutorial">
    <h2>Aprenda na Prática</h2>
    <p>Acesse conteúdos em vídeo e materiais educativos sobre robótica e programação.</p>
    <div class="btn">
         <appButton variant="primary" label="Iniciar"></appButton>
    </div>
    </div>
 </div>
</template>

<style scoped>
.page {
  display: flex;
  justify-content: center;
  align-items: center;
}
div.tutorial {
    margin-top: 0; 
    text-align: center;
    width: 115px;
}
.tutorial h2 {
  font-size: 16px;
  color: var(--h2-titulo);
}
.tutorial p {
  font-size: 12px;
  max-width: 220px;
  margin: 0 auto;
}
.tutorial img {

}
</style>