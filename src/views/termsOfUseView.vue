<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <main class="legal-page">
    <div class="legal-content">
      <button type="button" class="legal-back" @click="router.back()">← Voltar</button>
      <p class="legal-kicker">Robótica IFC · Documentos legais</p>
      <h1>Termos de Uso</h1>
      <p class="legal-updated">Última atualização: 21 de novembro de 2026</p>

      <p>Estes termos explicam as regras para utilizar a plataforma Robótica IFC, dedicada à divulgação de equipes e projetos de robótica e à interação entre estudantes e professores.</p>

      <section>
        <h2>1. Aceitação e cadastro</h2>
        <p>Para criar uma conta, você deve ler e aceitar estes Termos de Uso e declarar ciência da <RouterLink to="/privacidade">Política de Privacidade</RouterLink>. O cadastro é pessoal, e as informações fornecidas devem ser verdadeiras e atualizadas. A criação da conta depende da verificação do endereço de e-mail.</p>
        <p>Se você for menor de idade, procure a orientação de seu responsável legal. As regras de proteção de crianças e adolescentes e as autorizações eventualmente necessárias continuam aplicáveis.</p>
      </section>

      <section>
        <h2>2. Recursos disponíveis</h2>
        <p>A plataforma permite consultar equipes, projetos, publicações, participantes e notificações, além de, conforme as permissões do perfil, solicitar ingresso em equipes, enviar convites, comentar, curtir e gerenciar conteúdos.</p>
        <p>A disponibilidade de funcionalidades pode variar de acordo com a função de aluno, professor ou outra permissão atribuída ao usuário.</p>
      </section>

      <section>
        <h2>3. Responsabilidades do usuário</h2>
        <ul>
          <li>Proteger sua senha e não compartilhar o acesso com terceiros.</li>
          <li>Respeitar outros participantes; não publicar ameaças, assédio, discriminação ou conteúdos ilícitos.</li>
          <li>Publicar apenas materiais que você tenha direito de usar, inclusive imagens e dados de outras pessoas.</li>
          <li>Não tentar acessar contas, dados ou recursos sem autorização, nem comprometer a segurança da plataforma.</li>
          <li>Não divulgar dados pessoais sensíveis ou informações privadas de terceiros sem fundamento e autorização apropriados.</li>
        </ul>
      </section>

      <section>
        <h2>4. Conteúdos enviados</h2>
        <p>Você continua responsável pelo que publica. Ao enviar textos ou imagens, autoriza a plataforma a armazená-los, processá-los e exibi-los na medida necessária para oferecer os recursos solicitados. Essa autorização não transfere a titularidade de suas criações.</p>
        <p>Conteúdos que violem estes termos ou direitos de terceiros poderão ser moderados ou removidos, observadas as regras aplicáveis.</p>
      </section>

      <section>
        <h2>5. Segurança e disponibilidade</h2>
        <p>A equipe do projeto busca manter a plataforma funcional e segura, mas pode realizar manutenções, corrigir falhas e modificar funcionalidades. A continuidade ininterrupta do serviço não é garantida.</p>
      </section>

      <section>
        <h2>6. Encerramento da conta</h2>
        <p>O usuário pode utilizar as opções de gerenciamento e exclusão de conta disponíveis no perfil, observadas restrições técnicas ou legais justificadas. A exclusão pode afetar a participação em equipes e a disponibilidade de publicações e interações.</p>
      </section>

      <section>
        <h2>7. Privacidade</h2>
        <p>O tratamento de dados pessoais é explicado na <RouterLink to="/privacidade">Política de Privacidade</RouterLink>, que descreve as categorias de dados, finalidades, possíveis compartilhamentos e direitos dos titulares.</p>
      </section>

      <section>
        <h2>8. Atualizações e contato</h2>
        <p>Estes termos podem ser atualizados. Mudanças relevantes serão comunicadas pelos meios disponíveis na plataforma. Para dúvidas ou solicitações, procure os canais oficiais divulgados pela equipe responsável pelo projeto Robótica IFC.</p>
      </section>

      <p class="legal-note">Este documento deve ser validado pela equipe responsável antes de ser adotado como versão jurídica definitiva.</p>
    </div>
  </main>
</template>

<style scoped src="./legalPages.css"></style>
