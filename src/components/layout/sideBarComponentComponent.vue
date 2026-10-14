<script setup>
import { RouterLink } from 'vue-router';
import { useTemplateStore } from "@/store/template";
import appButtonComponent from "@/components/form/appButton.vue";
import { useAuthStore } from '@/store/authStore';

const templateStore = useTemplateStore();
const authStore = useAuthStore();
</script>

<template>
  <aside class="sidebar">
    <!-- X de fechar: aparece só no desktop -->
    <button type="button" class="close-x" @click="templateStore.sidebar = false">&times;</button>

    <nav class="sidebar-nav">
      <RouterLink to="/home-page" class="nav-link">
        <span class="mdi mdi-home-variant"></span> Página inicial
      </RouterLink>

      <RouterLink to="/team" class="nav-link">
        <span class="mdi mdi-account-group"></span> Equipes
      </RouterLink>

      <RouterLink to="/projects" class="nav-link">
        <span class="mdi mdi-laptop"></span> Projetos
      </RouterLink>

      <RouterLink to="/tutorials" class="nav-link">
        <span class="mdi mdi-play-box-multiple"></span> Tutoriais
      </RouterLink>

      <RouterLink v-if="authStore.user?.tipo == 'professor'" to="/teacher" class="nav-link">
        <span class="mdi mdi-account-tie"></span> Professor
      </RouterLink>

      <RouterLink to="/myTeams" class="nav-link">
        <span class="mdi mdi-account-group-outline"></span> Meus times
      </RouterLink>

      <RouterLink to="/about-us" class="nav-link">
        <span class="mdi mdi-information-outline"></span> Sobre Nós
      </RouterLink>
    </nav>

    <div class="sidebar-footer">
      <div class="dark-mode-toggle">
        <span class="mdi mdi-weather-night"></span>
        <span>Modo noturno</span>
        <input type="checkbox" class="toggle-checkbox" id="dark-mode" />
        <label for="dark-mode" class="toggle-label"></label>
      </div>
      <div class="close-side">
        <appButtonComponent
          label="Fechar"
          @click="templateStore.sidebar = false"
        />
      </div>
    </div>
  </aside>
</template>

<style scoped src="./sideBarComponentComponent.css"></style>
