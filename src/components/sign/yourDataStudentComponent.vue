<script setup>
import { ref } from "vue"
import { useTemplateStore } from "@/store/template"
import { useStudentStore } from "@/store/studentStore"
import appArrow from "../appArrow.vue"
import appInput from "../form/appInput.vue"
import appButton from "../form/appButton.vue"
import stepComponent from "../stepComponent.vue"

const templateStore = useTemplateStore()
const studentStore = useStudentStore()

const password = ref(false)
const password2 = ref(false)
const passwordValue2 = ref("")

function validacao() {
  if (studentStore.state.student.password === passwordValue2.value) {
    templateStore.teacherOrStudent = true
    templateStore.sign = 3
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
        second="Confirme seu E-Mail" 
        third="Dados finais"
      />
    </div>
  </div>
</template>

<style scoped>
.top {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.arrow {
  width: 100%;
  display: flex;
}

img {
  width: 250px;
  height: auto;
}

h2 {
  font-size: 23px;
  margin: 25px 0 35px;
  text-align: center;
}

form span {
  display: flex;
  justify-content: right;
  margin-left: 40px;
  color: var(--principal-claro);
  font-size: 20px;
  cursor: pointer; /* Adicionado para indicar que o ícone do olho é clicável */
}
</style>