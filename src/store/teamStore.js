import { defineStore } from "pinia";
import teamApi from "@/api/teamApi";
import projectsApi from "@/api/projectsApi";
import { ref } from "vue";
// import { useStudentStore } from "./studentStore";

export const useTeamStore = defineStore("team", () => {
  // const studentStore = useStudentStore()

  const teams = ref([]);
  const loading = ref(false);
  const totalTeams = ref(0)

  const currentPage = ref(1);
  const totalPages = ref(1);
  const total = ref(0);

  const actualTeam = ref([])

  async function getTeams(page = 1) {
    try {
      loading.value = true;


      const response = await teamApi.getAll(page);

      totalTeams.value = response.data.total;
      teams.value = response.data.items;
      currentPage.value = response.data.pagina_atual;
      totalPages.value = response.data.paginas;
      total.value = response.data.total;
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  }
  async function getTeamById(id){
    actualTeam.value = []
    const response = await teamApi.getOne(id);

    actualTeam.value = response.data
  }

  async function getTeamByUserId(id) {

      const response = await teamApi.getTeamByUserId(id)

      return response.data
  }

  async function getProjects(page = 1) {
  try {
    loading.value = true

    const response = await teamApi.getAll(page)

    teams.value = response.data.items

    for (const team of teams.value) {
      const projects = await projectsApi.getByTeam(team.id)
      team.totalProjetos = projects.data.results.length
    }

    currentPage.value = response.data.pagina_atual
    totalPages.value = response.data.paginas
    total.value = response.data.total
  } finally {
    loading.value = false
  }
}

  return {
    teams,
    loading,
    currentPage,
    totalPages,
    totalTeams,
    total,
    actualTeam,
    getTeams,
    getTeamById,
    getTeamByUserId,
    getProjects,
  };
});
