<script setup>
    import selectComponent from '@/components/sign/selectComponent.vue';
    import yourDataStudentComponent from '@/components/sign/yourDataStudentComponent.vue';
    import { useTemplateStore } from '@/store/template';

    const templateStore = useTemplateStore()
</script>
<template>
        <selectComponent v-if="templateStore.sign == 0"></selectComponent>
        <yourDataStudentComponent v-if="templateStore.sign == 1"></yourDataStudentComponent>
</template>