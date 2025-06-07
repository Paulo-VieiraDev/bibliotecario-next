```mermaid
erDiagram
    USUARIO {
        int id PK
        string nome
        string email
        string senha
        string role
    }
    LIVRO {
        int id PK
        string titulo
        string autor
        string isbn
        string status
    }
    EMPRESTIMO {
        int id PK
        int usuario_id FK
        int livro_id FK
        date data_emprestimo
        date data_devolucao
        date data_devolvido
        string status
    }
    TURMA {
        int id PK
        string nome
        string serie
        string turno
    }
    ALUNO {
        int id PK
        int turma_id FK
        string nome
        string matricula
    }

    USUARIO ||--o{ EMPRESTIMO : "realiza"
    LIVRO ||--o{ EMPRESTIMO : "é emprestado"
    TURMA ||--o{ ALUNO : "contém"
    ALUNO ||--o{ EMPRESTIMO : "realiza"
} 