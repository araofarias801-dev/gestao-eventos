package com.gestao.eventos.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API - Gestão de Eventos")
                        .description("API REST para gerenciamento de eventos. Permite cadastrar, listar, editar e excluir eventos com suporte a paginação e soft delete.")
                        .version("v1.0.0")
                        .contact(new Contact()
                                .name("Gestão de Eventos")
                                .email("contato@gestao-eventos.com")));
    }
}
