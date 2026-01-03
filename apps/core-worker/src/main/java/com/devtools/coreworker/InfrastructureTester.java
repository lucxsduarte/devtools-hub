package com.devtools.coreworker;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;

@Component
public class InfrastructureTester implements CommandLineRunner {

    private final DataSource dataSource;
    private final RabbitTemplate rabbitTemplate;
    private final StringRedisTemplate redisTemplate;

    public InfrastructureTester(DataSource dataSource,
                                RabbitTemplate rabbitTemplate,
                                StringRedisTemplate redisTemplate) {
        this.dataSource = dataSource;
        this.rabbitTemplate = rabbitTemplate;
        this.redisTemplate = redisTemplate;
    }

    @Override
    public void run(String... args) {
        System.out.println("==========================================================");
        System.out.println("🚦 INICIANDO TESTE DE CONEXÃO COM A INFRAESTRUTURA...");
        System.out.println("==========================================================");

        testarPostgres();
        testarRabbitMQ();
        testarRedis();

        System.out.println("==========================================================");
        System.out.println("🏁 FIM DOS TESTES DE INFRAESTRUTURA");
        System.out.println("==========================================================");
    }

    private void testarPostgres() {
        try (Connection conn = dataSource.getConnection()) {
            if (conn.isValid(2)) { // Tenta validar a conexão com timeout de 2 segundos
                System.out.println("POSTGRES: Conectado com sucesso! (Schema: " + conn.getSchema() + ")");
            }
        } catch (Exception e) {
            System.err.println("POSTGRES: Falha crítica - " + e.getMessage());
        }
    }

    private void testarRabbitMQ() {
        try {
            // Tenta mandar uma mensagem para uma troca padrão. Se conectar, não dá erro.
            rabbitTemplate.convertAndSend("amq.direct", "ping", "teste-de-conexao");
            System.out.println("RABBITMQ: Conexão estabelecida e mensagem enviada!");
        } catch (Exception e) {
            System.err.println("RABBITMQ: Falha crítica - " + e.getMessage());
        }
    }

    private void testarRedis() {
        try {
            // Tenta escrever e ler logo em seguida
            redisTemplate.opsForValue().set("teste-infra", "funcionou");
            String valor = redisTemplate.opsForValue().get("teste-infra");

            if ("funcionou".equals(valor)) {
                System.out.println("REDIS: Leitura e Escrita confirmadas!");
            } else {
                System.err.println("REDIS: Conectou mas retornou valor errado: " + valor);
            }
        } catch (Exception e) {
            System.err.println("REDIS: Falha crítica - " + e.getMessage());
        }
    }
}