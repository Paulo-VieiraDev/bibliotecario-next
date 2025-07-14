✒️ Descrição do Projeto
Bibliotecário Escolar é uma plataforma web completa, desenvolvida como Trabalho de Conclusão de Curso em Análise e Desenvolvimento de Sistemas. O projeto foi criado para solucionar a ineficiência e os erros comuns na gestão manual de bibliotecas escolares, oferecendo uma solução digital, moderna e centralizada para o controle de livros, alunos e empréstimos.

A aplicação automatiza todo o fluxo de trabalho, desde o cadastro do acervo até a notificação de devoluções, permitindo que os profissionais da educação otimizem seu tempo e tenham acesso a dados estratégicos para a melhoria contínua do ambiente educacional.

🚀 Funcionalidades Principais
📊 Dashboard Analítico: Painel com métricas e gráficos em tempo real sobre o acervo, status dos empréstimos e os livros mais populares.

👤 Autenticação de Usuários: Sistema de login seguro para garantir que apenas pessoas autorizadas acessem a plataforma.

📚 Gestão de Livros (CRUD): Funcionalidade completa para cadastrar, editar, visualizar e remover livros do acervo.

🧑‍🎓 Gestão de Alunos e Professores (CRUD): Módulos dedicados para gerenciar os usuários do sistema.

🔄 Controle de Empréstimos: Fluxo de trabalho intuitivo para registrar empréstimos e devoluções, com atualização de status em tempo real.

🔔 Notificações Automáticas: Sistema que alerta os gestores sobre prazos de devolução que estão se aproximando.

🔍 Busca e Filtros Avançados: Ferramenta de pesquisa poderosa para localizar livros e empréstimos usando múltiplos critérios.

🎨 Interface Moderna: Design limpo, responsivo para todos os dispositivos e com a opção de Modo Dark.

🛠️ Tecnologias Utilizadas
A arquitetura do projeto foi construída com as tecnologias mais modernas do ecossistema JavaScript, visando alta performance, escalabilidade e manutenibilidade.

Frontend:

Next.js: Framework React para renderização no servidor (SSR) e geração de sites estáticos (SSG).

React: Biblioteca para construção de interfaces de usuário reativas e componentizadas.

TypeScript: Superset do JavaScript que adiciona tipagem estática ao código.

Tailwind CSS: Framework CSS utility-first para estilização ágil e customizada.

Shadcn/ui: Coleção de componentes de UI reutilizáveis, acessíveis e construídos sobre Radix UI.

Backend & Infraestrutura:

Supabase: Plataforma Backend-as-a-Service (BaaS) sobre PostgreSQL, utilizada para:

Banco de Dados Relacional Seguro (com RLS).

Autenticação de Usuários.

APIs geradas automaticamente.

Vercel: Plataforma de nuvem para hospedagem e deploy contínuo (CI/CD) da aplicação.

⚙️ Como Rodar o Projeto Localmente
Siga os passos abaixo para executar a aplicação no seu ambiente de desenvolvimento.

Pré-requisitos:

Node.js (versão 18 ou superior)

Git

Um gerenciador de pacotes (npm, yarn ou pnpm)

Uma conta no Supabase para criar o banco de dados.

Passos:

Clone o repositório;

Instale as dependências;

Crie um arquivo chamado .env.local na raiz do projeto.

Copie o conteúdo do arquivo .env.example (você deve criar este arquivo no seu repo!) para o .env.local.

Preencha o arquivo .env.local com as suas chaves do Supabase:

Snippet de código

NEXT_PUBLIC_SUPABASE_URL="SUA_URL_DO_PROJETO_SUPABASE"
NEXT_PUBLIC_SUPABASE_ANON_KEY="SUA_CHAVE_ANON_SUPABASE"
Configure o Banco de Dados no Supabase:

No painel do seu projeto Supabase, vá para o "SQL Editor".

Crie as tabelas necessárias para o projeto.

Execute a aplicação:

Bash

npm run dev
Acesse http://localhost:3000 no seu navegador para ver a aplicação funcionando.

👨‍💻 Autor
Feito com ❤️ por Paulo Vieira.
