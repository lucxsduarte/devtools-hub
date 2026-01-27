package com.devtools.coreworker.consumer;

import com.devtools.coreworker.config.RabbitMQConfig;
import com.devtools.coreworker.exception.BusinessException;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.jsoup.HttpStatusException;
import org.jsoup.Jsoup;
import org.jsoup.UnsupportedMimeTypeException;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.SocketTimeoutException;
import java.net.UnknownHostException;
import java.time.Duration;
import java.util.Objects;

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
        System.out.println(">>> PROCESSANDO TAREFA...");
        String socketId = null;

        try {
            final var jsonOriginal = JsonParser.parseString(mensagem).getAsJsonObject();
            final var dados = jsonOriginal.has("data") ? jsonOriginal.getAsJsonObject("data") : jsonOriginal;

            final var url = dados.get("url").getAsString();
            socketId = dados.has("socketId") ? dados.get("socketId").getAsString() : null;

            if (url == null || url.trim().isEmpty() || !url.startsWith("http")) {
                throw new BusinessException("URL inválida ou vazia. Certifique-se de incluir http:// ou https://");
            }

            processarAnalise(url, socketId);

        } catch (BusinessException e) {
            System.err.println("Erro de Negócio: " + e.getMessage());
            enviarErroParaUsuario(socketId, e.getMessage());

        } catch (IllegalArgumentException e) {
            enviarErroParaUsuario(socketId, "Formato de URL inválido.");

        } catch (UnsupportedMimeTypeException e) {
            enviarErroParaUsuario(socketId, "O link fornecido não é uma página HTML (content-type incompatível).");

        } catch (HttpStatusException e) {
            enviarErroParaUsuario(socketId, "O site retornou erro: " + e.getStatusCode());

        } catch (SocketTimeoutException e) {
            enviarErroParaUsuario(socketId, "O site demorou muito para responder (Timeout).");

        } catch (UnknownHostException e) {
            enviarErroParaUsuario(socketId, "Site não encontrado (Erro de DNS). Verifique a URL.");

        } catch (Exception e) {
            System.err.println("Erro crítico não tratado: " + e.getMessage());
            enviarErroParaUsuario(socketId, "Erro interno ao processar a análise.");
        }
    }

    private void processarAnalise(String url, String socketId) throws IOException {
        final var inicio = System.currentTimeMillis();
        final var limiteDownload = 5 * 1024 * 1024; // 5MB

        final var doc = Jsoup.connect(url)
                .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) DevToolsHubWorker/1.0")
                .timeout(10000)
                .maxBodySize(limiteDownload)
                .get();

        final var fim = System.currentTimeMillis();
        final var tempoLoad = fim - inicio;

        var descricao = "";
        final var titulo = doc.title();
        final var metaDesc = doc.selectFirst("meta[name=description]");
        if (Objects.nonNull(metaDesc)) {
            descricao = metaDesc.attr("content");
        }

        final var tamanhoKb = doc.html().length() / 1024.0;

        var nota = 100;
        if (titulo.isEmpty()) nota -= 20;
        if (descricao.isEmpty()) nota -= 20;
        if (tamanhoKb > 2000) nota -= 10;
        if (tempoLoad > 2000) nota -= 15;
        if (nota < 0) nota = 0;

        final var resultadoSeo = new JsonObject();
        resultadoSeo.addProperty("urlAnalisada", url);
        resultadoSeo.addProperty("titulo", titulo);
        resultadoSeo.addProperty("descricao", descricao.isEmpty() ? "Sem descrição" : descricao);
        resultadoSeo.addProperty("tamanho_kb", String.format("%.2f KB", tamanhoKb));
        resultadoSeo.addProperty("tempo_ms", tempoLoad + "ms");

        final var velocidade = tempoLoad < 800 ? "Muito Rápido" : (tempoLoad < 2000 ? "Normal" : "Lento");
        resultadoSeo.addProperty("velocidade", velocidade);
        resultadoSeo.addProperty("nota", nota);
        resultadoSeo.addProperty("cached_at", System.currentTimeMillis());

        final var chaveCache = "site-cache:" + url;
        final var jsonCache = gson.toJson(resultadoSeo);

        System.out.println("Sucesso! Salvando cache: " + titulo);
        redisTemplate.opsForValue().set(chaveCache, jsonCache, Duration.ofMinutes(10));

        final var respostaFinal = new JsonObject();
        respostaFinal.addProperty("socketId", socketId);
        respostaFinal.add("data", resultadoSeo);
        respostaFinal.addProperty("status", "success");

        redisTemplate.convertAndSend("analysis_results", gson.toJson(respostaFinal));
    }

    private void enviarErroParaUsuario(String socketId, String mensagemErro) {
        if (socketId == null) return;

        System.out.println("Notificando erro ao usuário: " + mensagemErro);

        final var erroJson = new JsonObject();
        erroJson.addProperty("error", mensagemErro);
        erroJson.addProperty("status", "error");

        final var respostaFinal = new JsonObject();
        respostaFinal.addProperty("socketId", socketId);
        respostaFinal.add("data", erroJson);

        redisTemplate.convertAndSend("analysis_results", gson.toJson(respostaFinal));
    }
}