<script setup>
const devs = [
  {
    nome: 'Laura Eloysa da Silva',
    username: 'lauraeloysad',
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
    username: 'lucas.fontini',
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
    username: 'mariisbx',
    links: {
      github: 'https://github.com/mariisbx',
      linkedin: null,
      mailto: 'https://mail.google.com/mail/?view=cm&fs=1&to=mariaaparecida.ifc.araquari@gmail.com',
    },
    image: '/img/about-us/marimaridev.png',
    id: 3
  },
]
</script>

<template>
  <section class="about-us" aria-labelledby="about-title">
    <div class="top">
      <div class="left">
        <h1 id="about-title">Sobre nós</h1>
        <p>Tecnologia, educação e propósito que <span class="blue">transforma.</span></p>
      </div>
      <div class="right">
        <img src="/img/about-us/robo-obr.png" alt="Protótipo de robô do projeto" class="left-img" width="70" height="67" />
        <img src="/img/about-us/laura-chateada.png" alt="Alunos apresentando o projeto de robótica do IFC" class="mid-img" width="97" height="138" />
        <img src="/img/about-us/prototipo-robotica.webp" alt="Componentes eletrônicos de um protótipo de robótica" class="right-img" width="53" height="125" />
      </div>
    </div>
    <p class="us">
      A <span class="blue">Robótica IFC</span> é um projeto institucional do IFC Campus Araquari que
      reúne projetos, conteúdos e atividades em um só lugar. Nosso objetivo é facilitar o
      aprendizado, incentivar a colaboração entre os alunos e transformar ideias em inovação por
      meio da robótica.
    </p>

    <section class="dev" aria-labelledby="dev-title">
      <h2 id="dev-title">Desenvolvedores</h2>
      <ul class="dev-list">
        <li v-for="d in devs" :key="d.id" class="devv">
          <img :src="d.image" :alt="d.nome" width="100" height="100" loading="lazy">
          <div class="right-dev">
            <div>
              <h3>{{ d.nome }}</h3>
              <p class="username">{{ d.username }}</p>
            </div>
            <ul class="links">
              <li>
                <a :href="d.links.github" target="_blank" rel="noopener noreferrer" :aria-label="`GitHub de ${d.nome}`">
                  <span class="mdi mdi-github" aria-hidden="true"></span><span class="name-link">GitHub</span>
                </a>
              </li>

              <li>
                <a v-if="d.links.linkedin" :href="d.links.linkedin" target="_blank" rel="noopener noreferrer" :aria-label="`LinkedIn de ${d.nome}`">
                  <span class="mdi mdi-linkedin" aria-hidden="true"></span><span class="name-link">LinkedIn</span>
                </a>
                <span v-else class="unavailable-link">
                  <span class="mdi mdi-linkedin" aria-hidden="true"></span><span class="name-link">LinkedIn</span>
                </span>
              </li>

              <li>
                <a :href="d.links.mailto" target="_blank" rel="noopener noreferrer" :aria-label="`Enviar e-mail para ${d.nome}`">
                  <span class="mdi mdi-gmail" aria-hidden="true"></span><span class="name-link">E-mail</span>
                </a>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </section>

    <section class="location" aria-labelledby="location-title">
      <h2 id="location-title"><span class="mdi mdi-earth" aria-hidden="true"></span>Localização</h2>
      <div class="location-content">
        <div class="location-info">
          <ul class="contact">
            <li>
              <span class="mdi mdi-map-marker-radius" aria-hidden="true"></span>
              <a href="https://www.google.com/maps/search/?api=1&query=IFC+Campus+Araquari" target="_blank" rel="noopener noreferrer">IFC Campus Araquari</a>
            </li>
            <li>
              <span class="mdi mdi-phone" aria-hidden="true"></span>
              <a href="tel:+554738037200">(47) 3803-7200</a>
            </li>
            <li>
              <span class="mdi mdi-clock-outline" aria-hidden="true"></span>
              <span>7:00 às 22:30</span>
            </li>
          </ul>
          <address>BR-280 - Colégio Agrícola,<br>Araquari - SC, 89245-000</address>
        </div>
        <iframe class="location-map" title="Mapa do IFC Campus Araquari" src="https://www.google.com/maps?q=IFC+Campus+Araquari&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
      </div>
    </section>
  </section>
</template>

<style scoped src="./aboutUsComponent.css"></style>
