# Corrida Treino

Plataforma de treinamento para corredores que gera planos personalizados com periodização científica.

## Problema Real

Corredores amadores enfrentam dificuldade em estruturar treinos de forma eficaz, resultando em lesões, plateau de performance e falta de progresso. Muitos não sabem como organizar sua semana de treino.

## Proposta da Solução

Corrida Treino oferece uma plataforma que coleta o perfil do corredor (objetivo, nível, disponibilidade) e gera automaticamente planos de treino periodizados em 4 fases (Base, Desenvolvimento, Pico, Taper), com registro de execução e acompanhamento visual do progresso.

## Público-Alvo

Corredores amadores e iniciantes que desejam treinar de forma estruturada, bem como estudantes e profissionais que buscam otimizar tempo de treino com suporte científico.

## Funcionalidades Principais

- Cadastro e autenticação de usuários com JWT
- Criação de perfil do corredor (objetivo, nível, dias disponíveis)
- Geração automática de planos de treino periodizados
- Suporte a objetivos de 5K, 10K e Meia Maratona
- Registro de execução das sessões
- Dashboard com acompanhamento de progresso
- Interface responsiva e intuitiva

## Tecnologias Utilizadas

**Backend:**
- Java 21
- Spring Boot 3.4.3
- Spring Security + JWT
- Spring Data JPA + Hibernate
- PostgreSQL
- Maven

**Frontend:**
- React 19.2.4
- React Router DOM 7.13.1
- Axios 1.13.6
- Chart.js 4.5.1

## Instruções de Instalação

### Pré-requisitos

- Java 21
- Node.js 18+
- PostgreSQL 15+
- Git

### Backend

1. Clone o repositório:
```bash
git clone https://github.com/Bruno-Kowalski/corrida-treino.git
cd corrida-treino
```

2. Crie o banco de dados PostgreSQL:
```sql
CREATE DATABASE corrida_treino;
```

3. Configure as credenciais em `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/corrida_treino
spring.datasource.username=postgres
spring.datasource.password=sua_senha
```

4. Instale as dependências:
```bash
mvn clean install
```

### Frontend

1. Instale as dependências:
```bash
cd corrida-treino-frontend
npm install
```

2. Configure a URL da API em `.env`:
```env
REACT_APP_API_URL=http://localhost:8080/api
```

## Instruções de Execução

### Executar Backend

```bash
mvn spring-boot:run
```

O backend estará disponível em: `http://localhost:8080/api`

### Executar Frontend

```bash
cd corrida-treino-frontend
npm start
```

O frontend estará disponível em: `http://localhost:3000`

## Instruções para Rodar os Testes

### Testes Backend

```bash
mvn test
```

Testes cobrem: autenticação JWT, validação de dados, criação de perfil, geração de plano e registro de execução.

### Testes Frontend

```bash
cd corrida-treino-frontend
npm test
```

Testes cobrem: renderização de componentes, autenticação, integração com API e validação de formulários.

## Instruções para Rodar o Lint

### Análise Estática Backend (Java)

```bash
# Checkstyle
mvn checkstyle:check

# SpotBugs
mvn spotbugs:check
```

### Análise Estática Frontend (JavaScript)

```bash
cd corrida-treino-frontend

# ESLint
npm run lint

# Aplicar correções automáticas
npm run lint -- --fix
```

## Versão Atual

**1.0.0**

## Autor

Bruno Silva

## Repositório Público

https://github.com/Bruno-Kowalski/corrida-treino

### 🔐 Autenticação & Segurança
- ✅ Cadastro e login de usuários com autenticação JWT
- ✅ Senhas criptografadas com Spring Security
- ✅ Refresh tokens com expiração configurável
- ✅ Proteção de rotas na API e frontend

### 🎯 Perfil do Corredor
- ✅ Definir objetivo (5K, 10K, Meia Maratona)
- ✅ Nível de experiência (Iniciante, Intermediário, Avançado)
- ✅ Dias disponíveis para treino
- ✅ Histórico e estatísticas de treinamento

### 📅 Planos de Treino
- ✅ Geração automática de planos periodizados
- ✅ Estrutura em semanas com 4 fases:
  - **Base**: Construção aeróbica
  - **Desenvolvimento**: Intensidade e volume
  - **Pico**: Auge da performance
  - **Taper**: Recuperação/descanso
- ✅ Variações de sessões (Fácil, Moderado, Longo, Interval)

### 📊 Acompanhamento
- ✅ Registro de execução das sessões
- ✅ Gráficos e relatórios de progresso
- ✅ Dashboard com métricas

---

## 🛠️ Tecnologias

### Backend
| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| **Java** | 21 | Linguagem principal |
| **Spring Boot** | 3.4.3 | Framework web |
| **Spring Security** | - | Autenticação e autorização |
| **Spring Data JPA** | - | Persistência de dados |
| **PostgreSQL** | 15+ | Banco de dados |
| **JWT (jjwt)** | - | Tokens seguros |
| **Maven** | - | Gerenciamento de dependências |
| **JUnit 5** | - | Testes |

### Frontend
| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| **React** | 19.2.4 | Biblioteca UI |
| **React Router DOM** | 7.13.1 | Roteamento |
| **Axios** | 1.13.6 | Cliente HTTP |
| **Chart.js** | 4.5.1 | Gráficos e dashboards |
| **React ChartJS 2** | 5.3.1 | Wrapper React Charts |

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Java 21** ou superior
- **Node.js 18+** e **npm** ou **yarn**
- **PostgreSQL 15+**
- **Git**
- **Maven 3.8+** (opcional, usa o mvnw incluído)

---

## 🚀 Instalação & Configuração

### 1️⃣ Clone o Repositório

```bash
git clone https://github.com/seu_usuario/corrida-treino.git
cd corrida-treino
```

### 2️⃣ Configurar o Backend

#### 2.1 - Criar o banco de dados PostgreSQL

```bash
psql -U postgres
```

```sql
CREATE DATABASE corrida_treino;
```

#### 2.2 - Configurar variáveis de ambiente

Crie ou edite o arquivo `src/main/resources/application.properties`:

```properties
# Banco de dados
spring.datasource.url=jdbc:postgresql://localhost:5432/corrida_treino
spring.datasource.username=postgres
spring.datasource.password=sua_senha_aqui
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect

# Servidor
server.port=8080
server.servlet.context-path=/api

# JWT
jwt.secret=sua_chave_secreta_aqui_min_32_caracteres
jwt.expiration=86400000

# CORS
spring.web.cors.allowed-origins=http://localhost:3000,http://localhost:5173
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=true
```

#### 2.3 - Executar o Backend

```bash
# Com Maven Wrapper (Windows)
mvnw spring-boot:run

# Ou com Maven instalado
mvn spring-boot:run
```

O backend estará disponível em: **http://localhost:8080/api**

### 3️⃣ Configurar o Frontend

#### 3.1 - Instalar dependências

```bash
cd corrida-treino-frontend
npm install
# ou
yarn install
```

#### 3.2 - Configurar URL da API

Crie o arquivo `.env` na raiz de `corrida-treino-frontend`:

```env
REACT_APP_API_URL=http://localhost:8080/api
```

#### 3.3 - Executar o Frontend

```bash
npm start
# ou
yarn start
```

O frontend estará disponível em: **http://localhost:3000**

---

## 📁 Estrutura do Projeto

```
corrida-treino/
├── src/                                    # Backend Spring Boot
│   ├── main/
│   │   ├── java/com/corridaapp/corridatreino/
│   │   │   ├── controller/                # Controladores REST
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── PerfilCorredorController.java
│   │   │   │   ├── PlanoTreinoController.java
│   │   │   │   └── RegistroTreinoController.java
│   │   │   ├── service/                   # Lógica de negócio
│   │   │   ├── repository/                # Acesso a dados (JPA)
│   │   │   ├── entity/                    # Modelos/Entidades
│   │   │   ├── dto/                       # Data Transfer Objects
│   │   │   ├── enums/                     # Enumerações
│   │   │   ├── config/                    # Configurações
│   │   │   │   ├── SecurityConfig.java
│   │   │   │   ├── CorsConfig.java
│   │   │   │   ├── JwtFilter.java
│   │   │   │   └── JwtUtil.java
│   │   │   └── CorridaTreinoApplication.java
│   │   └── resources/
│   │       └── application.properties     # Configuração da app
│   └── test/                              # Testes unitários
├── corrida-treino-frontend/               # Frontend React
│   ├── src/
│   │   ├── components/                    # Componentes React
│   │   │   └── Navbar.jsx
│   │   ├── pages/                         # Páginas
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Perfil.jsx
│   │   ├── services/                      # Chamadas API
│   │   │   ├── Api.js
│   │   │   └── Services.js
│   │   ├── context/                       # Context API
│   │   │   └── AuthContext.js
│   │   ├── styles/                        # Estilos CSS
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── public/
├── postman/                               # Coleção Postman
│   └── globals/
│       └── workspace.globals.yaml
├── pom.xml                                # Dependências Maven
└── README.md                              # Você está aqui!
```

---

## 🔌 Endpoints da API

### Autenticação
```
POST   /api/auth/register          Registrar novo usuário
POST   /api/auth/login             Fazer login
POST   /api/auth/refresh           Renovar token JWT
```

### Perfil do Corredor
```
GET    /api/perfil                 Obter perfil do usuário
PUT    /api/perfil                 Atualizar perfil
POST   /api/perfil                 Criar novo perfil
```

### Plano de Treino
```
GET    /api/plano-treino           Listar planos
GET    /api/plano-treino/{id}      Obter plano específico
POST   /api/plano-treino           Gerar novo plano
```

### Registro de Treino (Execução)
```
GET    /api/registro-treino        Listar execuções
POST   /api/registro-treino        Registrar execução
PUT    /api/registro-treino/{id}   Atualizar execução
```

**Documentação completa**: Veja a coleção Postman em `postman/`

---

## 🔐 Autenticação

A API utiliza **JWT (JSON Web Tokens)** para autenticação:

1. Cliente faz login → recebe `accessToken` e `refreshToken`
2. Token é enviado no header: `Authorization: Bearer {token}`
3. Token expira em 24 horas (configurável)
4. Use o `refreshToken` para obter novo `accessToken`

---

## 📊 Modelos Principais

### Usuario
```json
{
  "id": 1,
  "email": "usuario@example.com",
  "nome": "João Silva",
  "senha": "hash_bcrypt"
}
```

### PerfilCorredor
```json
{
  "id": 1,
  "usuario_id": 1,
  "objetivo": "MEIA_MARATONA",
  "nivelExperiencia": "INTERMEDIARIO",
  "diasDisponiveis": 4,
  "dataAtualizacao": "2026-03-29"
}
```

### PlanoTreino
```json
{
  "id": 1,
  "corredor_id": 1,
  "dataInicio": "2026-04-01",
  "dataFim": "2026-06-30",
  "faseAtual": "BASE",
  "semanas": [...]
}
```

---

## 🧪 Testes Automatizados

### Executar Testes do Backend

```bash
# Executar todos os testes
mvn test

# Executar testes com relatório de cobertura
mvn clean test jacoco:report

# Executar teste específico
mvn test -Dtest=CorridaTreinoApplicationTests
```

**Testes cobrem:**
- ✅ Autenticação e JWT
- ✅ Validação de dados de entrada
- ✅ Criação de perfil de corredor
- ✅ Geração de plano de treino
- ✅ Registro de execução de sessão

### Executar Testes do Frontend

```bash
# Executar testes em modo watch
cd corrida-treino-frontend
npm test

# Executar testes uma única vez
npm test -- --watchAll=false

# Executar com cobertura
npm test -- --coverage --watchAll=false
```

**Testes cobrem:**
- ✅ Renderização de componentes
- ✅ Autenticação e contexto
- ✅ Integração com API
- ✅ Validação de formulários
- ✅ Navegação entre rotas

---

## � Análise Estática de Código

### Backend (Java - Checkstyle)

```bash
# Executar análise Checkstyle
mvn checkstyle:check

# Gerar relatório HTML
mvn checkstyle:checkstyle

# Executar SpotBugs para bugs potenciais
mvn spotbugs:check
```

**Configuração em:** `pom.xml` (plugins: maven-checkstyle-plugin, spotbugs-maven-plugin)

### Frontend (JavaScript/React - ESLint)

```bash
cd corrida-treino-frontend

# Executar ESLint
npm run lint

# Corrigir automaticamente problemas
npm run lint -- --fix

# Verificar formatação com Prettier
npm run format
```

**Configuração em:** `.eslintrc.json` e `.prettierrc`

---

## 🔄 GitHub Actions - CI/CD

O projeto utiliza **GitHub Actions** para automatizar testes e análises em cada push e pull request.

### Pipeline Configurada

✅ **Instalação de dependências**  
✅ **Build do projeto (Backend + Frontend)**  
✅ **Análise estática (Lint + Checkstyle)**  
✅ **Execução de testes**  
✅ **Relatório de cobertura (opcional)**

**Arquivo de configuração:** `.github/workflows/ci.yml`

### Visualizar Status
Acesse a aba "Actions" no repositório GitHub para ver:
- Status das execuções
- Logs detalhados de erros
- Histórico de todas as pipelines

---

## 📦 Versionamento Semântico

**Versão Atual:** `1.0.0`

Segue o padrão **MAJOR.MINOR.PATCH**:
- **1:** MAJOR (mudanças incompatíveis na API)
- **0:** MINOR (novas funcionalidades compatíveis)
- **0:** PATCH (correções de bugs)

**Histórico:** Veja [CHANGELOG.md](CHANGELOG.md) para detalhes de todas as versões.

---

## 📋 Declaração de Dependências

### Backend - Maven (pom.xml)
```xml
<spring-boot-starter-web>3.4.3</spring-boot-starter-web>
<spring-boot-starter-security>3.4.3</spring-boot-starter-security>
<spring-boot-starter-data-jpa>3.4.3</spring-boot-starter-data-jpa>
<postgresql>42.7.1</postgresql>
<jjwt>0.12.3</jjwt>
```

**Instalar/atualizar:**
```bash
mvn dependency:resolve
mvn dependency:update-sources
```

### Frontend - npm (package.json)
```json
{
  "react": "^19.2.4",
  "react-dom": "^19.2.4",
  "react-router-dom": "^7.13.1",
  "axios": "^1.13.6",
  "chart.js": "^4.5.1"
}
```

**Instalar/atualizar:**
```bash
cd corrida-treino-frontend
npm install
npm update
```

---

## 📝 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto ou exporte as variáveis:

```bash
# Backend
export DB_URL=jdbc:postgresql://localhost:5432/corrida_treino
export DB_USER=postgres
export DB_PASSWORD=sua_senha
export JWT_SECRET=sua_chave_secreta_aqui_min_32_caracteres
export JWT_EXPIRATION=86400000

# Frontend
export REACT_APP_API_URL=http://localhost:8080/api
```

---

## 📈 Build & Deploy

### Build do Backend

```bash
mvn clean package
```

Gera JAR: `target/corrida-treino-0.0.1-SNAPSHOT.jar`

### Build do Frontend

```bash
cd corrida-treino-frontend
npm run build
```

Gera arquivos otimizados em: `build/`

---

## 🐛 Troubleshooting

### Erro: "Connection refused" ao conectar BD
```bash
# Verifique se PostgreSQL está rodando
psql -U postgres
```

### Erro: "Port 8080 already in use"
```bash
# Mude a porta em application.properties
server.port=8081
```

### Erro: CORS na chamada da API
- Verifique `spring.web.cors.allowed-origins` em `application.properties`
- Certifique-se que frontend e backend estão nas URLs listadas

### Erro: Token inválido ou expirado
- Gere novo token fazendo login novamente
- Verifique se `jwt.secret` é igual em todas instâncias

---

## 🤝 Contribuindo

1. Faça um fork do repositório
2. Crie um branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para o branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Código
- Java: Siga convenções Spring Boot
- React: Use functional components e hooks
- Commits: Use mensagens descritivas

---


## 📄 Licença

Este projeto está licenciado sob a **Licença MIT** - veja [LICENSE](LICENSE) para detalhes.

---

## 👤 Autor & Informações do Projeto

**Autor:** Bruno Santos
**Disciplina:** Bootcamp ll
**Versão:** 1.0.0  
**Data de Criação:** 2026-03-22

---

## 🔗 Links & Documentação

- **Repositório GitHub:** [https://github.com/seu_usuario/corrida-treino](https://github.com/seu_usuario/corrida-treino)
- **Issues & Bugs:** [Reportar problema](https://github.com/seu_usuario/corrida-treino/issues)
- **Contribuir:** [CONTRIBUTING.md](CONTRIBUTING.md)
- **Histórico:** [CHANGELOG.md](CHANGELOG.md)
- **Releases:** [Versões](https://github.com/seu_usuario/corrida-treino/releases)

---


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