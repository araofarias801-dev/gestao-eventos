package com.gestao.eventos.exception;

public class EventNotFoundException extends RuntimeException {

    public EventNotFoundException(Long id) {
        super("Evento não encontrado com id: " + id);
    }
}
