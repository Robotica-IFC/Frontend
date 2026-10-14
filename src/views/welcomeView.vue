<script setup>
import appInput from "@/components/form/appInput.vue";
import appArrow from "@/components/appArrow.vue";
import appButton from "@/components/form/appButton.vue";
import { ref, reactive, onMounted, onUnmounted } from "vue";
import { useAuthStore } from "@/store/authStore";
import router from "@/router";

const authStore = useAuthStore();
const showPassword = ref(false);

const credentials = reactive({
  email: '',
  password: ''
});

// Desktop: usado só para trocar o texto do botão ("Continuar" x "Entrar")
const isDesktop = ref(false);
let mediaQuery;
const updateDesktop = (e) => (isDesktop.value = e.matches);

const handleLogin = async () => {
  try {
    await authStore.login(credentials);
  } catch (error) {
    alert("Email ou senha inválidos.");
  }
};

onMounted(async () => {
  mediaQuery = window.matchMedia("(min-width: 900px)");
  isDesktop.value = mediaQuery.matches;
  mediaQuery.addEventListener("change", updateDesktop);

  if (authStore.isAuthenticated) {
    try {
      await authStore.refreshUserSession();

      router.push('/home-page');
    } catch (error) {
      console.warn("Sessão expirada. Permanecendo na tela de login.");
    }
  }
});

onUnmounted(() => {
  mediaQuery?.removeEventListener("change", updateDesktop);
});
</script>

<template>
  <div class="page">
   <div class="welcome">

    <section class="hero">
      <img src="/src/assets/gif/acenar.gif" alt="Robo-acenando" />

      <h2 class="title-mobile">Bem-vindo(a) à Robótica!</h2>

      <h1 class="title-desktop">
        Bem vindo(a)<br />
        a <span>Robótica</span>
      </h1>
      <p class="tagline">
        Sua plataforma para aprender, criar e transformar ideias em inovação.
      </p>
    </section>

    <section class="login-card">
      <div class="card-head">
        <div class="card-icon">
          <span class="mdi mdi-login"></span>
        </div>
        <h3>Acesse sua conta</h3>
        <p>Entre para continuar sua jornada.</p>
      </div>

      <form @submit.prevent="handleLogin">
        <appInput
          v-model="credentials.email"
          name="email"
          style="margin-bottom: 20px;"
          placeholder="E-mail"
          icon="mdi mdi-email-outline"
        />

        <appInput
          v-model="credentials.password"
          :type="showPassword ? 'text' : 'password'"
          name="password"
          placeholder="Senha"
          icon="mdi mdi-lock-open"
        >
          <span
            @click="showPassword = !showPassword"
            :class="showPassword ? 'mdi mdi-eye-off-outline' : 'mdi mdi-eye-outline'"
          ></span>
        </appInput>

        <div class="botao">
          <div class="submit">
            <appButton
              type="submit"
              variant="primary"
              :label="isDesktop ? 'Continuar' : 'Entrar'"
            />
          </div>

          <div class="forgot">
            <appButton
              type="button"
              @click="router.push('/change-password')"
              variant="secondary"
              label="Esqueceu a senha?"
              width="auto"
            />
          </div>
        </div>
      </form>

      <!-- Cadastro dentro do card (apenas desktop) -->
      <div class="signup-desktop">
        <span>Não possui um cadastro?</span>
        <appButton @click="router.push('/sign')" variant="secondary" label="Cadastre-se" width="auto" />
      </div>
    </section>

    <!-- Banner de novidades (apenas desktop) -->

    <!-- Cadastro no rodapé (apenas mobile) -->
    <footer>
      <div class="footer-text">
        <span>Não possui um cadastro?</span>
        <appButton @click="router.push('/sign')" variant="secondary" label="Cadastre-se" />
      </div>
    </footer>
   </div>
  </div>
</template>

<style scoped src="./welcomeView.css"></style>