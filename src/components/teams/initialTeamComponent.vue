<script setup>
import { useTeamStore } from '@/store/teamStore'
import { onMounted } from 'vue'
import appHeaderComponent from '../layout/appHeaderComponent.vue';

const teamStore = useTeamStore()

onMounted(() => {
  teamStore.getTeams()
})
</script>

<template>
  <appHeaderComponent></appHeaderComponent>
  <div style="margin-top: 30px;">

    <div class="inicio">

    <div class="text">
      <h1>Equipes</h1>
      <p>Conheça as equipes da Robótica IFC, seus membros e os projetos que desenvolvem.</p>
    </div>

    <div class="equipes">
      <p class="numero">
      <span class="mdi mdi-account-multiple"></span>
      {{ teamStore.totalTeams || 0 }}
      </p>
      <p v-if="teamStore.totalTeams.length > 1" class="texto-equipe">Equipes registradas</p>
      <p v-else>Equipes registrada</p>
    </div>

    </div>

  </div>
</template>

<style setup>
.inicio{
  display: flex;
  align-items: center;
}

.text h1{
  color: var(--principal-claro);
  font-size: 25px;
}
.text p{
  font-weight: 400;
  font-size: 15px;
  margin-top: 10px;
}

.equipes{
  box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  text-align: center;
  color: var(--principal-claro);
  padding: 5px 15px;
  margin-left: 1px;
}
.equipes .texto-equipe{
  font-size: 13px;
}
.equipes .numero{
  font-size: 20px;
  font-weight: 600;
}
</style>
