package com.gestao.eventos.service;

import com.gestao.eventos.dto.EventRequestDTO;
import com.gestao.eventos.dto.EventResponseDTO;
import com.gestao.eventos.entity.Event;
import com.gestao.eventos.exception.EventNotFoundException;
import com.gestao.eventos.mapper.EventMapper;
import com.gestao.eventos.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final EventMapper eventMapper;

    public Page<EventResponseDTO> findAll(Specification<Event> spec, Pageable pageable) {
        return eventRepository.findAll(spec, pageable)
                .map(eventMapper::toResponseDTO);
    }

    public EventResponseDTO findById(Long id) {
        Event event = eventRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new EventNotFoundException(id));
        return eventMapper.toResponseDTO(event);
    }

    public EventResponseDTO create(EventRequestDTO dto) {
        Event event = eventMapper.toEntity(dto);
        return eventMapper.toResponseDTO(eventRepository.save(event));
    }

    public EventResponseDTO update(Long id, EventRequestDTO dto) {
        Event event = eventRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new EventNotFoundException(id));
        eventMapper.updateEntityFromDTO(dto, event);
        return eventMapper.toResponseDTO(eventRepository.save(event));
    }

    public void delete(Long id) {
        Event event = eventRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new EventNotFoundException(id));
        event.setDeleted(true);
        eventRepository.save(event);
    }
}
