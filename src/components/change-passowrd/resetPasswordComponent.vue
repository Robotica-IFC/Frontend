<script setup>
import { useTemplateStore } from "@/store/template";
import { ref } from "vue";

import appArrow from "../appArrow.vue";
import appInput from "../form/appInput.vue";

const store = useTemplateStore();

const password = ref(false);
const passwordValue = ref("");

const confirmPassword = ref(false);
const confirmPasswordValue = ref("");
</script>

<template>

  <div class="page">
  
    <div class="arrow">
      <!--Botão para voltar à página anterior Ass: Laura-->
      <appArrow @click="store.changePassword = 1"></appArrow>
    </div>

    <img src="/src/assets/gif/acenar.gif" alt="Robo-acenando" />
    <h2>Resete sua senha:</h2>

    <div class="senha">

      <appInput
        :type="password ? 'text' : 'password'"
        name="password"
        v-model="passwordValue"
        :placeholder="'Digite uma nova senha'"
        :icon="'mdi mdi-lock-open'"
      >
        <span
          @click="password = !password"
          :class="password ? 'mdi mdi-eye-off-outline' : 'mdi mdi-eye-outline'"
        ></span>
      </appInput>
      <!--Fazer a senha ficar visível ou não Ass:Lucas-->

      <appInput
        :type="password ? 'text' : 'password'"
        name="password"
        v-model="confirmPasswordValue"
        :placeholder="'Confirme a nova senha'"
        :icon="'mdi mdi-lock-open'"
      >
        <span
          @click="confirmPassword = !confirmPassword"
          :class="confirmPassword ? 'mdi mdi-eye-off-outline' : 'mdi mdi-eye-outline'"
        ></span>
      </appInput>
      <!--Fazer a senha ficar visível ou não Ass:Lucas-->
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 100%;
}

.arrow {
  width: 100%;
  display: flex;
  justify-content: flex-start;
}

img {
  width: 250px;
  height: auto;
  margin-top: -30px;
}

h2 {
  font-size: 23px;
  margin: 30px 0 20px;
  text-align: center;
}

.mdi {
  display: flex;
  justify-content: right;
  margin-left: 40px;
  color: var(--principal-claro);
  font-size: 20px;
}
</style>
