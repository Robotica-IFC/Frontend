<script setup>
const devs = [
  {
    nome: 'Laura Eloysa da Silva',
    links: {
      github: 'https://github.com/LauraEloysa',
      linkedin: 'https://www.linkedin.com/in/laura-eloysa-87996a2b8/',
      mailto: 'https://mail.google.com/mail/?view=cm&fs=1&to=lauraeloysad@gmail.com',
    },
    image: '/img/about-us/lauradev.jpeg',
    id: 1
  },
  //------------------------------------------------------------------------------------
  {
    nome: 'Lucas Fontini da Luz',
    links: {
      github: 'https://github.com/LucasFontini1',
      linkedin: 'https://www.linkedin.com/in/lucas-fontini-da-luz-133a3b2b8/',
      mailto: 'https://mail.google.com/mail/?view=cm&fs=1&to=lucasfontinidaluz@gmail.com',
    },
    image: '/img/about-us/lcsdev.jpeg',
    id: 2
  },
  //------------------------------------------------------------------------------------
  {
    nome: 'Maria Aparecida dos Santos Costa',
    links: {
      github: 'https://github.com/mariisbx',
      linkedin: 'linkedinMari',
      mailto: 'https://mail.google.com/mail/?view=cm&fs=1&to=mariaaparecida.ifc.araquari@gmail.com',
    },
    image: '/img/about-us/marimaridev.png',
    id: 3
  },
]
</script>

<template>
  <main>
    <div class="top">
      <div class="left">
        <h2>Sobre nós</h2>
        <p>Tecnologia, educação e propósito que <span class="blue">transforma.</span></p>
      </div>
      <div class="right">
        <img src="/img/about-us/robo-obr.png" alt="" class="left-img" />
        <img src="/img/about-us/laura-chateada.png" alt="" class="mid-img" />
        <img src="/img/about-us/imagem-cinza.png" alt="" class="right-img" />
      </div>
    </div>
    <p class="us">
      <span class="blue">Robótica IFC</span> é um projeto institucional do IFC Campus Araquari que
      reúne projetos, conteúdos e atividades em um só lugar. Nosso objetivo é facilitar o
      aprendizado, incentivar a colaboração entre os alunos e transformar ideias em inovação por
      meio da robótica.
    </p>

    <div class="dev">
      <h2>Desenvolvedores:</h2>
      <ul>
        <li v-for="d in devs" :key="d.id" class="devv">
          <img :src="d.image" :alt="d.nome">
          <div class="right-dev">
            <h2>
              {{ d.nome }}
            </h2>
            <ul class="links">
              <li>
                <a :href="d.links.github" target="_blank">
                  <span class="mdi mdi-github"></span><span class="name-link">GitHub</span>
                </a>
              </li>

              <li>
                <a :href="d.links.linkedin" target="_blank">
                  <span class="mdi mdi-linkedin"></span><span class="name-link">LinkedIn</span>
                </a>
              </li>

              <li>
                <a :href="d.links.mailto" target="_blank">
                  <span class="mdi mdi-gmail"></span><span class="name-link">E-Mail</span>
                </a>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </main>
</template>

<style scoped src="./aboutUsComponent.css"></style>
