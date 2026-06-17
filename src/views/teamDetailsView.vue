<script setup>
    import { defineProps } from 'vue';
    import teamDetailComponent from '@/components/layout/detailsComponents/teamDetailComponent.vue';
    import appHeaderComponent from '@/components/layout/appHeaderComponent.vue';

    const props = defineProps({
        id: {
            type: String,
            required: true,
        }
    })
</script>
<template>
    <appHeaderComponent></appHeaderComponent>
    <teamDetailComponent :id="props.id"></teamDetailComponent>
</template>