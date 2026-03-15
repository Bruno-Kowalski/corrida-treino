# Corrida Treino API

API REST para geração de planilhas de treino personalizadas para corredores de rua.
Desenvolvida com Spring Boot 3, Java 21 e PostgreSQL.

## Funcionalidades

- Cadastro e autenticação de usuários com JWT
- Perfil do corredor com objetivo, nível e dias disponíveis
- Geração automática de planilha periodizada (Base, Desenvolvimento, Pico, Taper)
- Suporte a objetivos de 5K, 10K e Meia Maratona
- Registro de execução das sessões e acompanhamento de progresso

## Tecnologias

- Java 21
- Spring Boot 3.4
- Spring Security + JWT
- Spring Data JPA + Hibernate
- PostgreSQL
- Maven
- JUnit 5
- GitHub Actions (CI)

## Como executar localmente

### Pré-requisitos
- Java 21
- PostgreSQL
- Maven

### Passos

1. Clone o repositório
```bash
   git clone https://github.com/SEU_USUARIO/corrida-treino.git
   cd corrida-treino
```

2. Crie o banco de dados
```sql
   CREATE DATABASE corrida_treino;
```

3. Configure as credenciais em `src/main/resources/application.properties`
```properties
   spring.datasource.username=postgres
   spring.datasource.password=SUA_SENHA
```

4. Execute o projeto
```bash
   mvn spring-boot:run
```

5. Acesse a API em `http://localhost:8080`

## Estrutura do projeto
```
src/
├── main/java/com/corridaapp/corridatreino/
│   ├── config/        # Configurações de segurança e JWT
│   ├── controller/    # Endpoints REST
│   ├── dto/           # Objetos de entrada e saída
│   ├── entity/        # Entidades JPA
│   ├── enums/         # Enumerações do domínio
│   ├── repository/    # Repositórios JPA
│   └── service/       # Regras de negócio
└── test/              # Testes automatizados
```

## Versionamento

Este projeto segue [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## Licença

MIT