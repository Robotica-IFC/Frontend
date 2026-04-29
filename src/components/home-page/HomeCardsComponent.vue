<script setup>
import appButton from '../form/appButton.vue';
</script>

<template>
  <div class="page">
    <div class="card tutorial">
      <img src="/img/home/Home-Computer.png" alt="tutorial">
      <h2>Aprenda na Prática</h2>
      <p>Acesse conteúdos em vídeo e materiais educativos sobre robótica e programação.</p>
      <div class="btn">
        <appButton variant="card">Iniciar</appButton>
      </div>
    </div>
    <div class="card propor">
      <img src="/img/home/Home-lamp.png" alt="tutorial">
      <h2>Proponha novas ideias</h2>
      <p>Compartilhe sugestões criativas e contribua com futuras iniciativas em robótica.</p>
      <div class="btn">
        <appButton variant="card">Sugerir</appButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 30px 0;
}

div.card {
  margin-top: 0;
  text-align: center;
  width: 160px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
  padding: 10px;
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  margin: 0;
}

.card h2 {
  font-size: 16px;
  color: var(--h2-titulo);
}

.card p {
  font-size: 12px;
  max-width: 220px;
  margin: 0 auto;
}

.card img {
  width: 80%;
}

.card .btn {
  margin-top: 10px;
  width: 100%;
}

.propor img {
  width: 50%;
}
</style>