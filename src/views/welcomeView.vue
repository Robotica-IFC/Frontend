<script setup>
import appInput from "@/components/form/appInput.vue";
import appArrow from "@/components/appArrow.vue";
import appButton from "@/components/form/appButton.vue";
import { ref } from "vue";
import router from "@/router";

const password = ref(false)

const passwordValue = ref('')
</script>

<template>
  <div class="page">
    <div class="arrow">
      <appArrow></appArrow>
    </div>

    <img src="/src/assets/gif/acenar.gif" alt="Robo-acenando" />

    <h2>Bem-vindo(a) à Robótica!</h2>

    <form>
      <appInput name="email" style="margin-bottom: 20px;" :placeholder="'E-Mail'" :icon="'mdi mdi-email-outline'"></appInput>

      <appInput :type="password ? 'text' : 'password'" name="password" v-model="passwordValue" :placeholder="'Senha'" :icon="'mdi mdi-lock-open'">
          <span @click="password = !password" :class="password ? 'mdi mdi-eye-off-outline' : 'mdi mdi-eye-outline'"></span>
      </appInput>

      <div class="botao">
        <appButton variant="primary" label="Entrar"></appButton>
        <appButton @click="router.push('/change-password')" variant="secondary" label="Esqueceu a senha?" ></appButton>
      </div>
    </form>

    <footer>
      <div class="footer-text">
        <span>Não possui um cadastro?</span>
        <appButton @click="router.push('/sign')" variant="secondary" label="Cadastre-se" />
      </div>
    </footer>
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

form button {
  background-color: var(--fundo-claro);
  border: none;
  font-size: 20px;
  color: var(--principal-secundario-claro);
}

form span {
  display: flex;
  justify-content: right;
  margin-left: 40px;
  color: var(--principal-secundario-claro);
  font-size: 20px;
}

.botao {
  margin-top: 25px;
}

.footer-text .btn {
  margin-top: 0;
}

.footer-text {
  font-size: 16px;
  display: flex;
  gap: 5px;
  align-items: center;
  width: 100%;
  height: 50px;
  justify-content: center;
  margin-top: auto;
}
</style>