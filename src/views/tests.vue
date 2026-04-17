<script setup>
    import { useStudentStore } from '@/store/studentStore';
    import { onMounted } from 'vue';

    const studentStore = useStudentStore()

    onMounted(async () => {
        await studentStore.getStudents()
        console.log(studentStore.students)
    })
</script>

<template>
    <div class="page">
        <ul>
            <li v-for="a in studentStore.students" :key="a.id">
                <p>
                    {{ a.nome }} | {{ a.ativo ? 'Ativo' : 'Inativo' }}
                </p>
                
                <a v-if="a.imagem_perfil" :href="a.imagem_perfil.file" target="_blank">
                    <img :src="a.imagem_perfil.file" :alt="a.nome">
                </a>
                <img v-else src="/img/default2.jpg" alt="Imagem padrão">
            </li>
        </ul>
    </div>
</template>
<style scoped>
div.page{
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
    ul{
        width: 70%;
        display: flex;
        flex-direction:column ;
        gap: 20px;
    }
    li{
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
    li img{
        width: 100%;
        height: 30vh;
        border-radius: 50%;
        object-fit: cover;
        margin-top: 10px;
    }
</style>