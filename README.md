# Biblioteca Escolar

Sistema de gerenciamento de biblioteca escolar desenvolvido com Next.js 14, TypeScript, Tailwind CSS e Supabase.

## Funcionalidades
- Autenticação de usuários (Supabase)
- Cadastro, edição e exclusão de livros
- Cadastro, edição e exclusão de alunos
- Controle de empréstimos e devoluções
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

```
NEXT_PUBLIC_SUPABASE_URL=URL_DO_SEU_SUPABASE
NEXT_PUBLIC_SUPABASE_ANON_KEY=CHAVE_ANON_DO_SUPABASE
```

Pegue esses valores no painel do [Supabase](https://app.supabase.com/).

### 4. Configure o banco de dados
- Crie as tabelas e funções SQL no Supabase conforme o projeto (livros, alunos, emprestimos, etc).
- Você pode usar o SQL Editor do Supabase para rodar os scripts.

### 5. Rode o projeto localmente
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

## Personalização
- As cores e layout podem ser alterados em `tailwind.config.js` e nos componentes em `src/app/(dashboard)/layout.tsx`.
- Para mudar o logo, altere o texto ou adicione uma imagem na topbar.

---

## Licença
Este projeto é livre para uso educacional.

## Deploy no Vercel

1. Faça o push do projeto para o GitHub.
2. No Vercel, importe o repositório e selecione o framework Next.js.
3. Configure as variáveis de ambiente necessárias (ex: SUPABASE_URL, SUPABASE_ANON_KEY, etc).
4. O comando de build padrão é `next build`.
5. O diretório de saída é `/.next` (padrão do Next.js).
6. Certifique-se de que existe pelo menos uma rota (página ou API) em `src/app`.

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

Pronto para deploy no Vercel e versionamento no GitHub!
