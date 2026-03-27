<script setup>
import appArrow from '../appArrow.vue'
import appButton from '../form/appButton.vue'
import { useTemplateStore } from '@/store/template';
import router from '@/router'

const templateStore = useTemplateStore()
</script>

<template>
  <div class="page"><!--Div geral que possui a estilização no CSS, ASS: Lucas-->
    <div class="top"><!--Div que define oq ficara na parte de cima, permitindo usar space-bettwen, ASS: Lucas-->
      
      <div class="arrow"><!--Seta que retorna, ASS: Lucas-->
        <app-arrow @back="router.push('/')" />
      </div>

      <img src="/src/assets/gif/pensando.gif" alt="Robo-pensando" />

      <h2>Você quer se cadastrar como:</h2>

      <div class="btns"> <!--Div que fica os dois btn, ASS: Lucas-->
        <app-button class="btn" @click="templateStore.sign = 1">
          <div class="btn-content"><!--Div para estilização do conteudo do botao, ASS: Lucas-->
            <span class="mdi mdi-account-school"></span>
            Aluno
          </div>
        </app-button>

        <app-button class="btn" @click="templateStore.sign = 2">
          <div class="btn-content">
            <span class="mdi mdi-human-male-board-poll"></span>
            Professor
          </div>
        </app-button>
      </div>

    </div>

    <div class="bottom"><!--Div que fica abaixo do restante, ASS: Lucas-->
      <app-button @click="router.push('/')" variant="secondary"> <!--AppButton com variação secundaria de link, e vai para a tela de welcome, ASS: Lucas-->
        Ja possuo uma conta
      </app-button>
    </div>

  </div>
</template>

<style scoped>

.page {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
}
}

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
  margin-top: -30px;
}

h2 {
  font-size: 23px;
  margin: 40px 0 50px;
  text-align: center;
}

.btns {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 300px;
}
.btn{
  position: relative;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

span.mdi {
  font-size: 20px;
  position: absolute;
  left: 20px;
}

.bottom {
  margin-bottom: 20px;
}

</style>