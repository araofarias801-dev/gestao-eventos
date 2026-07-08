package com.gestao.eventos.service;

import com.gestao.eventos.dto.EventRequestDTO;
import com.gestao.eventos.dto.EventResponseDTO;
import com.gestao.eventos.entity.Event;
import com.gestao.eventos.exception.EventNotFoundException;
import com.gestao.eventos.mapper.EventMapper;
import com.gestao.eventos.repository.EventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EventServiceTest {

    @Mock
    private EventRepository eventRepository;

    @Mock
    private EventMapper eventMapper;

    @InjectMocks
    private EventService eventService;

    private Event event;
    private EventRequestDTO requestDTO;
    private EventResponseDTO responseDTO;

    @BeforeEach
    void setUp() {
        event = Event.builder()
                .id(1L)
                .title("Evento Teste")
                .description("Descrição do evento teste")
                .eventDate(LocalDateTime.now().plusDays(1))
                .location("São Paulo")
                .deleted(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        requestDTO = new EventRequestDTO();
        requestDTO.setTitle("Evento Teste");
        requestDTO.setDescription("Descrição do evento teste");
        requestDTO.setEventDate(LocalDateTime.now().plusDays(1));
        requestDTO.setLocation("São Paulo");

        responseDTO = EventResponseDTO.builder()
                .id(1L)
                .title("Evento Teste")
                .description("Descrição do evento teste")
                .eventDate(requestDTO.getEventDate())
                .location("São Paulo")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    void deveCriarEventoComSucesso() {
        when(eventMapper.toEntity(requestDTO)).thenReturn(event);
        when(eventRepository.save(any(Event.class))).thenReturn(event);
        when(eventMapper.toResponseDTO(event)).thenReturn(responseDTO);

        EventResponseDTO response = eventService.create(requestDTO);

        assertThat(response).isNotNull();
        assertThat(response.getTitle()).isEqualTo("Evento Teste");
        verify(eventRepository, times(1)).save(any(Event.class));
    }

    @Test
    void deveLancarExcecaoQuandoEventoNaoEncontrado() {
        when(eventRepository.findByIdAndDeletedFalse(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> eventService.findById(99L))
                .isInstanceOf(EventNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    void deveRealizarSoftDeleteCorretamente() {
        when(eventRepository.findByIdAndDeletedFalse(1L)).thenReturn(Optional.of(event));
        when(eventRepository.save(any(Event.class))).thenReturn(event);

        eventService.delete(1L);

        assertThat(event.getDeleted()).isTrue();
        verify(eventRepository, times(1)).save(event);
    }

    @Test
    void deveListarApenasEventosNaoDeletados() {
        PageRequest pageable = PageRequest.of(0, 10);
        Page<Event> page = new PageImpl<>(List.of(event));
        when(eventRepository.findAllByDeletedFalse(pageable)).thenReturn(page);
        when(eventMapper.toResponseDTO(event)).thenReturn(responseDTO);

        Page<EventResponseDTO> result = eventService.findAll(pageable);

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getTitle()).isEqualTo("Evento Teste");
    }
}
