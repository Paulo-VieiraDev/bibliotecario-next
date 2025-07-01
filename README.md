# Biblioteca Escolar

Sistema de gerenciamento de biblioteca escolar desenvolvido com Next.js 14, TypeScript, Tailwind CSS e Supabase.

## Descrição

Este sistema foi criado para facilitar o controle de livros, empréstimos, devoluções e organização do acervo escolar. Possui interface moderna, responsiva e diversas automações para o dia a dia do bibliotecário.

## Funcionalidades
- Autenticação de usuários (Supabase)
- Cadastro, edição e exclusão de livros
- Cadastro, edição e exclusão de alunos e professores
- Controle de empréstimos, devoluções e renovações
- Notificações automáticas:
  - Atrasos de devolução
  - Lembrete de devolução (faltam 3 dias)
  - Mensagem de bom dia
  - Parabéns a cada 5 empréstimos
  - Livro devolvido com atraso
  - Porcentagem do ano restante (todo dia 1º do mês)
- Relatórios com gráficos (Recharts)
- Tema claro/escuro
- Layout responsivo e moderno

## Tecnologias
- [Next.js 14](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [Recharts](https://recharts.org/)

## Como rodar o projeto

### 1. Clone o repositório
```bash
git clone https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git
cd NOME_DO_REPOSITORIO
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon
```
Pegue esses valores no painel do [Supabase](https://app.supabase.com/).

### 4. Configure o banco de dados
- Crie as tabelas e funções SQL no Supabase conforme o projeto (livros, alunos, emprestimos, etc).
- Você pode usar o SQL Editor do Supabase para rodar os scripts.

### 5. Configure as notificações automáticas (pg_cron)
O sistema utiliza o [pg_cron](https://supabase.com/docs/guides/database/extensions/pgcron) para agendar notificações automáticas. Exemplo de job SQL:

```sql
select cron.schedule(
  'Notificações automáticas da biblioteca',
  '0 8 * * *',
$$
-- (Cole aqui o bloco de notificações automáticas do README ou do arquivo /sql/notificacoes_cron.sql)
$$
);
```

### 6. Rode o projeto localmente
```bash
npm run dev
```
Acesse [http://localhost:3000](http://localhost:3000) no navegador.

---

## Scripts úteis
- `npm run dev` — roda o projeto em modo desenvolvimento
- `npm run build` — build de produção
- `npm run start` — roda o build de produção

---

## Como contribuir
1. Faça um fork do projeto
2. Crie uma branch: `git checkout -b minha-feature`
3. Faça commit das suas alterações: `git commit -m 'feat: minha nova feature'`
4. Faça push para o seu fork: `git push origin minha-feature`
5. Abra um Pull Request

## Contato/Suporte
- Email: seuemail@dominio.com
- [Abrir issue no GitHub](https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO/issues)

---

## Boas práticas para o GitHub
- Inclua um `.gitignore` adequado (já incluso).
- Mantenha o `README.md` atualizado com instruções de uso e deploy.
- Use branches para novas features/correções.
- Faça commits claros e frequentes.

## Estrutura recomendada
- src/app: páginas e rotas
- src/components: componentes reutilizáveis
- src/services: integrações externas
- src/lib: utilidades e configs
- src/types: tipos TypeScript
