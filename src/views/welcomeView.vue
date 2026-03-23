<script setup>
import appInput from '@/components/form/appInput.vue';
import appArrow from '@/components/appArrow.vue';
import appButton from '@/components/form/appButton.vue';
</script>

<template>
    <div class="arrow">
        <appArrow> </appArrow>
    </div>

    <div class="page">
        <img src="/src/assets/gif/acenar.gif" alt="Robo-acenando">
        <h2>Bem-vindo(a) à Robótica!</h2>
        <form>
            <appInput :placeholder="'E-Mail'" :icon="'mdi mdi-email-outline'"></appInput>
            <appInput :placeholder="'Senha'" :icon="'mdi mdi-lock-open'">
                <button>
                    <span class="mdi mdi-eye-outline"></span>
                </button>
            </appInput>

            <div class="botao">
                <appButton :variant="'primary'" label="Entrar"> </appButton>
                <appButton label="Esqueceu a senha?" :variant="'secondary'"> </appButton>
            </div>
        </form>

        <footer>
            <div class="footer-text">
                <span>Não possui um cadastro?</span>
                <appButton variant="secondary" label="Cadastre-se" />
            </div>
        </footer>

    </div>
</template>
<style scoped>
div.page {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    margin: 0;
    width: 100%;
}

img {
    width: 250px;
    height: auto;
    margin: 0;
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
    color: var(--principal-secundario-claro)
}

form span {
    display: flex;
    justify-content: right;
    margin-left: 40px;
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
}
</style>