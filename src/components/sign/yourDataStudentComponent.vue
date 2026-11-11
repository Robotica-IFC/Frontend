<script setup>
import { ref } from 'vue'
import { useTemplateStore } from '@/store/template'
import { useStudentStore } from '@/store/studentStore'
import appArrow from '../appArrow.vue'
import appInput from '../form/appInput.vue'
import appButton from '../form/appButton.vue'
import stepComponent from '../stepComponent.vue'

const templateStore = useTemplateStore()
const studentStore = useStudentStore()

const password = ref(false)
const password2 = ref(false)
const passwordValue2 = ref('')

function validacao() {
  if (studentStore.state.student.password === passwordValue2.value) {
    templateStore.teacherOrStudent = true
    templateStore.sign = 4
  } else {
    alert('As senhas não coincidem')
  }
}
</script>

<template>
  <div class="page">
    <div class="top">
      <div class="arrow">
        <app-arrow @back="templateStore.sign = 0" />
      </div>
      <img src="/src/assets/gif/digitando.gif" alt="Robo-acenando" />
      <h2>Informe seus dados:</h2>
    </div>

    <form @submit.prevent="validacao()" class="mid">
      <div class="inputs">
        <appInput
          placeholder="Nome completo"
          icon="mdi mdi-account"
          required
          v-model="studentStore.state.student.name"
        />

        <appInput
          placeholder="Data de nascimento"
          icon="mdi mdi-calendar-multiselect"
          type="date"
          required
          v-model="studentStore.state.student.data_nascimento"
        />

        <appInput
          placeholder="E-Mail"
          icon="mdi mdi-email-outline"
          type="email"
          required
          v-model="studentStore.state.student.email"
        />

        <appInput
          placeholder="Senha"
          icon="mdi mdi-lock-open"
          :type="password ? 'text' : 'password'"
          required
          v-model="studentStore.state.student.password"
        >
          <span
            @click="password = !password"
            :class="password ? 'mdi mdi-eye-off-outline' : 'mdi mdi-eye-outline'"
          ></span>
        </appInput>

        <appInput
          placeholder="Confirme a senha"
          icon="mdi mdi-lock-open"
          v-model="passwordValue2"
          :type="password2 ? 'text' : 'password'"
          required
        >
          <span
            @click="password2 = !password2"
            :class="password2 ? 'mdi mdi-eye-off-outline' : 'mdi mdi-eye-outline'"
          ></span>
        </appInput>
      </div>

      <appButton type="submit">Continuar</appButton>
    </form>

    <div class="bottom">
      <stepComponent
        step="1"
        first="Informações"
        second="Dados finais"
        third="Confirme seu e-mail"
      />
    </div>
  </div>
</template>

<style scoped src="./yourDataStudentComponent.css"></style>
