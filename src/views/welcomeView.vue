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

<style scoped>
/* ============ MOBILE (base) ============ */
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 100%;
}

/* Contêiner interno: no mobile se comporta como o .page original */
.welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  width: 100%;
}

.arrow {
  width: 100%;
  display: flex;
  justify-content: flex-start;
}

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-card {
  display: flex;
  flex-direction: column;
  align-items: center;
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
  cursor: pointer;
}

.botao {
  margin-top: 25px;
  display: flex;
  flex-direction: column;
  gap: 10px;
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

/* Elementos que só existem no desktop */
.title-desktop,
.tagline,
.card-head,
.signup-desktop,
.news {
  display: none;
}

/* ============ DESKTOP ============ */
@media (min-width: 900px) {
  .page {
    height: auto;
  }

  .welcome {
    flex: none;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
      "arrow arrow"
      "hero  card"
      "news  news";
    column-gap: 64px;
    align-items: center;
    height: auto;
    min-height: 100vh;
    max-width: 1400px;
    margin: 0 auto;
    padding: 40px 48px 48px;
  }

  /* Seta */
  .arrow {
    grid-area: arrow;
    align-self: start;
  }
  .arrow :deep(.mdi) {
    font-size: 40px;
  }

  /* Coluna esquerda */
  .hero {
    grid-area: hero;
    align-items: flex-start;
    justify-content: center;
  }

  .title-mobile,
  footer {
    display: none;
  }

  .title-desktop {
    display: block;
    order: 1;
    font-size: clamp(44px, 4.2vw, 64px);
    line-height: 1.15;
    font-weight: 700;
    color: var(--h2-titulo);
  }
  .title-desktop span {
    color: var(--botao-claro);
  }

  .tagline {
    display: block;
    order: 2;
    margin-top: 56px;
    max-width: 640px;
    font-size: clamp(22px, 2.1vw, 32px);
    font-weight: 300;
    line-height: 1.25;
    color: var(--texto-claro);
  }

  img {
    order: 3;
    width: clamp(300px, 28vw, 440px);
    margin: 48px 0 0 clamp(40px, 6vw, 96px);
  }

  /* Card de login */
  .login-card {
    grid-area: card;
    justify-self: end;
    width: 100%;
    max-width: 640px;
    align-items: stretch;
    padding: 72px 56px 56px;
    background: var(--fundo-claro);
    border-radius: 24px;
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.14);
  }

  .card-head {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 56px;
  }
  .card-icon {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background-color: var(--destaque-claro);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 36px;
  }
  .card-icon .mdi {
    font-size: 72px;
    color: #fff;
  }
  .card-head h3 {
    font-size: clamp(30px, 2.6vw, 40px);
    font-weight: 700;
    color: var(--h2-titulo);
  }
  .card-head p {
    margin-top: 10px;
    font-size: 18px;
    color: var(--texto-claro);
  }

  /* Formulário: inputs ocupam toda a largura do card */
  form {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  form :deep(div.input) {
    width: 100%;
    margin: 0 0 36px;
    padding-bottom: 8px;
    font-size: 24px;
    align-items: center;
  }
  form :deep(input) {
    font-size: 22px;
    font-family: inherit;
    background: transparent;
    color: var(--texto-claro);
  }
  form :deep(.mdi) {
    font-size: 28px;
  }
  form span {
    margin-left: 0;
    font-size: 26px;
    color: var(--principal-claro);
  }

  /* "Esqueceu a senha?" fica acima do botão */
  .botao {
    display: contents;
  }
  .forgot {
    order: 1;
    margin-top: -20px;
  }
  .forgot :deep(.btn) {
    text-align: left;
    margin-top: 0;
  }
  .forgot :deep(button) {
    padding: 0;
    font-size: 17px;
    text-decoration: underline;
    cursor: pointer;
  }

  .submit {
    order: 2;
    margin-top: 28px;
  }
  .submit :deep(button) {
    border-radius: 4px;
    font-size: 20px;
    font-weight: 500;
    padding: 16px;
  }

  /* Cadastro dentro do card */
  .signup-desktop {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    margin-top: 28px;
    font-size: 16px;
  }
  .signup-desktop :deep(.btn) {
    margin-top: 0;
  }
  .signup-desktop :deep(button) {
    cursor: pointer;
  }

  /* Banner de novidades */
  .news {
    grid-area: news;
    display: flex;
    align-items: center;
    gap: 20px;
    margin-top: 48px;
    padding: 16px 28px;
    background: var(--fundo-claro);
    border-radius: 14px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    font-size: 20px;
  }
  .news-icon {
    font-size: 32px;
    color: var(--destaque-claro);
  }
  .news p {
    flex: 1;
  }
  .news strong {
    font-weight: 600;
    color: var(--destaque-claro);
    margin-right: 4px;
  }
  .news-btn {
    border: none;
    border-radius: 8px;
    padding: 10px 20px;
    font-size: 18px;
    color: #fff;
    background-color: var(--destaque-claro);
    cursor: pointer;
    transition: background-color 0.2s;
  }
  .news-btn:hover {
    background-color: var(--botao-claro);
  }
}

/* Telas desktop menores: empilha o conteúdo */
@media (min-width: 900px) and (max-width: 1100px) {
  .welcome {
    column-gap: 32px;
    padding: 32px 28px 36px;
  }
  .login-card {
    padding: 48px 32px 40px;
  }
  .news {
    font-size: 17px;
  }
}
</style>