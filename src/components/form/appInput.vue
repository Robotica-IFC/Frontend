<script setup>
    const props = defineProps({
        label: {
            type: String,
            required: true
        },
        type: {
            type: String,
            default: 'text'
        },
        placeholder: String,
        icon: String,
        variant: {
            type: String,
            default: 'primary',
        }
    })
</script>
<template>
    <div class="input">
        <label v-if="props.label != '' || props.icon != ''" :for="props.label"><span v-if="props.icon != ''" :class="props.icon"></span>{{ props.label }}</label>
        <input :type="props.type" :placeholder="props.placeholder">
    </div>
</template>
<style scoped>
input{
    border: none;
}
div.input{
    border-bottom: 1px var(--principal-claro) solid;
    display: flex;
    justify-content: center;
    gap: 10px;
    text-align: center;
    margin: 0 auto;
    width: 280px;
}
</style>