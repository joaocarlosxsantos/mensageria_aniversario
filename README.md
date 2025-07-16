# Sistema de Envio Automatizado de Mensagens de Aniversário

## Configuração Inicial

1. **Banco de Dados**
   - Configure a variável `DATABASE_URL` no arquivo `.env` com a string de conexão do seu PostgreSQL.
   - Exemplo:
     ```env
     DATABASE_URL="postgresql://usuario:senha@localhost:5432/mensageria_db"
     ```

2. **Variáveis de Ambiente**
   - Adicione também a variável do token da API de WhatsApp quando for integrar:
     ```env
     WHATSAPP_API_TOKEN="sua_api_key"
     ```

3. **Migrations**
   - Após configurar o banco, rode:
     ```bash
     npx prisma migrate dev --name init
     ```

4. **Execução**
   - Para rodar o projeto localmente:
     ```bash
     npm run dev
     ```

---

Siga as instruções acima antes de prosseguir com o desenvolvimento ou deploy.

## Formato Padrão da Planilha de Contatos

A planilha para importação deve conter as seguintes colunas (em português ou inglês):

| nome         | telefone      | data de nascimento |
|--------------|--------------|--------------------|
| João Silva   | 11999999999  | 1990-05-10         |
| Maria Souza  | 21988888888  | 1985-12-25         |

- **Colunas aceitas:**
  - `nome` ou `name`
  - `telefone` ou `phone`
  - `data de nascimento` ou `birthday`
- **Formato da data:**
  - Aceita `YYYY-MM-DD`, `DD/MM/YYYY` ou formato reconhecido pelo Excel
- **Telefone:**
  - Apenas números, com DDD (ex: 11999999999)

> **Importante:**
> Todas as três informações são obrigatórias para cada contato. Utilize sempre uma linha por contato.

Se desejar, utilize o modelo acima para criar sua planilha no Excel ou Google Sheets antes de importar.
