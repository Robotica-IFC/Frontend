<script setup>
const props = defineProps({
  step: Number
})
</script>

<template>
  <div class="wrapper">

    <div class="line"></div>

    <div class="steps">

      <div class="step">
        <div :class="['circle', step >= 1 ? 'active' : '']">
          <span v-if="step > 1">✓</span>
        </div>
        <p>Inserir e-mail</p>
      </div>

      <div class="step">
        <div :class="['circle', step >= 2 ? 'active' : '']">
          <span v-if="step > 2">✓</span>
        </div>
        <p>Verificar código</p>
      </div>

      <div class="step">
        <div :class="['circle', step === 3 ? 'active' : '']"></div>
        <p>Redefinir senha</p>
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
  top: 17px;
  left: 35px;
  width: 85%;
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
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: #ccc; 
  display: flex;
  align-items: center;
  justify-content: center;
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