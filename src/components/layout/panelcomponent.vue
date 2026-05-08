<script setup>
import appArrow from '../appArrow.vue'
// import { useTemplateStore } from '@/store/template'
import router from '@/router'
import { useAuthStore } from '@/store/authStore'
import { onMounted } from 'vue'
import appButton from '../form/appButton.vue'

// const templateStore = useTemplateStore()
const authStore = useAuthStore()
const user = authStore.user
</script>
<template>
  <div class="page">
    <div class="top">
      <appArrow @back="router.back"></appArrow>
      <span class="mdi mdi-square-edit-outline"></span>
    </div>
    <div class="data">
      <div class="first-data">
        <dvi class="name-image">
          <img class="profile-image" :src="user.imagem_perfil" :alt="user.name" />
          <div>
            <h1>{{ user.username }}</h1>
            <h2>{{ user.email }}</h2>
            <h3>{{ user.name }}</h3>
          </div>
        </dvi>
        <p class="desc">{{ user.descricao }}</p>
      </div>
    </div>
    <div class="logout">
        <appButton @click="authStore.logout()">Sair</appButton>
    </div>
  </div>
</template>
<style scoped>
.total {
  width: 100%;
  min-height: 100dvh;
  z-index: 999;
}
.top {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 15px;
}

.mdi {
  font-size: 25px;
}

div.first-data{
    padding: 30px;
}

img.profile-image{
    width: 32%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    border: solid gray 1px;
    border-radius: 50%;
}
.name-image{
    display: flex;
    align-items: center;
    gap: 15px;

    & div{
        width: 50%;

        & h1{
            font-size: 25px;
        }
        & h2, h3{
            font-size: 12.5px;
            font-weight: 400;
        }
    }
}
.desc{
    margin-top: 10px;   
    font-size: 13.5px;
    text-align: justify;
}
</style>
