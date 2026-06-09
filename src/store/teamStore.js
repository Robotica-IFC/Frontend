import { defineStore } from "pinia";
import teamApi from "@/api/teamApi";
import { ref } from "vue";

export const useTeamStore = defineStore("team", () => {
  const teams = ref([]);
  const loading = ref(false);
  const totalTeams = ref(0)

  const currentPage = ref(1);
  const totalPages = ref(1);
  const total = ref(0);

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

  return {
    teams,
    loading,
    currentPage,
    totalPages,
    totalTeams,
    total,
    getTeams,
  };
});
