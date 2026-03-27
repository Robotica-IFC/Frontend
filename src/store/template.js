import { defineStore } from "pinia";
import { ref } from "vue";

export const useTemplateStore = defineStore('template', () => {
    const sign = ref(0);
    const changePassword = ref(0);

    return {
        sign,
        changePassword,
    }
})