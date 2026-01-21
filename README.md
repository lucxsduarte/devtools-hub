# 🛠️ DevTools Hub

![Java](https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=openjdk)
![NestJS](https://img.shields.io/badge/NestJS-10-red?style=for-the-badge&logo=nestjs)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-Messaging-orange?style=for-the-badge&logo=rabbitmq)
![Redis](https://img.shields.io/badge/Redis-Caching-red?style=for-the-badge&logo=redis)
![Docker](https://img.shields.io/badge/Docker-Container-blue?style=for-the-badge&logo=docker)

Sistema distribuído para gerenciamento de ferramentas e utilitários de desenvolvimento, operando em arquitetura de microsserviços orientada a eventos.

## 📐 Arquitetura da Solução

O sistema utiliza um padrão híbrido de comunicação (HTTP + WebSocket) com processamento assíncrono.

```mermaid
graph TD
    User((Usuário))
    
    subgraph "Frontend"
        Angular[Portal Web (Angular)]
    end

    subgraph "Backend Infrastructure"
        Gateway[API Gateway (NestJS)]
        Worker[Core Worker (Java 21)]
        Redis[(Redis Cache)]
        RabbitMQ[RabbitMQ Bus]
        DB[(PostgreSQL)]
    end

    User -->|HTTP POST| Gateway
    User -->|WebSocket| Gateway
    
    Gateway -- 1. Verifica Cache --> Redis
    Gateway -- 2. Se não houver cache --> RabbitMQ
    
    RabbitMQ --> Worker
    Worker -->|Processamento Pesado| Worker
    Worker -- 3. Salva Resultado --> Redis
    Worker -- 4. Notifica Conclusão --> Redis
    
    Redis -- 5. Pub/Sub Event --> Gateway
    Gateway -- 6. Push Notification --> Angular
```

## 🚀 Estrutura do Monorepo
- **apps/hub-server:** Backend For Frontend (BFF) em NestJS.

    - Gerencia conexões WebSocket (Socket.io).

    - Implementa Rate Limiting para segurança.

    - Verifica Cache antes de processar.
  

- **apps/hub-worker:** Worker robusto em Java 21 (Spring Boot).

    - Processamento de tarefas pesadas (Crawling, Cálculos).

    - Consumo resiliente de filas RabbitMQ.

    - infrastructure: Stack completa via Docker Compose.
  
## ✨ Funcionalidades Chave
- **Real-time Feedback**: O usuário recebe o resultado via WebSocket assim que o processamento termina.


- **Smart Caching**: Requisições repetidas são respondidas em milissegundos sem acionar o Worker Java (Redis).


- **Security First**: Implementação de Rate Limiting (Throttler), Validação de DTOs e Headers de Segurança (Helmet).


- **Resiliência**: Arquitetura desacoplada; se o Java cair, o NestJS continua aceitando requisições (enfileirando-as).

## 🛠️ Pré-requisitos
- Java 21+ (Temurin/OpenJDK)

- Node.js v18+

- Docker

- Maven