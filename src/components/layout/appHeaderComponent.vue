<script setup>
    import { useAuthStore } from '@/store/authStore';
    import router from '@/router';
    import { useTemplateStore } from '@/store/template';

    const templateStore = useTemplateStore()
    const authStore = useAuthStore()
</script>

<template>
    <header>
        <ul>
            <li><span class="mdi mdi-menu"></span></li>
            <li><img class="logo" src="/img/logo/logo-sem-fundo.png" alt="Logo"></li>
            <li>
                <img @click="router.push('/edit')" v-if="authStore.user?.imagem_perfil" class="perfil" :src="authStore.user?.imagem_perfil" :alt="authStore.user?.name">
                <span v-else class="mdi mdi-account-circle-outline"></span>
            </li>
        </ul>
    </header>
</template>

<style scoped>
header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 50px;
    background-color: white;
    z-index: 1000;
    border-bottom: 1px solid #eee;
}

ul {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    margin: 0;
    padding: 0 15px;
}

li {
    list-style: none;
    width: 100px;
    display: flex;
    align-items: center;
}

li:first-child {
    font-size: 30px;
    justify-content: flex-start;
}

li:nth-child(2) {
    justify-content: center;
    flex-grow: 1;
}

.logo {
    height: 88px;
    width: auto;
}

li:last-child {
    font-size: 35px;
    justify-content: flex-end;
}

.perfil {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    border: 1px solid black;
    object-fit: cover;
}
</style>