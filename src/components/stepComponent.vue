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

<style scoped>
.wrapper {
  width: 100%;
  position: relative;
  margin: 30px 0;
}

.line {
  position: absolute;
  top: 12.5px;
  left: 45px;
  width: 72%;
  height: 4px;
  background: #ccc; 
  z-index: 1;
}   

.steps {
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 2;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100px;
  text-align: center;
}

.circle {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: #ccc; 
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  font-size: 10px;
}

.circle.active {
  background: #0d3b66;
  color: white;
  border: #ccc solid 6px;
}

p {
  margin-top: 8px;
  font-size: 14px;
}
</style>