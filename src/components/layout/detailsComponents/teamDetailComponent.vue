<script setup>
import { defineProps, onMounted, computed } from "vue";
import appArrow from "@/components/appArrow.vue";
import requestToParticipateComponent from "@/components/requestToParticipateComponent.vue";
import teamProjectsComponent from "@/components/teams/teamProjectsComponent.vue";
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
});

function goToStudent(id) {
  router.push({ name: "studentDetails", params: { id } });
}
function goToTeacher(id) {
  router.push({ name: "teacherDetails", params: { id } });
}

const team = computed(() => teamStore.actualTeam);
</script>
<template>
  <div class="page">
    <div class="top">
      <appArrow @click="router.back()"></appArrow>
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
          <li v-for="t in team.professores" :key="t.id" @click="goToTeacher(t.id)">
            <img class="image-teacher" :src="t.imagem_perfil?.file" :alt="t.user.name" />
            <div class="text">
              <h2>Professor: {{ t.user.name }}</h2>
              <h3>
                {{ t.user.email }}
              </h3>
            </div>
          </li>
        </ul>
        <ul class="students">
          <li v-for="s in team.alunos" :key="s.id" @click="goToStudent(s.id)">
            <img :src="s.imagem_perfil.file" :alt="s.user.name" />
            <h2>{{ s.user.name }}</h2>
          </li>
        </ul>
      </div>
    </div>

    <teamProjectsComponent :team-id="props.id" />
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
  margin-top: 30px;
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

ul.teachers {
  display: flex;
  flex-wrap: wrap;
  margin-top: 30px;
  padding-bottom: 10px;
  gap: 10px;

  & li {
    width: 40%;
    display: flex;
    align-items: center;
    gap: 10px;
    word-wrap: wrap;
    padding: 0;

    & img {
      width: 40%;
      aspect-ratio: 1 / 1;
      object-fit: cover;
      border-radius: 50%;
    }
    & h2 {
      font-size: 12px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    & h3 {
      font-size: 8px;
      font-weight: 400;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

ul.students {
  display: flex;
  flex-wrap: wrap;
  padding-top: 10px;
  border-top: 1px solid var(--principal-claro);
  gap: 20px;
  align-items: center;
  list-style: none;

  & li {
    width: 15%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 2px;

    & {
      img {
        width: 100%;
        aspect-ratio: 1/1;
        object-fit: cover;
        border-radius: 50%;
      }

      & h2 {
        text-align: center;
        font-size: 10px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}

@media (min-width: 950px) {
    div.page {
        max-width: none;
        width: 100vw;
        padding: 80px 5%;
        box-sizing: border-box;
  }

div.top {
    margin-top: 10px;
  }

  div.info {
    margin-top: 25px;
  }

  div.info div.principal-info {
    gap: 25px;
  }
  div.info div.principal-info img {
    width: 140px;
    flex-shrink: 0;
  }
  div.info div.principal-info h1 {
    font-size: 36px;
  }
  div.info div.principal-info h2 {
    font-size: 16px;
    margin-top: 8px;
  }

  div.info p.bio {
    font-size: 15px;
    max-width: none;
    margin-top: 15px;
    line-height: 1.5;
    font-size: 1.1rem;
  }

  div.info ul.categories li {
    font-size: 14px;
    padding: 5px 25px;
    margin-top: 15px;
    margin-bottom: 20px
  }

  div.members {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 20px;
  }

  ul.teachers {
    margin-top: 0;
    padding-bottom: 0;
    padding-right: 30px;
    margin-right: 30px;
    border-right: 1px solid var(--principal-claro);
    flex-wrap: wrap;
  }
  ul.teachers li {
    width: auto;
    flex-direction: column;
    text-align: center;
    gap: 10px;
    flex-shrink: 0;
    margin-right: 15px;
  }
  ul.teachers li img {
    width: 90px;
    flex-shrink: 0;
  }
  ul.teachers li h2 {
    font-size: 13px;
    -webkit-line-clamp: 2;
  }
  ul.teachers li h3 {
    font-size: 10px;
  }

  ul.students {
    border-top: none;
    padding-top: 0;
    flex-wrap: wrap;
    gap: 35px;
  }
  ul.students li {
    width: auto;
    flex-shrink: 0;
  }
  ul.students li img {
    width: 90px;
    flex-shrink: 0;
  }
  ul.students li h2 {
    font-size: 12px;
  }
}
</style>
