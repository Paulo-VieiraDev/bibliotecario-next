-- Habilitar RLS em todas as tabelas
alter table if exists turmas enable row level security;
alter table if exists professores enable row level security;
alter table if exists alunos enable row level security;
alter table if exists livros enable row level security;
alter table if exists emprestimos enable row level security;
alter table if exists usuarios enable row level security;

-- Criar tabelas se não existirem
create table if not exists turmas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table if not exists professores (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table if not exists alunos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  turma_id uuid references turmas(id),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table if not exists livros (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  autor text not null,
  editora text not null,
  edicao text not null,
  quantidade integer not null,
  quantidade_disponivel integer not null,
  vida_util integer,
  categoria text not null,
  ano_serie text,
  etapa text,
  tipo_didatico text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table if not exists emprestimos (
  id uuid primary key default gen_random_uuid(),
  livro_id uuid references livros(id),
  aluno_id uuid references alunos(id),
  professor_id uuid references professores(id),
  data_emprestimo timestamp with time zone not null,
  data_devolucao timestamp with time zone,
  status text not null check (status in ('emprestado', 'devolvido')),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table if not exists usuarios (
  id uuid primary key references auth.users(id),
  nome text not null,
  sobrenome text,
  funcao text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Políticas RLS para turmas
create policy "Permitir acesso total à tabela turmas"
  on turmas for all
  using (true)
  with check (true);

-- Políticas RLS para professores
create policy "Permitir acesso total à tabela professores"
  on professores for all
  using (true)
  with check (true);

-- Políticas RLS para alunos
create policy "Permitir acesso total à tabela alunos"
  on alunos for all
  using (true)
  with check (true);

-- Políticas RLS para livros
create policy "Permitir acesso total à tabela livros"
  on livros for all
  using (true)
  with check (true);

-- Políticas RLS para empréstimos
create policy "Permitir acesso total à tabela emprestimos"
  on emprestimos for all
  using (true)
  with check (true);

-- Políticas RLS para usuários
create policy "Permitir acesso total à tabela usuarios"
  on usuarios for all
  using (true)
  with check (true);

-- Inserindo as turmas específicas
insert into turmas (nome) values
-- Ensino Fundamental II (6º ao 9º)
('6º Ano A'),
('6º Ano B'),
('7º Ano A'),
('7º Ano B'),
('8º Ano A'),
('8º Ano B'),
('9º Ano A'),
('9º Ano B'),
-- Ensino Médio (1º ao 3º)
('1º Ano A'),
('2º Ano A'),
('3º Ano A'); 