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

<style scoped>
main {
  margin-top: 45px;
  width: 100%;
}
.top {
  display: flex;
  align-items: center;

  & .left {
    width: 60%;
  }
  & h2 {
    color: var(--principal-claro);
  }
  & p {
    margin-top: 10px;
  }

  .right {
    position: relative;
    width: 40%;
    height: auto;
    padding: 10px;

    & img {
      position: absolute;
    }

    & .left-img {
      width: 50%;
      object-fit: cover;
      z-index: 10;
      bottom: -30px;
      left: -20px;
    }
    & .right-img {
      width: 30%;
      z-index: 10;
      top: -25px;
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

.us {
  margin-top: 60px;
  font-size: 18px;
  line-height: 1.3;
}

.dev{
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 35px;

  & h2{
    color: var(--principal-claro);
  }

  & ul{
    list-style-type: none;

    & li.devv{
      padding: 20px 0px;
      display: flex;
      gap: 5px;
      position: relative;

      &::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        border-bottom: 1px var(--principal-claro) solid;
      }

      &:last-child::after {
        display: none;
      }

      & .right-dev{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      & img{
        width: 100px;
        aspect-ratio: 1/1;
        object-fit: cover;
        border-radius: 50%;
      }

      & h2{
        font-size: 15px;
      }
      & ul.links{
        display: flex;
        gap: 10px;

        & li a{
          color: black;
          text-decoration: none;
          display: flex;
          gap: 2px;
          font-size: 10px;
          align-items: center;

          & span.mdi{
            font-size: 20px;
          }
        }
      }
    }
  }
}

.blue {
  color: var(--principal-claro);
}

/* ========== DESKTOP ========== */
@media (min-width: 950px) {
  main {
    width: 100%;
    max-width: 1100px;
    margin: 100px auto 0;
    padding: 0 40px 60px;
  }

  .top {
    gap: 40px;

  }

  .top .left {
    width: 55%;
  }

  .top h2 {
    font-size: 2.2rem;

  }

  .top p {
    font-size: 1.4rem;
    margin-top: 16px;
    line-height: 1.3;
    font-weight: 600;
  }

    .top .right {
    width: 45%;
    max-width: 460px;
    margin-left: auto;
    padding: 10px;
  }

  .top .right .mid-img {
    width: 50%;
    height: auto;
  }

  .top .right .left-img {
    width: 30%;
    bottom: -25px;
    left: 10px;
  }

  .top .right .right-img {
    width: 30%;
    top: -20px;
    right: 0;
  }

  .us {
    margin-top: 40px;
    font-size: 1.3rem;
    line-height: 1.5;
    max-width: 900px;
  }

  .dev {
    margin-top: 60px;
    gap: 30px;
  }

  .dev h2 {
    font-size: 1.8rem;
  }

  /* devs em grade de 3 colunas */
  .dev ul {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  .dev ul li.devv {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 16px;
    padding: 30px 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.18);
  }

  /* some a linha divisória do mobile */
  .dev ul li.devv::after {
    display: none;
  }

  .dev ul li.devv img {
    width: 140px;
  }

  .dev ul li.devv .right-dev {
    align-items: center;
    gap: 14px;
  }

  .dev ul li.devv h2 {
    font-size: 1.1rem;
  }

  .dev ul li.devv ul.links {
    display: flex;
    justify-content: center;
    gap: 14px;
  }

  .dev ul li.devv ul.links li a {
    font-size: 0.85rem;
    gap: 4px;
  }

  .dev ul li.devv ul.links li a span.mdi {
    font-size: 24px;
  }
}
</style>
