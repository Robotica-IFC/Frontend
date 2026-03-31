import api from "@/plugins/axios";
import { ref, reactive } from "vue";


export function useStudent(){
    const students = ref([])

    async function getStudents() {
        const response = await api.get('alunos')

        students.value = response.data.results
    }

    return{
        students,
        getStudents
    }
}