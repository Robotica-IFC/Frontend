# Confirmação de ações

O `ConfirmActionModal.vue` é montado uma vez no `App.vue`. Use o composable em qualquer componente ou outro composable:

```js
import { useConfirmation } from '@/composables/useConfirmation'

const { confirm } = useConfirmation()

await confirm({
  title: 'Excluir registro?',
  message: 'O registro será excluído permanentemente.',
  confirmLabel: 'Excluir registro',
  cancelLabel: 'Voltar',
  busyLabel: 'Excluindo...',
  danger: true,
  onConfirm: () => api.delete(id),
})
```

`confirm` retorna `true` após a execução bem-sucedida e `false` ao cancelar. A função `onConfirm` só é executada após confirmar. Se ela rejeitar a Promise, o modal mostra o erro e permite tentar novamente. Deixe os erros da API chegarem ao composable.

Durante a operação, os botões e o fechamento ficam bloqueados. O diálogo nativo controla o foco, inicia no botão de cancelar e aceita Escape quando não há operação em andamento. Ao trocar de rota, uma confirmação ainda não executada é cancelada.

As opções de excluir equipe e tornar outro professor OWNER ficam em **Editar equipe**. Só o OWNER pode executá-las ou remover participantes. A opção de excluir projeto fica em **Editar projeto**, disponível aos professores da equipe. As permissões também são verificadas no backend.
