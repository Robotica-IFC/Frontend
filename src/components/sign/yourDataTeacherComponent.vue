<script setup>
import appArrow from "../appArrow.vue";
import { useTemplateStore } from "@/store/template";
import { useTeacherStore } from "@/store/teacherStore"; // Import do store de teacher
import appInput from "../form/appInput.vue";
import { ref } from "vue";
import appButton from "../form/appButton.vue";

const templateStore = useTemplateStore();
const teacherStore = useTeacherStore(); // Instância do store

const password = ref(false);
const password2 = ref(false);

// Usamos refs locais para comparar as senhas antes de salvar no store definitivo
const passwordValue = ref("");
const passwordValue2 = ref("");

function validacao(){
  if(passwordValue.value === passwordValue2.value){
    // Salva a senha validada no store
    teacherStore.teacher.senha = passwordValue.value;
    
    templateStore.teacherOrStudent = true; // Define como teacher no template
    templateStore.sign = 5; // Avança para a próxima etapa
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
      <h2>Informe seus dados de Professor:</h2>
    </div>

    <form @submit.prevent="validacao()" class="mid">
      <div class="inputs">
        <appInput 
          placeholder="Nome completo" 
          icon="mdi mdi-account" 
          v-model="teacherStore.teacher.nome"
          required
        ></appInput>

        <appInput
          placeholder="Data de nascimento"
          icon="mdi mdi-calendar-multiselect"
          type="date"
          v-model="teacherStore.teacher.data_nascimento"
          required
        ></appInput>

        <appInput
          placeholder="CPF"
          icon="mdi mdi-card-account-details-outline"
          v-model="teacherStore.teacher.cpf"
          required
        ></appInput>

        <appInput 
          placeholder="Telefone" 
          icon="mdi mdi-phone" 
          v-model="teacherStore.teacher.telefone"
          type="tel"
        ></appInput>

        <appInput
          placeholder="E-Mail"
          icon="mdi mdi-email-outline"
          v-model="teacherStore.teacher.email"
          type="email"
          required
        ></appInput>

        <appInput
          placeholder="Instituto / Escola"
          icon="mdi mdi-town-hall"
          v-model="teacherStore.teacher.instituicao"
          required
        ></appInput>

        <appInput
          placeholder="Senha"
          icon="mdi mdi-lock-open"
          v-model="passwordValue"
          :type="password ? 'text' : 'password'"
          required
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
    <div class="bottom"></div>
  </div>
</template>

<style scoped>
.top {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
.arrow { width: 100%; display: flex; }
img { width: 250px; height: auto; }
h2 { font-size: 23px; margin: 25px 0 35px; text-align: center; }
form span {
  display: flex;
  justify-content: right;
  margin-left: 40px;
  color: var(--principal-claro);
  font-size: 20px;
  cursor: pointer;
}
.inputs {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}
</style>