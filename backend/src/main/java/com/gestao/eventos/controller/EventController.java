package com.gestao.eventos.controller;

import com.gestao.eventos.dto.EventRequestDTO;
import com.gestao.eventos.dto.EventResponseDTO;
import com.gestao.eventos.service.EventService;
import com.gestao.eventos.specification.EventSpec;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@Tag(name = "Eventos", description = "Gerenciamento de eventos")
public class EventController {

    private final EventService eventService;

    @GetMapping
    @Operation(summary = "Lista todos os eventos com paginação e filtros")
    public ResponseEntity<Page<EventResponseDTO>> findAll(
            EventSpec.EventFilter spec,
            Pageable pageable) {
        return ResponseEntity.ok(eventService.findAll(spec, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca evento por ID")
    public ResponseEntity<EventResponseDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Cria um novo evento")
    public ResponseEntity<EventResponseDTO> create(@RequestBody @Valid EventRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(eventService.create(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualiza um evento existente")
    public ResponseEntity<EventResponseDTO> update(@PathVariable Long id,
                                                    @RequestBody @Valid EventRequestDTO dto) {
        return ResponseEntity.ok(eventService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remove um evento (soft delete)")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        eventService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
