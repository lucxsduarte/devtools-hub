# DevTools Hub

Sistema de gerenciamento de ferramentas e utilitários (Monorepo).

## 🚀 Estrutura do Projeto

- **apps/core-worker**: Backend em Java (Spring Boot) responsável pelo processamento assíncrono.
- **apps/api-gateway**: (Em breve) API Gateway.
- **infrastructure**: Configurações de Docker e Banco de Dados.

## 🛠️ Pré-requisitos

- Java 21+
- Maven
- Docker & Docker Compose

## ⚙️ Como Rodar Localmente

### 1. Infraestrutura (Docker)
Na raiz do projeto, suba os containers (Postgres, Redis, RabbitMQ):
```bash
docker compose up -d
```

### 2. Configuração de Variáveis de Ambiente
O projeto utiliza variáveis de ambiente para segurança.
Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Ajuste as senhas no arquivo .env se necessário.

### 3. Executando o Backend (Core Worker)
Via temrinal:

```bash
cd apps/core-worker
# O Spring Boot vai ler as variáveis do sistema ou falhar se não estiverem exportadas.
# Recomendado usar a IDE para desenvolvimento.
mvn spring-boot:run
```

Via IntelliJ IDEA (Recomendado): Este projeto depende de variáveis definidas no arquivo .env da raiz.

- Instale o plugin EnvFile (autor: Boris Olkhov).

- Na configuração de Run do CoreWorkerApplication:

- Ative a aba EnvFile.

- Adicione o arquivo .env que está na raiz do projeto.

📦 Build

Para compilar o projeto Java:

```bash
cd apps/core-worker
mvn clean install
```