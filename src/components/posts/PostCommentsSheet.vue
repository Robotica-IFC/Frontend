<script setup>
import { computed, ref } from 'vue'
import { usePostStore } from '@/store/postsStore'
import { useAuthStore } from '@/store/authStore'

const props = defineProps({ post: { type: Object, required: true } })
const emit = defineEmits(['close'])
const store = usePostStore()
const auth = useAuthStore()
const texto = ref('')
const error = ref('')
const sending = ref(false)
const comments = computed(() => props.post.comentarios || [])
async function send() {
  if (!texto.value.trim() || sending.value) return
  sending.value = true
  error.value = ''
  try {
    await store.addComment(props.post, texto.value.trim())
    texto.value = ''
  } catch {
    error.value = 'Não foi possível enviar o comentário.'
  } finally { sending.value = false }
}
async function remove(id) {
  try { await store.removeComment(props.post, id) }
  catch { error.value = 'Não foi possível excluir o comentário.' }
}
</script>
<template>
  <div class="comments-overlay" @click.self="emit('close')">
    <section class="comments-panel" role="dialog" aria-modal="true" aria-label="Comentários">
      <div class="drag-indicator"></div>
      <header>
        <h2>Comentários ({{ comments.length }})</h2>
        <button @click="emit('close')" aria-label="Fechar comentários"><i class="mdi mdi-close"/></button>
      </header>
      <div class="comment-list">
        <p v-if="!comments.length" class="empty">Seja o primeiro a comentar!</p>
        <article v-for="comment in comments" :key="comment.id">
          <div class="comment-content">
            <strong>{{ comment.autor || comment.username || 'Usuário' }}</strong>
            <time>{{ new Date(comment.criado_em).toLocaleDateString('pt-BR') }}</time>
            <p>{{ comment.texto }}</p>
          </div>
          <button v-if="auth.user?.user_id === comment.usuario_id" @click="remove(comment.id)" aria-label="Excluir comentário" class="delete"><i class="mdi mdi-delete-outline"/></button>
        </article>
      </div>
      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <form @submit.prevent="send">
        <input v-model="texto" maxlength="1000" placeholder="Adicione um comentário" aria-label="Adicionar comentário" required />
        <button type="submit" :disabled="sending || !texto.trim()" aria-label="Enviar comentário"><i class="mdi mdi-send"/></button>
      </form>
    </section>
  </div>
</template>
<style scoped>
.comments-overlay{position:fixed;inset:0;background:#0005;backdrop-filter:blur(3px);z-index:1100;display:flex;align-items:flex-end;justify-content:center}
.comments-panel{background:white;width:100%;max-height:82dvh;min-height:55dvh;border-radius:22px 22px 0 0;display:flex;flex-direction:column;overflow:hidden;color:#092f4b}
.drag-indicator{width:72px;height:4px;border-radius:4px;background:#d8d8d8;margin:12px auto}
header{padding:0 20px;display:flex;align-items:center;justify-content:space-between}
header h2{font-size:17px}header button{border:0;background:none;color:#034467;font-size:22px;cursor:pointer}
.comment-list{overflow:auto;flex:1;padding:8px 20px}.comment-list article{border-bottom:1px solid #d5e4ec;padding:15px 0;display:flex;justify-content:space-between;gap:12px}
.comment-content{flex:1;min-width:0}.comment-content strong{color:#004369;font-size:14px}.comment-content time{margin-left:9px;color:#63717e;font-size:12px}.comment-content p{margin:8px 0;overflow-wrap:anywhere;font-size:14px}
.delete{border:0;background:none;color:#c23945;cursor:pointer}.empty{text-align:center;color:#667b8b}
.error{color:#b3261e;padding:0 20px}
form{display:flex;gap:8px;padding:16px 20px;background:#f0f1f2}form input{flex:1;min-width:0;border:0;border-radius:24px;background:white;padding:12px;font:inherit}form button{background:#004369;color:white;border:0;border-radius:50%;width:43px;height:43px;cursor:pointer}form button:disabled{opacity:.5}
@media(min-width:768px){.comments-overlay{align-items:center;padding:24px}.comments-panel{border-radius:16px;max-width:560px;min-height:520px;max-height:75dvh}}
</style>
