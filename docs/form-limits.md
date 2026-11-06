# Limites dos formulários e notificações

O frontend consulta `GET /api/formularios/limites/`. As regras vêm dos serializers usados pela API: tamanho mínimo e máximo, campos vazios e limites de números inteiros. Formulários existentes continuam funcionando se essa consulta falhar; a API permanece responsável por validar o envio.

Login e cadastro de usuários mantêm o comportamento anterior, sem contadores, dicas de upload ou as novas validações antecipadas. Os limites continuam disponíveis nos demais formulários, incluindo edição de perfil e cadastro de instituições fora do fluxo de criação de conta. A consulta das regras só acontece quando um formulário que as utiliza é aberto.

Para campos com `appInput`, informe o recurso e o nome do campo:

```vue
<appInput v-model="nome" resource="equipe" field="nome" required />
```

Para inputs e textareas nativos, use `useFormLimits().attrs(resource, field)` com `v-bind` e adicione `FieldHint` abaixo do campo. O componente mostra a contagem e o limite do servidor. Quando não há limite de caracteres definido, isso é informado, sem inventar um máximo.

As stores chamam `assertValid` antes de salvar ou enviar imagens. `UploadHint` mostra os formatos aceitos e o upload valida esses formatos. `formatApiError` transforma erros por campo em mensagens legíveis. Não há limite de tamanho de arquivo nem quantidade de imagens definido no backend atual; nenhum desses limites foi inventado na interface.

As notificações mostram apenas convites pendentes. Aceitar ou recusar retira o cartão e atualiza o contador depois do sucesso da API. Erros preservam o convite; requisições atrasadas e cliques repetidos não o duplicam. O logout limpa os dados da sessão.

Validação local:

```sh
npm run test:forms
npm run test:notifications
npm run test:confirmation
npm run build
```

Publique backend e frontend juntos para disponibilizar o endpoint de limites e a filtragem dos convites recebidos.
