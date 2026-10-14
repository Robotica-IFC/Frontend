<script setup>
import { useAuthStore } from "@/store/authStore";
import router from "@/router";
import sideBarComponent from "./sideBarComponentComponent.vue";
import { useTemplateStore } from "@/store/template";

const templateStore = useTemplateStore();
const authStore = useAuthStore();
</script>

<template>
  <div
    v-if="templateStore.sidebar"
    class="sidebar-overlay"
    @click="templateStore.sidebar = false"
  ></div>

  <header>
    <ul>
      <li>
        <span
          class="mdi mdi-menu"
          @click="templateStore.sidebar = !templateStore.sidebar"
        ></span>
      </li>
      <li @click="router.push('/home-page')">
        <picture>
          <source media="(min-width: 950px)" srcset="/img/logo/Logo-preta.png" />
          <img class="logo" src="/img/logo/logo-sem-fundo.png" alt="Logo" />
        </picture>
      </li>
      <li>
        <img
          @click="router.push('/edit')"
          v-if="authStore.user?.imagem_perfil"
          class="perfil"
          :src="authStore.user?.imagem_perfil"
          :alt="authStore.user?.name"
        />
        <span v-else class="mdi mdi-account-circle-outline"></span>
      </li>
    </ul>
  </header>

  <sideBarComponent v-if="templateStore.sidebar" />
</template>

<style scoped src="./appHeaderComponent.css"></style>
