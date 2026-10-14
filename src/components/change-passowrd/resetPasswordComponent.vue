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

<style scoped src="./resetPasswordComponent.css"></style>
