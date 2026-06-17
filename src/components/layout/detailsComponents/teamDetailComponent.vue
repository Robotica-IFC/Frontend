<script setup>
    import { defineProps, onMounted } from 'vue';
    import appArrow from '@/components/appArrow.vue';
    import requestToParticipateComponent from '@/components/requestToParticipateComponent.vue';
    import { useTeamStore } from '@/store/teamStore';

    const teamStore = useTeamStore()

    const props = defineProps({
        id: {
            type: String,
            required: true,
        }
    })
     onMounted(async() => {
        await teamStore.getTeamById(props.id)
        console.log(teamStore.actualTeam)
    })
</script>
<template>
    <div class="page">
    <div class="top">
        <appArrow></appArrow>
        <requestToParticipateComponent></requestToParticipateComponent>
    </div>
    <div class="info">
        <div class="principal-info">
        
        </div>
    </div>
        </div>
</template>
<style scoped>
div.page {
        width: 100%;
    }
    div.top{
        width: 100%;
        display: flex;
        justify-content: space-between;
    }
</style>