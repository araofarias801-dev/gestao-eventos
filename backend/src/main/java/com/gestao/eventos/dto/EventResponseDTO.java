package com.gestao.eventos.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class EventResponseDTO {

    private Long id;
    private String title;
    private String description;
    private LocalDateTime eventDate;
    private String location;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
