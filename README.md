# Gestão de Eventos

Sistema full-stack de gerenciamento de eventos desenvolvido com Java + Spring Boot, Angular, PostgreSQL e Docker.

## Tecnologias

- **Backend:** Java 17, Spring Boot, Spring Data JPA, Flyway, Swagger
- **Frontend:** Angular 17, Angular Material
- **Banco de Dados:** PostgreSQL
- **Infraestrutura:** Docker, Docker Compose

## Estrutura do Projeto

```
gestao-eventos/
├── backend/       # API REST Spring Boot
├── frontend/      # Aplicação Angular
├── docker-compose.yml
├── .env
└── README.md
```

## Como executar

### Pré-requisitos

- Docker e Docker Compose instalados

### Subir o ambiente completo

```bash
cp .env.example .env
docker-compose up --build
```

- Frontend: http://localhost:80
- Backend: http://localhost:8080
- Swagger: http://localhost:8080/swagger-ui.html

## Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/events` | Lista eventos (paginado) |
| GET | `/api/events/{id}` | Detalhes do evento |
| POST | `/api/events` | Cria novo evento |
| PUT | `/api/events/{id}` | Atualiza evento |
| DELETE | `/api/events/{id}` | Remove evento (soft delete) |
