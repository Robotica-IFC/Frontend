<script setup>
    import { defineProps } from 'vue';
    import teamDetailComponent from '@/components/layout/detailsComponents/teamDetailComponent.vue';

    const props = defineProps({
        id: {
            type: String,
            required: true,
        }
    })
</script>
<template>
    <teamDetailComponent :id="props.id"></teamDetailComponent>
</template>