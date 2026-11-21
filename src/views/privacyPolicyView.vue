<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <main class="legal-page">
    <div class="legal-content">
      <button type="button" class="legal-back" @click="router.back()">← Voltar</button>
      <p class="legal-kicker">Robótica IFC · Documentos legais</p>
      <h1>Política de Privacidade</h1>
      <p class="legal-updated">Última atualização: 21 de novembro de 2026</p>

      <p>A Robótica IFC valoriza a privacidade dos usuários. Esta política descreve, em linguagem acessível, como os dados pessoais podem ser utilizados nas funcionalidades da plataforma, em conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD — Lei nº 13.709/2018).</p>

      <section>
        <h2>1. Dados tratados</h2>
        <p>Conforme os campos fornecidos e a utilização da plataforma, poderão ser tratados: nome, nome de usuário, endereço de e-mail, senha protegida por mecanismos de autenticação, data de nascimento, telefone, CPF quando solicitado, instituição de ensino, foto de perfil opcional e informações do perfil.</p>
        <p>Também poderão ser tratados dados relacionados às equipes e aos projetos, solicitações de participação, convites, publicações, comentários, curtidas, imagens enviadas, registros de acesso e informações técnicas necessárias ao funcionamento e à segurança.</p>
      </section>

      <section>
        <h2>2. Por que utilizamos os dados</h2>
        <ul>
          <li>Criar, verificar e proteger contas de alunos e professores.</li>
          <li>Identificar participantes e permitir a gestão de equipes e projetos.</li>
          <li>Exibir conteúdos e interações publicados de acordo com as funcionalidades e permissões do sistema.</li>
          <li>Entregar notificações, convites e mensagens relacionadas às atividades da plataforma.</li>
          <li>Prevenir abusos, investigar falhas técnicas e manter o serviço seguro.</li>
          <li>Cumprir obrigações legais aplicáveis, quando necessário.</li>
        </ul>
        <p>O tratamento poderá se basear, conforme cada atividade, na execução dos serviços solicitados, no cumprimento de obrigações legais, em interesses legítimos compatíveis com a LGPD ou em consentimento quando exigido. A confirmação desta política no cadastro representa ciência sobre as práticas descritas; não substitui eventual consentimento específico necessário para outras finalidades.</p>
      </section>

      <section>
        <h2>3. Visibilidade e compartilhamento</h2>
        <p>Nome, usuário, imagem de perfil, participação em equipes e conteúdos publicados podem ficar visíveis a outros usuários, conforme as configurações e permissões da plataforma. Evite compartilhar informações privadas em publicações ou comentários.</p>
        <p>Dados podem ser processados por fornecedores de hospedagem, banco de dados, armazenamento de imagens e serviços de e-mail estritamente necessários à operação. A equipe responsável deverá manter identificados os fornecedores efetivamente utilizados, as condições contratuais e eventuais transferências internacionais.</p>
      </section>

      <section>
        <h2>4. Armazenamento e segurança</h2>
        <p>São utilizados mecanismos de autenticação e controles de acesso para reduzir riscos de acesso indevido. Nenhuma medida técnica elimina completamente o risco de incidentes.</p>
        <p>Os dados devem ser mantidos pelo período necessário para as finalidades informadas, para cumprir obrigações legais ou preservar direitos, com eliminação ou anonimização quando aplicável. Prazos específicos de retenção dependem das configurações e das obrigações efetivas da operação.</p>
      </section>

      <section>
        <h2>5. Cookies e dados locais</h2>
        <p>A plataforma pode utilizar armazenamento local do navegador e tecnologias necessárias para manter a sessão, as preferências de interface e o funcionamento do aplicativo instalável (PWA). Eventuais ferramentas de análise de navegação devem ser identificadas e avaliadas antes de serem ativadas; o arquivo de verificação de propriedade do Google não instala, por si só, uma ferramenta de análise.</p>
      </section>

      <section>
        <h2>6. Seus direitos</h2>
        <p>Nos termos da LGPD, você pode solicitar, quando aplicável, confirmação de tratamento, acesso, correção, anonimização, bloqueio, eliminação, portabilidade, informações sobre compartilhamento e revisão das hipóteses legais pertinentes. É possível também solicitar informações sobre consentimento e sua revogação quando essa for a base legal do tratamento.</p>
        <p>A exclusão da conta poderá ser solicitada pelos recursos disponíveis no perfil; para outras solicitações, utilize os canais oficiais divulgados pela equipe responsável pelo projeto.</p>
      </section>

      <section>
        <h2>7. Crianças e adolescentes</h2>
        <p>Quando houver participação de menores de idade, o tratamento de dados deverá observar seu melhor interesse e as regras legais específicas, inclusive quanto à participação de responsáveis nas situações exigidas por lei.</p>
      </section>

      <section>
        <h2>8. Responsável, solicitações e atualizações</h2>
        <p>A identificação formal do controlador e o canal de contato sobre proteção de dados devem ser confirmados e divulgados pela instituição ou equipe responsável pela operação da Robótica IFC. Não fornecemos neste documento um e-mail ou endereço que ainda não tenha sido validado.</p>
        <p>Esta política pode ser atualizada para refletir mudanças técnicas, operacionais ou legais, com comunicação adequada quando necessária.</p>
      </section>

      <p class="legal-note">Antes da publicação definitiva, a equipe responsável deve validar o controlador, o canal de contato, fornecedores e prazos de retenção descritos nesta política.</p>
    </div>
  </main>
</template>

<style scoped src="./legalPages.css"></style>
