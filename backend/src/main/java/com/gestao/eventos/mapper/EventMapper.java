package com.gestao.eventos.mapper;

import com.gestao.eventos.dto.EventRequestDTO;
import com.gestao.eventos.dto.EventResponseDTO;
import com.gestao.eventos.entity.Event;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface EventMapper {

    EventResponseDTO toResponseDTO(Event event);

    Event toEntity(EventRequestDTO dto);

    void updateEntityFromDTO(EventRequestDTO dto, @MappingTarget Event event);
}
