# DevTools Hub

Sistema de gerenciamento de ferramentas e utilitários operando em arquitetura de microsserviços (Monorepo).

## 🚀 Estrutura do Projeto

O projeto segue o padrão de Monorepo, dividindo as responsabilidades:

- **apps/api-gateway**: Backend For Frontend (BFF) em **NestJS**. Responsável por receber requisições HTTP (REST),
  validação e comunicação com filas.
- **apps/core-worker**: Worker em **Java 21 (Spring Boot)**. Responsável pelo processamento pesado e assíncrono via
  mensageria (RabbitMQ).
- **infrastructure**: Arquivos de configuração de infraestrutura (Docker, Postgres, Redis, RabbitMQ).

---

## 🛠️ Pré-requisitos

Certifique-se de ter instalado em sua máquina:

- **Java 21+** (Recomendado: Temurin ou OpenJDK)
- **Maven**
- **Node.js** (v18 ou superior)
- **Docker**
- **NestJS CLI**

---

## ⚙️ Configuração Inicial (Setup)

### 1. Variáveis de Ambiente

O projeto utiliza um arquivo `.env` centralizado na raiz para compartilhar configurações entre os serviços e o Docker.

1. Copie o arquivo de exemplo:
   ```bash
   cp .env.example .env

(Opcional) Ajuste as senhas no arquivo .env se desejar alterar os padrões.

2. Subir a Infraestrutura
   Na raiz do projeto (devtools-hub), inicie os containers:
    ```bash
    docker compose up -d
    ```

Serviços disponíveis:

RabbitMQ UI: http://localhost:15672 (Login definido no .env)

Portainer: http://localhost:9000

Postgres & Redis: Acessíveis via portas padrão (5432, 6379).

### 🏃 Como Rodar os Serviços

- API Gateway (NestJS)
    Este serviço é a porta de entrada da aplicação (HTTP).
    ```bash
    cd apps/api-gateway
    npm install        # Instala dependências (apenas na primeira vez)
    npm run start:dev  # Inicia em modo de desenvolvimento (hot-reload)
    ```
  
    O servidor iniciará em: http://localhost:3000


- Core Worker (Java Spring Boot)\

    Este serviço consome mensagens do RabbitMQ. Recomenda-se rodar via IDE (IntelliJ).

    Via IntelliJ IDEA (Recomendado): Este projeto depende de variáveis definidas no arquivo .env da raiz.
    
    Instale o plugin EnvFile (autor: Boris Olkhov).
    
    Na configuração de Run do CoreWorkerApplication:
    
    Ative a aba EnvFile.
    
    Adicione o arquivo .env que está na raiz do projeto.

    Execute o projeto (Play).

Via Terminal:

```bash
cd apps/core-worker
mvn spring-boot:run
```

### 🧪 Testando a Integração

Para validar se o NestJS está conseguindo enviar mensagens para o Java:

- Garanta que ambos os serviços e o Docker estejam rodando.

- Acesse no navegador: http://localhost:3000/ping-rabbit

- Verifique o console/log do Java (Core Worker).

- Esperado: Deve aparecer uma mensagem logada: 📬 NOVA MENSAGEM RECEBIDA NO JAVA!.

### 📦 Build e Deploy

Para gerar os artefatos de produção:

Java:

```bash
cd apps/core-worker
mvn clean install
```

NestJS:

```bash
cd apps/api-gateway
npm run build
```