# 📘 Gestão de Eventos

Sistema full-stack de gerenciamento de eventos desenvolvido com Java 17 + Spring Boot, Angular 21, PostgreSQL e Docker.

---

## 🚀 Tecnologias utilizadas

- **Backend:** Java 17, Spring Boot 3, Spring Data JPA, Flyway, SpringDoc (Swagger), specification-arg-resolver
- **Frontend:** Angular 21, Angular Material 3 (MDC), Signals, Vitest
- **Banco de Dados:** PostgreSQL 16
- **Infraestrutura:** Docker, Docker Compose, Nginx

---

## 🏗️ Decisões e arquitetura

- **Backend** segue arquitetura em camadas: `controller` → `service` → `repository`
- **Soft delete** nos eventos: campo `deleted` (boolean), nunca removidos fisicamente
- **Paginação** via Spring Data `Pageable`
- **Filtros dinâmicos** com `specification-arg-resolver` (`@Spec`, `@And`) — título, local, intervalo de datas
- **Migrações** com Flyway (pasta `db/migration`)
- **Frontend** usa standalone components (sem NgModules) e Signals para estado reativo
- **Nginx** faz proxy de `/api/` → backend e fallback para `index.html` (SPA routing)

---

## 📋 Checklist de requisitos

- [x] CRUD completo de eventos (POST, GET, PUT, DELETE)
- [x] Paginação na listagem (`page`, `size`)
- [x] Filtros por título, local e intervalo de datas
- [x] Soft delete (eventos não são removidos fisicamente)
- [x] Validações com Bean Validation
- [x] Documentação com Swagger/OpenAPI
- [x] Migrações com Flyway
- [x] Testes unitários — Backend (JUnit 5 + Mockito) e Frontend (Vitest, 29 testes)
- [x] Containerização com Docker Compose (db + backend + frontend)
- [x] Healthcheck no PostgreSQL com `depends_on: condition: service_healthy`

---

## 🧱 Como executar

### 1. Deploy completo com Docker

```bash
cp .env.example .env
docker compose up -d --build
```

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost |
| Backend | http://localhost:8080 |
| Swagger | http://localhost:8080/swagger-ui.html |

Comandos úteis:

```bash
docker compose ps
docker compose logs -f backend
docker compose down
docker compose down -v   # remove volumes (banco)
```

### 2. Rodar localmente (sem Docker)

**Backend:**
```bash
cd backend
./mvnw spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

> O frontend conecta ao backend em `http://localhost:8080/api` por padrão (`src/environments/environment.ts`).

---

## 🔐 Variáveis de Ambiente

Copie `.env.example` para `.env` e ajuste conforme necessário:

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `POSTGRES_DB` | Nome do banco | `gestao_eventos` |
| `POSTGRES_USER` | Usuário do banco | `postgres` |
| `POSTGRES_PASSWORD` | Senha do banco | `postgres` |
| `DB_URL` | URL JDBC | `jdbc:postgresql://db:5432/gestao_eventos` |
| `DB_USER` | Usuário para o backend | `postgres` |
| `DB_PASSWORD` | Senha para o backend | `postgres` |

---

## 📡 Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/events` | Lista eventos (paginado + filtros) |
| GET | `/api/events/{id}` | Detalhes do evento |
| POST | `/api/events` | Cria novo evento |
| PUT | `/api/events/{id}` | Atualiza evento |
| DELETE | `/api/events/{id}` | Remove evento (soft delete) |

### Filtros — GET `/api/events`

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `title` | string | Filtra por título (like, case-insensitive) |
| `location` | string | Filtra por local (like, case-insensitive) |
| `dateFrom` | string | Data mínima — formato `yyyy-MM-dd'T'HH:mm:ss` |
| `dateTo` | string | Data máxima — formato `yyyy-MM-dd'T'HH:mm:ss` |
| `page` | int | Número da página (padrão: 0) |
| `size` | int | Tamanho da página (padrão: 10) |

Exemplo:
```
GET /api/events?title=conferencia&dateFrom=2026-07-01T00:00:00&dateTo=2026-07-31T23:59:59&page=0&size=10
```

---

## ✅ Como executar os testes

**Backend:**
```bash
cd backend
./mvnw test
```

**Frontend:**
```bash
cd frontend
npm test
```

> 29 testes unitários passando: `EventService`, `EventList`, `EventDetail`, `EventForm`, `App`.

---

## 🗃️ Estrutura de diretórios

```
gestao-eventos/
├── backend/
│   ├── src/main/java/com/gestao/eventos/
│   │   ├── config/          # CorsConfig, ResolverConfig
│   │   ├── controller/      # EventController
│   │   ├── dto/             # EventRequest, EventResponse
│   │   ├── entity/          # Event
│   │   ├── repository/      # EventRepository
│   │   ├── service/         # EventService
│   │   └── specification/   # EventSpec (filtros dinâmicos)
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   └── db/migration/    # Flyway migrations
│   └── Dockerfile
├── frontend/
│   ├── src/app/
│   │   ├── core/
│   │   │   ├── models/      # event.model.ts
│   │   │   └── services/    # event.ts, notification.ts
│   │   ├── features/events/pages/
│   │   │   ├── event-list/
│   │   │   ├── event-detail/
│   │   │   └── event-form/
│   │   └── shared/
│   │       ├── confirm-dialog/
│   │       └── not-found/
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
├── .env.example
└── README.md
```
