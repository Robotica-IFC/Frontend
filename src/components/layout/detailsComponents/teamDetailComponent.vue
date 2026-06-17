<script setup>
import { defineProps, onMounted, computed } from "vue";
import appArrow from "@/components/appArrow.vue";
import requestToParticipateComponent from "@/components/requestToParticipateComponent.vue";
import { useTeamStore } from "@/store/teamStore";
import router from "@/router";

const teamStore = useTeamStore();

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});
onMounted(async () => {
  await teamStore.getTeamById(props.id);
  console.log(teamStore.actualTeam);
});

const team = computed(() => teamStore.actualTeam);
</script>
<template>
  <div class="page">
    <div class="top">
      <appArrow @back="router.push('/team')"></appArrow>
      <requestToParticipateComponent></requestToParticipateComponent>
    </div>
    <div class="info">
      <div class="principal-info">
        <img :src="team.image_perfil?.file" alt="" class="logo-team" />
        <div class="principal-text">
          <h1>
            {{ team.nome }}
          </h1>
          <h2>
            <span class="mdi mdi-map-marker"></span>
            {{ team.professores?.[0]?.instituicao.nome }} -
            {{ team.professores?.[0]?.instituicao.cidade }}/{{
              team.professores?.[0]?.instituicao.estado
            }}
          </h2>
          <!-- <h3>
          
          </h3> -->
        </div>
      </div>
      <p class="bio">
        {{ team.descricao }}
      </p>
      <ul class="categories">
        <li v-for="c in team.categorias" :key="c.id">
          {{ c.nome }}
        </li>
      </ul>
      <div class="members">
        <ul class="teachers">
          <li v-for="t in team.professores" :key="t.id">
          <img class="image-teacher" :src="t.imagem_perfil?.file" alt="">
            <div class="text">
              <h2>Professor: {{ t.user.name }}</h2>
              <h3>
                {{ t.user.email }}
              </h3>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<style scoped>
div.page {
  width: 100%;
}
div.top {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
div.info {
  margin-top: 15px;
}
div.info div.principal-info img {
  width: 30%;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--principal-claro);
}
div.info div.principal-info {
  display: flex;
  align-items: center;
  gap: 10px;

  & h1 {
    font-size: 25px;
    color: var(--principal-claro);
  }
  & h2 {
    font-size: 15px;
    font-weight: 400;
    margin-top: 5px;

    & span {
      color: var(--principal-claro);
    }
  }
}
div.info {
  & p.bio {
    font-size: 13px;
    margin-top: 10px;
  }

  & ul.categories {
    display: flex;
    list-style: none;
    gap: 10px;

    & li {
      margin-top: 10px;
      background-color: var(--principal-claro);
      color: white;
      padding: 5px 10px;
      border-radius: 10px;
      font-size: 13px;
    }
  }
}

ul.teachers{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin-top: 10px;

  & li{
    width: 50%;
    display: flex;
    align-items: center;
    gap: 10px;

    & img{
      width: 30%;
      aspect-ratio: 1 / 1;
      object-fit: cover;

    }
    & h2{
      font-size: 15px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    & h3{
      font-size: 10px;
      font-weight: 400;
    }
  }
}
</style>
