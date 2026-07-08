CREATE TABLE events (
    id          BIGSERIAL PRIMARY KEY,
    title       VARCHAR(100)  NOT NULL,
    description VARCHAR(1000) NOT NULL,
    event_date  TIMESTAMP     NOT NULL,
    location    VARCHAR(200)  NOT NULL,
    deleted     BOOLEAN       NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP     NOT NULL,
    updated_at  TIMESTAMP
);
