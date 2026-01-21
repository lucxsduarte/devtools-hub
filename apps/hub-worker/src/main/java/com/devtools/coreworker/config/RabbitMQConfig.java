package com.devtools.coreworker.config;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String QUEUE_NAME = "core_queue";

    @Bean
    public Queue coreQueue() {
        // Cria uma fila durável (não se perde se o RabbitMQ reiniciar)
        return new Queue(QUEUE_NAME, true);
    }
}