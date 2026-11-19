<script setup>
import { useRouter } from 'vue-router'
import { useNotificationsStore } from '@/store/notificationsStore'

const store = useNotificationsStore()
const router = useRouter()
const dateFormat = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

async function open(notification) {
  try {
    if (!(await store.markRead(notification))) return
    await router.push(
      notification.tipo === 'CONVITE'
        ? { name: 'teamDetails', params: { id: notification.equipe } }
        : { name: 'projectDetails', params: { id: notification.projeto } },
    )
  } catch {
    // A store mantém o aviso não lido e apresenta o erro para permitir uma nova tentativa.
  }
}

async function respond(notification, accept) {
  try {
    await store.respondToInvite(notification, accept)
  } catch {
    // O convite permanece disponível, com o erro da store, para uma nova tentativa.
  }
}
</script>

<template>
  <section class="activity" aria-labelledby="activity-title">
    <div class="activity-heading">
      <div>
        <h2 id="activity-title">
          Atividades e convites <span class="count">{{ store.unread }} não lidas</span>
        </h2>
        <p>Convites para participar de equipes, novos projetos e publicações.</p>
      </div>
    </div>
    <p v-if="store.error" role="alert" class="error">{{ store.error }}</p>
    <p v-if="store.loading && !store.notifications.length" role="status">
      Carregando notificações...
    </p>
    <ul
      v-if="store.notifications.length"
      class="activity-list"
      aria-label="Notificações de convites, projetos e posts"
    >
      <li v-for="notification in store.notifications" :key="notification.id">
        <article
          v-if="notification.tipo === 'CONVITE'"
          class="activity-card"
          :class="{ read: notification.lida_em }"
        >
          <span class="activity-icon mdi mdi-account-plus-outline" aria-hidden="true"></span>
          <div class="activity-content">
            <div class="activity-topline">
              <strong>{{ notification.titulo }}</strong>
              <span class="read-state" :class="{ unread: !notification.lida_em }">{{
                notification.lida_em ? 'Lida' : 'Não lida'
              }}</span>
            </div>
            <p class="message">{{ notification.mensagem }}</p>
            <div class="activity-meta">
              <span>{{ notification.equipe_nome }}</span>
              <time :datetime="notification.criada_em">{{
                dateFormat.format(new Date(notification.criada_em))
              }}</time>
            </div>
            <div
              v-if="notification.convite_status === 'P'"
              class="invite-actions"
              :aria-busy="store.responding.includes(notification.id)"
            >
              <button
                type="button"
                class="accept-invite"
                :disabled="store.responding.includes(notification.id)"
                @click="respond(notification, true)"
              >
                Aceitar convite
              </button>
              <button
                type="button"
                class="decline-invite"
                :disabled="store.responding.includes(notification.id)"
                @click="respond(notification, false)"
              >
                Recusar
              </button>
              <span v-if="store.responding.includes(notification.id)" role="status"
                >Respondendo...</span
              >
            </div>
            <p v-else class="invite-status" role="status">
              {{
                notification.convite_status === 'A'
                  ? 'Convite aceito. Você agora participa desta equipe.'
                  : 'Convite recusado.'
              }}
            </p>
            <button
              type="button"
              class="team-link"
              :disabled="
                store.reading.includes(notification.id) ||
                store.responding.includes(notification.id)
              "
              @click="open(notification)"
            >
              {{ store.reading.includes(notification.id) ? 'Abrindo...' : 'Ver equipe' }}
              <i class="mdi mdi-arrow-right" aria-hidden="true"></i>
            </button>
          </div>
        </article>
        <button
          v-else
          type="button"
          class="activity-card"
          :class="{ read: notification.lida_em }"
          :disabled="store.reading.includes(notification.id)"
          @click="open(notification)"
        >
          <span
            class="activity-icon mdi"
            :class="
              notification.tipo === 'PROJETO' ? 'mdi-folder-plus-outline' : 'mdi-post-outline'
            "
            aria-hidden="true"
          ></span>
          <span class="activity-content">
            <span class="activity-topline">
              <strong>{{ notification.titulo }}</strong>
              <span class="read-state" :class="{ unread: !notification.lida_em }">{{
                notification.lida_em ? 'Lida' : 'Não lida'
              }}</span>
            </span>
            <span class="message">{{ notification.mensagem }}</span>
            <span class="activity-meta">
              <span>{{ notification.equipe_nome }}</span>
              <time :datetime="notification.criada_em">{{
                dateFormat.format(new Date(notification.criada_em))
              }}</time>
            </span>
            <span class="project-link"
              >{{ store.reading.includes(notification.id) ? 'Abrindo...' : 'Ver projeto' }}
              <i class="mdi mdi-arrow-right" aria-hidden="true"></i
            ></span>
          </span>
        </button>
      </li>
    </ul>
    <div v-else-if="!store.loading && !store.error" class="empty">
      <i class="mdi mdi-bell-check-outline" aria-hidden="true"></i>
      <h3>Tudo em dia!</h3>
      <p>Os convites para equipes e os avisos de novos projetos e publicações aparecerão aqui.</p>
    </div>
    <button
      v-if="store.hasMore"
      type="button"
      class="load-more"
      :disabled="store.loading"
      @click="store.loadMore().catch(() => {})"
    >
      {{ store.loading ? 'Carregando...' : 'Carregar mais notificações' }}
    </button>
  </section>
</template>

<style scoped>
.activity {
  margin-bottom: 36px;
}
.activity-heading {
  margin-bottom: 16px;
}
h2 {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 18px;
  margin: 0;
}
.activity-heading p {
  color: #627e90;
  font-size: 13px;
  line-height: 1.6;
  margin: 8px 0;
}
.count {
  border-radius: 16px;
  background: #e8f3f9;
  padding: 4px 9px;
  font-size: 12px;
  font-weight: 500;
}
.activity-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 12px;
}
.activity-card {
  display: flex;
  gap: 14px;
  text-align: left;
  width: 100%;
  border: 1px solid #9fc5df;
  border-left: 4px solid #176c9e;
  border-radius: 14px;
  background: #f0f8ff;
  padding: 18px;
  font: inherit;
  color: #003f63;
  cursor: pointer;
  box-shadow: 0 3px 10px #0043690a;
}
.activity-card:hover {
  border-color: #4485af;
}
.activity-card.read {
  background: #f7f8fa;
  border-color: #dde3e8;
  border-left-color: #c5d0d8;
  color: #697b87;
  box-shadow: none;
}
.activity-card:focus-visible,
.load-more:focus-visible {
  outline: 3px solid #3184b4;
  outline-offset: 3px;
}
.activity-card:disabled,
.load-more:disabled {
  cursor: wait;
  opacity: 0.7;
}
.activity-icon {
  display: grid;
  place-items: center;
  flex: 0 0 42px;
  height: 42px;
  font-size: 23px;
  border-radius: 12px;
  background: #dceefc;
}
.read .activity-icon {
  background: #e9edf0;
}
.activity-content {
  display: grid;
  gap: 9px;
  min-width: 0;
  flex: 1;
  overflow-wrap: anywhere;
}
.activity-topline {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px;
}
.activity-topline strong {
  font-size: 15px;
}
.read .activity-topline strong {
  font-weight: 500;
}
.read-state {
  font-size: 11px;
  white-space: nowrap;
}
.read-state.unread {
  color: #005c96;
  font-weight: 700;
}
.read-state.unread::before {
  content: '';
  display: inline-block;
  width: 7px;
  height: 7px;
  background: #187ab7;
  border-radius: 50%;
  margin-right: 5px;
}
.message {
  font-size: 14px;
  line-height: 1.6;
}
.activity-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 16px;
  font-size: 12px;
  color: #627e90;
}
.project-link {
  font-size: 12px;
  font-weight: 600;
}
.invite-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}
.invite-actions button {
  min-height: 40px;
  border: 1px solid #176c9e;
  border-radius: 8px;
  padding: 8px 14px;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
}
.accept-invite {
  background: #003d66;
  color: white;
}
.decline-invite {
  background: white;
  color: #003d66;
}
.invite-actions > span,
.invite-status {
  font-size: 13px;
  line-height: 1.5;
}
.team-link {
  justify-self: start;
  border: 0;
  padding: 8px 0;
  background: transparent;
  color: #003d66;
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}
.invite-actions button:disabled,
.team-link:disabled {
  cursor: wait;
  opacity: 0.7;
}
.invite-actions button:focus-visible,
.team-link:focus-visible {
  outline: 3px solid #3184b4;
  outline-offset: 3px;
}
.load-more {
  display: block;
  margin: 18px auto 0;
  border: 1px solid #cfdee8;
  border-radius: 9px;
  background: white;
  color: #004369;
  padding: 12px 16px;
  min-height: 44px;
  cursor: pointer;
  font: inherit;
  font-size: 13px;
}
.error {
  color: #ad2434;
}
.empty {
  text-align: center;
  padding: 30px 20px;
  border: 1px dashed #c3d5e1;
  border-radius: 16px;
  background: #f7fafc;
  color: #648091;
}
.empty > .mdi {
  font-size: 40px;
}
.empty h3 {
  font-size: 18px;
  margin: 8px 0;
}
.empty p {
  max-width: 400px;
  margin: 8px auto 0;
  line-height: 1.6;
  font-size: 14px;
}
@media (max-width: 480px) {
  .activity-card {
    padding: 14px 12px;
    gap: 10px;
  }
  .activity-icon {
    flex-basis: 32px;
    height: 32px;
    font-size: 20px;
  }
}
</style>
