package com.gestao.eventos.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gestao.eventos.dto.EventRequestDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class EventControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void deveCriarEListarEvento() throws Exception {
        EventRequestDTO dto = new EventRequestDTO();
        dto.setTitle("Evento Integração");
        dto.setDescription("Teste de integração completo");
        dto.setEventDate(LocalDateTime.now().plusDays(5));
        dto.setLocation("Rio de Janeiro");

        mockMvc.perform(post("/api/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Evento Integração"))
                .andExpect(jsonPath("$.location").value("Rio de Janeiro"));

        mockMvc.perform(get("/api/events"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    void deveRetornar404ParaEventoInexistente() throws Exception {
        mockMvc.perform(get("/api/events/9999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void deveRetornar400ParaDadosInvalidos() throws Exception {
        EventRequestDTO dto = new EventRequestDTO();

        mockMvc.perform(post("/api/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest());
    }
}
