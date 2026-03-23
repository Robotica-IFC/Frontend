<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['updateModel'])

    const props = defineProps({
        modelValue: String,
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

        <label 
        v-if="props.label != '' || props.icon != ''" 
        :for="props.label">

        <span v-if="props.icon != ''" :class="props.icon"></span>
        {{ props.label }}

        </label>

        <input :type="props.type" :placeholder="props.placeholder" :value="props.modelValue" @input="emit('updateModel'), $event.target.value">
        <slot />

    </div>
</template>
<style scoped>
input{
    border: none;
}
div.input{
    border-bottom: 1px var(--principal-claro) solid;
    display: flex;
    justify-content: left;
    gap: 10px;
    text-align: left;
    margin: 0 auto;
    width: 280px;
    font-size: 22px;
    margin-top: 12px;
    
    
}
input{
    border: none;
    outline: none;
}

div.input ::placeholder{
    color: #9A9A9A;
}

.mdi{
    color: var(--principal-claro);
}
</style>