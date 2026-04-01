import { defineStore } from "pinia";
import { ref } from "vue";

export const useTemplateStore = defineStore('template', () => {
    const sign = ref(4);
    const changePassword = ref(0);
    const teacherOrStudent = ref(true)

    return {
        sign,
        changePassword,
        teacherOrStudent,
    }
})