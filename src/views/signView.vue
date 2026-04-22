<script setup>
    import selectComponent from '@/components/sign/selectComponent.vue';
    import yourDataStudentComponent from '@/components/sign/yourDataStudentComponent.vue';
    import yourDataTeacherComponent from '@/components/sign/yourDataTeacherComponent.vue';
    import verifyYourEmailStudentComponent from '@/components/sign/verifyYourEmailStudentComponent.vue';
    import finalDataStudentComponent from '@/components/sign/finalDataStudentComponent.vue';
    import verifyYourEmailTeacherComponent from '@/components/sign/verifyYourEmailTeacherComponent.vue';
    import finalDataTeacherComponent from '@/components/sign/finalDataTeacherComponent.vue';
    import { useTemplateStore } from '@/store/template';

    const templateStore = useTemplateStore()
</script>
<template>
        <selectComponent v-if="templateStore.sign == 0"></selectComponent>
        <yourDataStudentComponent v-if="templateStore.sign == 1"></yourDataStudentComponent>
        <yourDataTeacherComponent v-if="templateStore.sign == 2"></yourDataTeacherComponent>
        <verifyYourEmailStudentComponent v-if="templateStore.sign == 3"></verifyYourEmailStudentComponent>
        <finalDataStudentComponent v-if="templateStore.sign == 4"></finalDataStudentComponent>
        <verifyYourEmailTeacherComponent v-if="templateStore.sign == 5"></verifyYourEmailTeacherComponent>
        <finalDataTeacherComponent v-if="templateStore.sign == 6"></finalDataTeacherComponent>
</template>