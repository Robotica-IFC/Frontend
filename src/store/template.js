import { defineStore } from "pinia";
import { ref } from "vue";

export const useTemplateStore = defineStore('template', () => {
    const sign = ref(0);
    const changePassword = ref(0);
    const teacherOrStudent = ref(true)
    const successful = ref(false)

    return {
        sign,
        changePassword,
        teacherOrStudent,
        successful
    }
})