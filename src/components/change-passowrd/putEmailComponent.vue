<script setup>
import router from "@/router";
import appArrow from '../appArrow.vue';
import appButton from "../form/appButton.vue";
import appInput from "../form/appInput.vue";
import { useTemplateStore } from "@/store/template";

const store = useTemplateStore()

</script>

<template>

    <div class="page"> <!--Página geral Ass: Laura-->
        <div class="arrow"> <!--Botão para voltar à página anterior Ass: Laura-->
            <appArrow @click="router.push('/')"></appArrow>
        </div>

        <img src="/src/assets/gif/acenar.gif" alt="Robo-acenando" /> 
        <h2>Confirme seu e-mail</h2> 

        <appInput name="email" style="margin-bottom: 20px;" :placeholder="'E-Mail'" :icon="'mdi mdi-email-outline'">
        </appInput> <!--input que puxa o email Ass: Laura-->


        <div class="btn-continuar">
            <appButton variant="primary" label="Continuar" @click="store.changePassword = 1"></appButton> <!--Botão que leva para a próxima página Ass: Laura-->
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
  width: 260px;
  height: auto;
}

h2 {
    text-align: center;
    margin: 15px 0;
    font-size: 23px;
}

.btn-continuar {
    margin-top: 20px;
}

</style>
