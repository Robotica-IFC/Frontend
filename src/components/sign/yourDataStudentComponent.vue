<script setup>
import { ref } from 'vue'
import { useTemplateStore } from '@/store/template'
import { useStudentStore } from '@/store/studentStore'
import AuthLayout from '../layout/AuthLayout.vue'
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
  <AuthLayout
    title="Informe seus dados"
    subtitle="Crie sua conta de aluno para começar."
    icon="mdi-account-school-outline"
    @back="templateStore.sign = 0"
  >
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

    <template #progress>
      <stepComponent
        :step="1"
        first="Inserir dados"
        second="Perfil"
        third="Verificação de e-mail"
      />
    </template>
  </AuthLayout>
</template>

<style scoped src="./registrationDataLayout.css"></style>
