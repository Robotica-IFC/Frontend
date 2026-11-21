<script setup>
import { RouterLink } from 'vue-router'

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer>
    <div class="footer-content">
      <div class="footer-top">
        <div class="footer-brand">
          <img src="/img/logo/Logo-footer.png" alt="Robótica IFC" />
        </div>

        <nav class="footer-nav" aria-label="Navegação do rodapé">
          <ul>
            <li><RouterLink to="/home-page">Início</RouterLink></li>
            <li><RouterLink to="/projects">Projetos</RouterLink></li>
            <li><RouterLink to="/team">Equipes</RouterLink></li>
            <li><RouterLink to="/about-us">Sobre nós</RouterLink></li>
            <li><RouterLink to="/termos-de-uso">Termos de Uso</RouterLink></li>
            <li><RouterLink to="/privacidade">Privacidade</RouterLink></li>
          </ul>
        </nav>
      </div>

      <div class="footer-bottom">
        <p>© {{ currentYear }} Robótica IFC. Todos os direitos reservados.</p>
        <p>Instituto Federal Catarinense — Campus Araquari</p>
      </div>
    </div>
  </footer>
</template>

<style scoped src="./appFooterComponent.css"></style>
