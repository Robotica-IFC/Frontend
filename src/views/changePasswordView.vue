<script setup>
    import putEmailComponent from '@/components/change-passowrd/putEmailComponent.vue';
    import checkCodeComponent from '@/components/change-passowrd/checkCodeComponent.vue';
    import resetPasswordComponent from '@/components/change-passowrd/resetPasswordComponent.vue';
    import { useTemplateStore } from '@/store/template';

    const store = useTemplateStore();
</script>

<template>
    <putEmailComponent v-if="store.changePassword === 0"></putEmailComponent>
    <checkCodeComponent v-if="store.changePassword === 1"></checkCodeComponent>
    <resetPasswordComponent v-if="store.changePassword === 2"></resetPasswordComponent>
</template>  