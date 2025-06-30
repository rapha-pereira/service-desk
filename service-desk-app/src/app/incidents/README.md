# Página de Incidentes - Service Desk

## Funcionalidades

- **Listagem de incidentes**: Mostra todos os incidentes sem atendente definido por padrão
- **Filtro "Meus incidentes"**: Checkbox que permite alternar entre ver todos os incidentes disponíveis e apenas os incidentes do atendente logado
- **Assumir incidentes**: Atendentes e administradores podem assumir incidentes disponíveis
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

## Integração com API

### Endpoints utilizados:

1. **GET /api/incidents** - Lista incidentes sem atendente
2. **GET /api/incidents?attendantId={id}** - Lista incidentes de um atendente específico
3. **PUT /api/incidents/{id}** - Atualiza um incidente (usado para assumir)

### Estrutura dos dados:

```typescript
interface Incident {
  cod_incidente: number;
  assunto: string;
  descricao: string;
  data_abertura: string;
  status: string;
  nome_solicitante: string;
}
```

