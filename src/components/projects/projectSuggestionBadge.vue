<template>
  <span class="suggestion-badge">
    <span class="mdi mdi-lightbulb-on-outline" aria-hidden="true"></span>
    A partir de uma sugestão
  </span>
</template>

<style scoped>
.suggestion-badge {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  gap: 5px;
  max-width: 100%;
  padding: 4px 8px;
  border: 1px solid #f0dc8b;
  border-radius: 6px;
  background: #fff4c2;
  color: #705500;
  font-size: 11px;
  line-height: 1.4;
}
.mdi {
  flex-shrink: 0;
  font-size: 15px;
}
</style>
