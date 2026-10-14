<script setup>
const props = defineProps({
  step: Number,
  first: {
    type: String,
    default: 'Inserir e-mail'
  },
  second: {
    type: String,
    default: 'Verificar código'
  },
  
  third: {
    type: String,
    default: 'Redefinir senha'
  }
})
</script>

<template>
  <div class="wrapper">

    <div class="line"></div>

    <div class="steps">

      <div class="step">
        <div :class="['circle', step >= 1 ? 'active' : '']">
          <span v-if="props.step > 1">✓</span>
        </div>
        <p>{{ props.first }}</p>
      </div>

      <div class="step">
        <div :class="['circle', step >= 2 ? 'active' : '']">
          <span v-if="props.step > 2">✓</span>
        </div>
        <p>{{ props.second }}</p>
      </div>

      <div class="step">
        <div :class="['circle', props.step === 3 ? 'active' : '']"></div>
        <p>{{ props.third }}</p>
      </div>

    </div>

  </div>
</template>

<style scoped src="./stepComponent.css"></style>