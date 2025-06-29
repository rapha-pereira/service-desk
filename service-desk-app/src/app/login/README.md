# Página de Login - Service Desk

## Funcionalidades

- Página de login moderna e responsiva usando Ionic e Angular standalone
- Validação de formulário
- Integração com API REST (service-desk-api)
- Feedback visual com toasts para sucesso/erro
- Loading spinner durante a requisição
- Design responsivo e moderno

## Como funciona

1. O usuário acessa a aplicação e é redirecionado automaticamente para `/login`
2. Preenche os campos de email e senha
3. Ao clicar em "Entrar", uma requisição POST é enviada para a API
4. Se a API retornar status 200, o usuário é redirecionado para `/home`
5. Caso contrário, uma mensagem de erro é exibida

## Estrutura dos arquivos

- `login.page.ts` - Componente principal com lógica de login
- `login.page.html` - Template da página
- `login.page.scss` - Estilos da página

## Requisição para API

A página envia uma requisição POST para o endpoint de login com o seguinte formato:

```json
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```
