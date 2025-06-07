```mermaid
graph TB
    subgraph Geração de Relatórios
        R[Relatórios]
    end

    subgraph Tipos
        D[Diário]
        M[Mensal]
        T[Por Turma]
        L[Por Livro]
    end

    subgraph Processamento
        C[Coleta Dados]
        F[Filtragem]
        A[Agregação]
        V[Visualização]
    end

    subgraph Saída
        PDF[PDF]
        EXCEL[Excel]
        GRAF[Gráficos]
    end

    R --> D
    R --> M
    R --> T
    R --> L

    D --> C
    M --> C
    T --> C
    L --> C

    C --> F
    F --> A
    A --> V

    V --> PDF
    V --> EXCEL
    V --> GRAF

    style Geração de Relatórios fill:#f9f,stroke:#333,stroke-width:2px
    style Tipos fill:#bbf,stroke:#333,stroke-width:2px
    style Processamento fill:#bfb,stroke:#333,stroke-width:2px
    style Saída fill:#fbb,stroke:#333,stroke-width:2px
``` 