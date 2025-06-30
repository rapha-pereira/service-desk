# Página de Incidentes - Service Desk

## Funcionalidades

- **Listagem de incidentes**: Mostra todos os incidentes sem atendente definido por padrão
- **Filtro "Meus incidentes"**: Checkbox que permite alternar entre ver todos os incidentes disponíveis e apenas os incidentes do atendente logado
- **Assumir incidentes**: Atendentes e administradores podem assumir incidentes disponíveis
- **Criar novos incidentes**: FAB button para criar novos incidentes (Atendentes e Administradores)
- **Editar incidentes**: Botão para editar incidentes existentes (apenas Administradores)
- **Deletar incidentes**: Botão para excluir incidentes (apenas Administradores)
- **Informações do usuário**: Exibe o nome do usuário logado
- **Logout**: Botão para sair da aplicação
- **Pull to refresh**: Arrastar para baixo para atualizar a lista
- **Design responsivo**: Interface moderna e responsiva

## Como funciona

### Fluxo de navegação
1. Após login bem-sucedido, o usuário é redirecionado para `/incidents`
2. A página verifica se há um usuário logado, caso contrário redireciona para login
3. Por padrão, carrega incidentes sem atendente definido

### Funcionalidades do checkbox "Meus incidentes"
- **Desmarcado (padrão)**: Mostra incidentes onde `atendente` é `null` ou `0`
- **Marcado**: Mostra incidentes onde `atendente` = `cod_usuario` do usuário logado

### Assumir incidentes
- Disponível apenas para usuários com nível "Atendente" ou "Administrador"
- Ao clicar em "Assumir Incidente", faz uma requisição PUT para atualizar o incidente
- Após assumir, a lista é recarregada automaticamente

### Criar novos incidentes
- FAB button disponível para "Atendente" e "Administrador"
- Modal com formulário para preencher os dados do incidente
- Campos obrigatórios: usuário, assunto, descrição
- Campos opcionais: atendente, data de previsão

### Editar incidentes
- Botão de edição disponível apenas para "Administrador"
- Modal com formulário pré-preenchido com dados do incidente
- Permite alterar: atendente e data de previsão

### Deletar incidentes
- Botão de exclusão disponível apenas para "Administrador"
- Confirmação via alert antes de excluir
- Exclusão permanente do banco de dados

## Integração com API

### Base URL: `https://reimagined-sniffle-xqrgjpqg6v5hr-3000.app.github.dev/api/`

### Endpoints utilizados:

1. **GET /incidents** - Lista incidentes sem atendente
2. **GET /incidents?attendantId={id}** - Lista incidentes de um atendente específico
3. **POST /incidents** - Cria novo incidente
4. **PUT /incidents/{id}** - Atualiza um incidente (usado para assumir e editar)
5. **DELETE /incidents/{id}** - Exclui um incidente

### Estrutura dos dados para criação:

```json
{
  "usuario": 1,
  "atendente": 2,
  "assunto": "Problema no sistema",
  "descricao": "Descrição detalhada do problema",
  "data_previsao": "2025-07-07"
}
```

### Estrutura dos dados para atualização:

```json
{
  "atendente": 2,
  "data_previsao": "2025-07-07"
}
```

## Arquivos atualizados:

- `incidents.page.ts` - Adicionados métodos para CRUD completo
- `incidents.page.html` - Adicionado modal e botões de ação
- `incidents.page.scss` - Estilos para modal e novos botões
- `README.md` - Documentação atualizada

## Funcionalidades visuais:

- **Modal responsivo** para criar/editar incidentes
- **Botões de ação** nos cards dos incidentes
- **Confirmação de exclusão** via alert
- **Loading states** em todas as operações
- **Feedback visual** com toasts para todas as ações
- **Formulários validados** com campos obrigatórios

## Permissões por nível de usuário:

- **Solicitante**: Apenas visualiza incidentes
- **Atendente**: 
  - Visualiza incidentes
  - Assume incidentes disponíveis
  - Cria novos incidentes
- **Administrador**: 
  - Todas as funcionalidades do Atendente
  - Edita incidentes existentes
  - Exclui incidentes
  - Acesso completo ao CRUD

## Validações implementadas:

- **Criação**: usuario, assunto e descrição são obrigatórios
- **Edição**: Apenas campos permitidos (atendente e data_previsao)
- **Exclusão**: Confirmação obrigatória antes de excluir
- **Formulários**: Validação client-side com Angular Forms
