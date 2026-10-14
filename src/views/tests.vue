<script setup>
import { useStudentStore } from '@/store/studentStore';
import { useTeacherStore } from '@/store/teacherStore';
import { onMounted } from 'vue';
import { useInstituteStore } from '@/store/instituteStore';
import { useAuthStore } from '@/store/authStore';
import { jwtDecode } from "jwt-decode";

const studentStore = useStudentStore()
const teacherStore = useTeacherStore()
const instituteStore = useInstituteStore()
const authStore = useAuthStore()

onMounted(async () => {
    await studentStore.getStudents()
    await teacherStore.getTeachers()
    await instituteStore.getInstitutes()
})
</script>

<template>
    <div class="page">
        <div class="me">
            <h1>Me</h1>
            <p>{{ authStore.user?.name }} / {{ authStore.user?.username }}</p>
            <img :src="authStore.user?.imagem_perfil" :alt="authStore.user?.name">
            <button @click="authStore.logout()">Sair</button>
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
<style scoped src="./tests.css"></style>