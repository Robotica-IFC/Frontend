<script setup>
import { useStudentStore } from '@/store/studentStore';
import { useTeacherStore } from '@/store/teacherStore';
import { onMounted } from 'vue';
import { useInstituteStore } from '@/store/instituteStore';
import { useAuthStore } from '@/store/authStore';

const studentStore = useStudentStore()
const teacherStore = useTeacherStore()
const instituteStore = useInstituteStore()
const authStore = useAuthStore()

onMounted(async () => {
    await studentStore.getStudents()
    await teacherStore.getTeachers()
    await instituteStore.getInstitutes()
    console.log(authStore.user)
})
</script>

<template>
    <div class="page">
        <div class="me">
            <h1>Me</h1>
            <p>{{ authStore.user?.name }} / {{ authStore.user?.username }}</p>
            <img :src="authStore.user?.imagem_perfil" :alt="authStore.user?.name">
        </div>
        <div class="a">
            <h1>alunos max10</h1>
            <ul>
                <li v-for="a in studentStore.students" :key="a.id">
                    <p>
                        {{ a.user.name }} | {{ a.ativo ? 'Ativo' : 'Inativo' }}
                    </p>

                    <a v-if="a.imagem_perfil" :href="a.imagem_perfil.file" target="_blank">
                        <img :src="a.imagem_perfil.file" :alt="a.nome">
                    </a>
                    <img v-else src="/img/default2.jpg" alt="Imagem padrão">
                </li>
            </ul>
        </div>
        <div class="a">
            <h1>Professores max10</h1>
            <ul>
                <li v-for="a in teacherStore.teachers" :key="a.id">
                    <p>
                        {{ a.user.name }} | {{ a.ativo ? 'Ativo' : 'Inativo' }}
                    </p>

                    <a v-if="a.imagem_perfil" :href="a.imagem_perfil.file" target="_blank">
                        <img :src="a.imagem_perfil.file" :alt="a.nome">
                    </a>
                    <img v-else src="/img/default2.jpg" alt="Imagem padrão">
                </li>
            </ul>
        </div>
        <div class="a">
            <h1>Institutos max10</h1>
            <ul>
                <li v-for="a in instituteStore.institutes" :key="a.id">
                    <p>
                        {{ a.nome }}
                    </p>
                    <a v-if="a.logo" :href="a.logo.file" target="_blank">
                        <img :src="a.logo.file" :alt="a.nome">
                    </a>
                    <img v-else src="/img/default2.jpg" alt="Imagem padrão">
                </li>
            </ul>
        </div>
    </div>
</template>
<style scoped>
div.page {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

ul {
    width: 100%;
    max-width: 800px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 0;
}

li {
    width: 100%;
    background-color: var(--principal-claro);
    padding: 15px;
    list-style: none;
    color: #ffff;
    font-family: (sans-serif);
    font-weight: normal;
    font-size: 25px;
    text-align: center;
}

li img {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    object-fit: cover;
    margin-top: 10px;
}

.a {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-bottom: 50px;
}
</style>