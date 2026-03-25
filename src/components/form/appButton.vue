<script setup>

const emit = defineEmits(['click'])

const props = defineProps({
    label: String,
     variant: {
        type: String,
        default: 'primary'
  }
})

</script>

<template>
    <div class="btn">

        <button type="button"
        :class="props.variant"
         @click="emit('click', props.variant)">

            {{ props.label }}
            <slot />

        </button>

    </div>
</template>

<style scoped>
.btn{
    text-align: center;
    margin-top: 10px;
}
.btn button{
    text-align: center;
    border: none;
    transition: 0.1s;
    width: 100%;
}

.primary {
    border-radius: 8px;
    font-size: 16px;
    padding: 10px 80px;
    height: auto;
    background-color: var(--principal-claro);
    color: var(--fundo-claro);
}
.secondary {
    color: var(--destaque-claro);
    font-size: 16px;
    background-color: transparent;
    padding: 5px;
}

.btn button.primary:active{
    transform: scale(0.95);
    background-color: var(--principal-claro);
}
</style>