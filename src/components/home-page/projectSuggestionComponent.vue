<script setup>
import { useProjectSuggestion } from '@/composables/useProjectSuggestion'
import teamSelectComponent from '@/components/teams/teamSelectComponent.vue'

const {
  form,
  selectedTeam,
  teams,
  loadingTeams,
  teamError,
  attachments,
  fileInput,
  submitting,
  errors,
  successMessage,
  loadTeams,
  selectTeam,
  selectAttachments,
  clearForm,
  submitSuggestion,
} = useProjectSuggestion()
</script>

<template>
  <section id="sugira-um-projeto" class="suggestion-section" aria-labelledby="suggestion-heading">
    <header class="suggestion-header">
      <h2 id="suggestion-heading" tabindex="-1">Sugira um projeto:</h2>
      <p>
        Explique sua ideia de projeto de forma simples, dizendo o que ele faz e como pode ser
        aplicado.
      </p>
    </header>

    <form novalidate :aria-busy="submitting" @submit.prevent="submitSuggestion">
      <fieldset class="suggestion-fields" :disabled="submitting">
        <legend class="visually-hidden">Sua sugestão de projeto</legend>
        <fieldset class="identity-options">
          <legend class="visually-hidden">Identificação do autor</legend>
          <label
            ><input v-model="form.anonimo" type="radio" name="suggestion-identity" :value="false" />
            Quero me identificar.</label
          >
          <label
            ><input v-model="form.anonimo" type="radio" name="suggestion-identity" :value="true" />
            Não quero me identificar.</label
          >
        </fieldset>
        <p v-if="errors.anonimo" class="field-error" role="alert">{{ errors.anonimo }}</p>

        <div class="suggestion-details">
          <div class="suggestion-icon" aria-hidden="true">
            <span class="mdi mdi-clipboard-edit-outline"></span>
          </div>
          <div class="suggestion-content">
            <h3>Detalhes.</h3>
            <p class="help-text">Informações que nos ajudam a desenvolver melhor sua sugestão.</p>

            <div class="suggestion-field title-field">
              <label for="suggestion-title">Título:</label>
              <input
                id="suggestion-title"
                v-model="form.titulo"
                type="text"
                maxlength="30"
                required
                :aria-invalid="!!errors.titulo"
                aria-describedby="suggestion-title-count suggestion-title-error"
              />
              <small id="suggestion-title-count" class="char-count"
                >{{ form.titulo.length }}/30</small
              >
              <p v-if="errors.titulo" id="suggestion-title-error" class="field-error" role="alert">
                {{ errors.titulo }}
              </p>
            </div>

            <div class="suggestion-field">
              <label for="suggestion-team">Equipe:</label>
              <teamSelectComponent
                :model-value="selectedTeam"
                :teams="teams"
                :loading="loadingTeams"
                :error="teamError"
                :disabled="submitting"
                :invalid="!!errors.equipe"
                @update:model-value="selectTeam"
                @retry="loadTeams"
              />
              <p v-if="errors.equipe" id="suggestion-team-error" class="field-error" role="alert">
                {{ errors.equipe }}
              </p>
            </div>

            <div class="suggestion-field">
              <label for="suggestion-description">Descrição:</label>
              <p id="suggestion-description-help" class="help-text">
                Descreva sua sugestão de projeto de robótica com as informações principais. Se
                quiser, adicione anexos.
              </p>
              <textarea
                id="suggestion-description"
                v-model="form.descricao"
                rows="8"
                maxlength="1000"
                required
                :aria-invalid="!!errors.descricao"
                aria-describedby="suggestion-description-help suggestion-description-count suggestion-description-error"
              ></textarea>
              <div class="description-footer">
                <small id="suggestion-description-count" class="char-count"
                  >{{ form.descricao.length }}/1000</small
                >
                <button type="button" class="attachment-button" @click="fileInput?.click()">
                  <span class="mdi mdi-paperclip" aria-hidden="true"></span> Inserir anexo
                </button>
              </div>
              <input
                ref="fileInput"
                class="visually-hidden"
                type="file"
                accept=".pdf,application/pdf"
                multiple
                aria-label="Selecionar anexos PDF"
                tabindex="-1"
                @change="selectAttachments"
              />
              <small class="help-text">Anexos opcionais em PDF.</small>
              <p
                v-if="errors.descricao"
                id="suggestion-description-error"
                class="field-error"
                role="alert"
              >
                {{ errors.descricao }}
              </p>
              <ul
                v-if="attachments.length"
                class="attachment-list"
                aria-label="Anexos selecionados"
              >
                <li v-for="(attachment, index) in attachments" :key="index">
                  <span class="mdi mdi-file-pdf-box" aria-hidden="true"></span
                  ><span>{{ attachment.file.name }}</span>
                  <button
                    type="button"
                    :aria-label="`Remover ${attachment.file.name}`"
                    @click="attachments.splice(index, 1)"
                  >
                    <span class="mdi mdi-close" aria-hidden="true"></span>
                  </button>
                </li>
              </ul>
              <p v-if="errors.anexos" class="field-error" role="alert">{{ errors.anexos }}</p>
            </div>
          </div>
        </div>

        <div class="suggestion-actions">
          <button type="submit" class="send-button">
            {{ submitting ? 'Enviando...' : 'Enviar' }}
          </button>
          <button type="button" class="clear-button" @click="clearForm">Limpar</button>
        </div>
      </fieldset>
      <p v-if="errors.general" class="field-error feedback-message" role="alert">
        {{ errors.general }}
      </p>
      <p v-if="successMessage" class="success-message feedback-message" role="status">
        {{ successMessage }}
      </p>
    </form>
  </section>
</template>

<style scoped src="./projectSuggestionComponent.css"></style>
