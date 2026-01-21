package com.devtools.coreworker.consumer;

import com.devtools.coreworker.config.RabbitMQConfig;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
public class CoreWorkerConsumer {

    private final StringRedisTemplate redisTemplate;
    private final Gson gson;

    public CoreWorkerConsumer(final StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
        this.gson = new Gson();
    }

    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void receberMensagem(final String mensagem) {
        System.out.println("=================================================");
        System.out.println("PROCESSANDO TAREFA...");

        try {
            final var jsonOriginal = JsonParser.parseString(mensagem).getAsJsonObject();

            final var dados = jsonOriginal.has("data") ? jsonOriginal.getAsJsonObject("data") : jsonOriginal;

            final var url = dados.get("url").getAsString();
            final var socketId = dados.has("socketId") ? dados.get("socketId").getAsString() : null;

            Thread.sleep(1000);

            final var resultadoSeo = new JsonObject();
            resultadoSeo.addProperty("nota", 98);
            resultadoSeo.addProperty("velocidade", "Rápido");
            resultadoSeo.addProperty("urlAnalisada", url);

            final var chaveCache = "site-cache:" + url;

            resultadoSeo.addProperty("cached_at", System.currentTimeMillis());

            final var jsonCache = gson.toJson(resultadoSeo);

            System.out.println("Salvando no Cache: " + chaveCache);
            redisTemplate.opsForValue().set(chaveCache, jsonCache, Duration.ofMinutes(10));

            final var respostaFinal = new JsonObject();
            respostaFinal.addProperty("socketId", socketId);
            respostaFinal.add("data", resultadoSeo);

            final var jsonResposta = gson.toJson(respostaFinal);

            System.out.println("Enviando resultado para Redis: " + jsonResposta);
            redisTemplate.convertAndSend("analysis_results", jsonResposta);

        } catch (Exception e) {
            System.err.println("Erro ao processar: " + e.getMessage());
            e.printStackTrace();
        }
    }
}