<script setup>
import appArrow from "../appArrow.vue";
// import router from '@/router';
import { useTemplateStore } from "@/store/template";
import appInput from "../form/appInput.vue";
import { onMounted, ref } from "vue";
import appButton from "../form/appButton.vue";
import stepComponent from "../stepComponent.vue";
import { useStudentStore } from "@/store/studentStore";

const templateStore = useTemplateStore();
const studentStore = useStudentStore()

const password = ref(false);
const password2 = ref(false);
//const passwordValue = ref("");
const passwordValue2 = ref("");

function validacao(){
  if(studentStore.state.student.senha == passwordValue2.value){
    templateStore.teacherOrStudent = true
    templateStore.sign = 4
  }else{
    alert('As senhas não coincidem')
  }
}

</script>
<template>
  <div class="page">
    <div class="top">
      <!--Div que separa a parte do topo, ASS: Lucas-->
      <div class="arrow">
        <!--Seta que retorna, ASS: Lucas-->
        <app-arrow @back="templateStore.sign = 0" />
      </div>

      <img src="/src/assets/gif/digitando.gif" alt="Robo-acenando" />

      <h2>Informe seus dados:</h2>
    </div>
    <form @submit.prevent="validacao()" class="mid">
      <!--Div que separa a parte do meio, ASS: Lucas-->
      <div class="inputs">
        <appInput placeholder="Nome" icon="mdi mdi-account" required v-model="studentStore.state.student.nome"></appInput>
        <appInput
          placeholder="Data de nascimento"
          icon="mdi mdi-calendar-multiselect"
          type="date"
          required
          v-model="studentStore.state.student.data_nascimento"
        ></appInput>
        <appInput
          placeholder="CPF"
          icon="mdi mdi-card-account-details-outline"
          type="number"
          required
          v-model="studentStore.state.student.cpf"
        ></appInput>
        <appInput placeholder="Telefone" icon="mdi mdi-phone" type="tel" v-model="studentStore.state.student.telefone"></appInput>
        <appInput
          placeholder="E-Mail"
          icon="mdi mdi-email-outline"
          type="email"
          required
          v-model="studentStore.state.student.email"
        ></appInput>

        <appInput
          placeholder="Senha"
          icon="mdi mdi-lock-open"
          :type="password ? 'text' : 'password'"
          required
          v-model="studentStore.state.student.senha"
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
    <div class="bottom"><!--Div que separa a parte de baixo, ASS: Lucas-->
      <stepComponent step=1 first="Informações" second="Confirme seu E-Mail" third="Dados finais"></stepComponent>
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
}
</style>
