<script setup>
import { useAuthStore } from "@/store/authStore";
import router from "@/router";
import sideBarComponent from "./sideBarComponentComponent.vue";
import { useTemplateStore } from "@/store/template";
import { useNotificationsStore } from '@/store/notificationsStore';

const templateStore = useTemplateStore();
const authStore = useAuthStore();
const notificationsStore = useNotificationsStore();
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
        <button
          type="button"
          class="menu-toggle"
          :aria-expanded="templateStore.sidebar"
          :aria-label="notificationsStore.unread ? `Abrir menu, ${notificationsStore.unread} notificações não lidas` : 'Abrir menu'"
          @click="templateStore.sidebar = !templateStore.sidebar"
        >
          <span class="mdi mdi-menu" aria-hidden="true"></span>
          <span v-if="notificationsStore.unread" class="notification-dot" aria-hidden="true"></span>
        </button>
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
        <span v-else class="mdi mdi-account-circle-outline" @click="router.push('/edit')"></span>
      </li>
    </ul>
  </header>

  <sideBarComponent v-if="templateStore.sidebar" />
</template>

<style scoped src="./appHeaderComponent.css"></style>
