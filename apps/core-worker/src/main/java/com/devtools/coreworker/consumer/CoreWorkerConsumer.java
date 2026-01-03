package com.devtools.coreworker.consumer;

import com.devtools.coreworker.config.RabbitMQConfig;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class CoreWorkerConsumer {

    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void receberMensagem(String mensagem) {
        System.out.println("=================================================");
        System.out.println("📬 NOVA MENSAGEM RECEBIDA NO JAVA!");
        System.out.println("Conteúdo: " + mensagem);
        System.out.println("=================================================");
    }
}