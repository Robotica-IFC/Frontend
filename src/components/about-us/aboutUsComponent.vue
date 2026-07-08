<template>
  <main>
    <div class="top">
      <div class="left">
        <h2>Sobre nós</h2>
        <p>Tecnologia, educação e propósito que <span class="blue">transforma.</span></p>
      </div>
      <div class="right">
        <img src="/img/about-us/robo-obr.png" alt="" class="left-img">
        <img src="/img/about-us/laura-chateada.png" alt="" class="mid-img"></img>
        <img src="/img/about-us/imagem-cinza.png" alt="" class="right-img">
      </div>
    </div>
    <p class="us">
      A <span class="blue">xRobótica IFC</span> é um projeto institucional do IFC Campus Araquari que reúne projetos, conteúdos e atividades em um só lugar. Nosso objetivo é facilitar o aprendizado, incentivar a colaboração entre os alunos e transformar ideias em inovação por meio da robótica.
    </p>

  </main>
</template>
<style scoped>
main {
  margin-top: 45px;
  width: 100%;
}
.top {
  display: flex;
  align-items: center;

  & .left{
    width: 60%;
  }
  & h2 {
    color: var(--principal-claro);
  }
  & p {
    margin-top: 10px;
  }

  .right{
    position: relative;
    width: 40%;
    height: auto;
    padding: 10px;

    & img{
      position: absolute;
    }

    & .left-img{
      width: 50%;
      object-fit: cover;
      z-index: 10;
      bottom: -15px;
      left: -10px;
    }
    & .right-img{
      width: 30%;
      z-index: 10;
      top: -15px;
      right: -0px;
    }

     .mid-img {
      position: relative;
      display: block;
      margin: 0 auto;
      z-index: 9;
    }

  }
}

.blue{
  color: var(--principal-claro);
}
</style>
