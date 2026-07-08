package com.gestao.eventos.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EventRequestDTO {

    @NotBlank(message = "Título é obrigatório")
    @Size(max = 100, message = "Título deve ter no máximo 100 caracteres")
    private String title;

    @NotBlank(message = "Descrição é obrigatória")
    @Size(max = 1000, message = "Descrição deve ter no máximo 1000 caracteres")
    private String description;

    @NotNull(message = "Data e hora do evento são obrigatórias")
    @FutureOrPresent(message = "A data do evento deve ser presente ou futura")
    private LocalDateTime eventDate;

    @NotBlank(message = "Local é obrigatório")
    @Size(max = 200, message = "Local deve ter no máximo 200 caracteres")
    private String location;
}
