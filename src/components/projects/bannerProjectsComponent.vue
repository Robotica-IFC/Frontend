<template>
  <section class="tudo">
    <div class="left">
      <h1>Explore os projetos da Robótica IFC</h1>

      <p>
        Descubra ideias, acompanhe o desenvolvimento e participe da construção
        de soluções reais através da robótica.
      </p>
    </div>

    <div class="right">
      <img src="/img/project/autofalante.png" alt="Autofalante" />
    </div>
  </section>
</template>

<style scoped>
.tudo {
  width: min(1200px, 90%);
  margin: 35px auto;
  padding: 25px 10px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 50px;

  border-bottom: 2px solid var(--principal-claro);
}

.left {
  flex: 1;
}

.left h1 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2d4362;
  line-height: 1.15;
  margin-bottom: 18px;
}

.left p {
  font-size: 1rem;
  color: #555;
  line-height: 1.8;
  max-width: 600px;
}

.right {
  flex: 1;
  display: flex;
  justify-content: center;
}

.right img {
  width: 100%;
  max-width: 420px;
  height: auto;
  transition: transform .3s ease;
}

.right img:hover {
  transform: translateY(-6px);
}

@media (max-width: 900px) {
  .tudo {
    flex-direction: column;
    text-align: center;
    gap: 30px;
  }

  .left p {
    margin: auto;
  }

  .left h1 {
    font-size: 1.5rem;
  }

  .right img {
    max-width: 320px;
  }
}
</style>
