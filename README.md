# 🏃 PaceX

> Plataforma inteligente de treinamento para corredores que oferece planos de treino personalizados baseados em periodização científica, eliminando a paralisia de decisão e estruturando treinos com segurança.

[![Versão](https://img.shields.io/badge/Vers%C3%A3o-1.0.0-blue)](https://github.com/seu_usuario/pacex/releases/tag/1.0.0)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.3-green)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21%20LTS-blue)](https://www.oracle.com/java/technologies/downloads/#java21)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?logo=react)](https://react.dev)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)
[![Node](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js)](https://nodejs.org)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)](https://github.com/seu_usuario/pacex/actions)

---

## 📋 Sumário Executivo

**PaceX** é uma aplicação **fullstack moderna** que resolve um problema real e relevante: **como treinar de forma estruturada e segura sem risco de lesão ou desmotivação?**

Combinando **backend robusto em Spring Boot** com **interface intuitiva em React**, a plataforma oferece aos corredores amadores e iniciantes um sistema científico de periodização de treinos, acompanhamento de progresso e segurança técnica de ponta.

---

## 🎯 O Problema Real

### 📌 Contexto do Problema

Corredores amadores e iniciantes frequentemente enfrentam desafios críticos ao estruturar seus treinos:

| Problema | Impacto |
|----------|--------|
| **Falta de estrutura** | Treinos aleatórios sem progressão científica |
| **Risco de lesão** | Overtraining ou treinamento inapropriado |
| **Plateau de desempenho** | Estagnação e desmotivação |
| **Paralisia de decisão** | "Como devo treinar essa semana?" |
| **Falta de acompanhamento** | Impossível medir e visualizar progresso |

### 👥 Público-Alvo

- 🏃 **Corredores amadores e iniciantes** (nível básico a intermediário)
- 📈 **Pessoas buscando melhorar** em distâncias como 5K, 10K ou Meia Maratona
- ⏱️ **Profissionais ocupados** que precisam otimizar tempo de treino
- 📊 **Corredores que valorizam dados** e acompanhamento estruturado
- 🎯 **Qualquer pessoa** que queira treinar de forma inteligente e segura

### 💡 Pergunta Central Que Soluciona

> **"Como posso treinar de forma inteligente, estruturada e segura, mesmo com pouco tempo disponível, sem risco de lesão e com garantia de progresso mensurável?"**

---

## ✨ Proposta da Solução

**PaceX** oferece uma plataforma integrada que estrutura completamente a jornada de treinamento:

### Funcionalidades Principais

| Feature | Benefício |
|---------|-----------|
| 🔐 **Autenticação Segura** | Proteção com JWT, dados pessoais protegidos |
| 👤 **Perfil Personalizado** | Define objetivo, nível de experiência e disponibilidade |
| 📋 **Planos Autom. Periodizados** | Estrutura científica com 4 fases: Base → Desenvolvimento → Pico → Taper |
| 📱 **Registro de Sessões** | Documenta cada treino realizado |
| 📊 **Dashboard com Gráficos** | Visualiza progresso em tempo real |
| 📱 **Interface Responsiva** | Acessa em qualquer dispositivo (desktop, tablet, mobile) |
| 🔄 **Sincronização Automática** | Backend e frontend sempre em sincronia |

### Fluxo de Uso Principal

```
Novo Usuário
    ↓
Cadastro & Autenticação JWT
    ↓
Preenchimento do Perfil (objetivo, nível, dias/semana)
    ↓
Geração Automática de Plano de 12-16 semanas
    ↓
Visualização de Treino da Semana
    ↓
Registro de Execução (completou? intensidade?)
    ↓
Dashboard com Gráficos de Progresso
```

---

## 🛠️ Tecnologias Utilizadas

### Backend

| Tecnologia | Versão | Propósito |
|-----------|--------|----------|
| **Java** | 21 LTS | Linguagem principal |
| **Spring Boot** | 3.4.3 | Framework web e REST API |
| **Spring Security** | 3.4.3 | Autenticação e autorização |
| **Spring Data JPA** | 3.4.3 | Persistência de dados |
| **H2 Database** | Latest | Banco de dados em memória/arquivo |
| **JWT (JJWT)** | 0.12.6 | Tokenização segura |
| **Maven** | 3.8+ | Gerenciamento de dependências e build |

### Frontend

| Tecnologia | Versão | Propósito |
|-----------|--------|----------|
| **React** | 19.2.4 | Biblioteca UI |
| **React Router** | 7.13.1 | Navegação entre páginas |
| **Axios** | 1.13.6 | Requisições HTTP para API |
| **Chart.js** | 4.5.1 | Gráficos e visualizações |
| **React Chart.js 2** | 5.3.1 | Integração Chart.js com React |
| **Node.js** | 18+ | Runtime e ferramentas de build |
| **npm** | Latest | Gerenciador de pacotes |

### Ferramentas de Qualidade & DevOps

| Ferramenta | Linguagem | Propósito |
|-----------|-----------|----------|
| **Checkstyle** | Backend (Java) | Análise estática e padronização |
| **SpotBugs** | Backend (Java) | Detecção de bugs potenciais |
| **ESLint** | Frontend (JavaScript) | Análise estática de código JS |
| **GitHub Actions** | CI/CD | Automação de pipeline |
| **JUnit 5** | Backend | Testes unitários e integração |
| **React Testing Library** | Frontend | Testes de componentes React |

---

## 📦 Estrutura do Projeto

```
pacex/
├── backend/                              # API REST em Spring Boot
│   ├── src/
│   │   ├── main/java/com/corridaapp/
│   │   │   └── corridatreino/
│   │   │       ├── CorridaTreinoApplication.java   # Classe principal
│   │   │       ├── config/                         # Configurações (Security, CORS, etc)
│   │   │       ├── controller/                     # Endpoints REST
│   │   │       ├── dto/                            # Data Transfer Objects
│   │   │       ├── entity/                         # Entidades JPA
│   │   │       ├── enums/                          # Enumerações
│   │   │       ├── repository/                     # Data Access Layer
│   │   │       └── service/                        # Lógica de negócio
│   │   ├── resources/
│   │   │   └── application.properties             # Configuração do banco
│   │   └── test/                                   # Testes unitários e integração
│   ├── pom.xml                          # Maven - Dependências e configuração
│   ├── mvnw & mvnw.cmd                  # Maven Wrapper (execução sem Maven instalado)
│   └── target/                          # Artefatos compilados
│
├── frontend/                             # Aplicação React
│   ├── src/
│   │   ├── components/                  # Componentes reutilizáveis
│   │   ├── context/                     # Context API (AuthContext)
│   │   ├── pages/                       # Páginas da aplicação
│   │   ├── services/                    # Integração com API backend
│   │   ├── styles/                      # Estilos CSS
│   │   ├── App.js & index.js            # Entrada da aplicação
│   │   └── setupTests.js                # Configuração de testes
│   ├── public/                          # Assets estáticos
│   ├── package.json                     # npm - Dependências e scripts
│   └── package-lock.json                # Lock de dependências (reproducibilidade)
│
├── docs/                                 # Documentação
│   ├── architecture.md                  # Decisões arquiteturais
│   └── requirements.md                  # Requisitos funciona/não-funcionais
│
├── postman/                             # Coleção Postman para testes manuais
│   └── resources.yaml
│
├── .github/workflows/                   # GitHub Actions CI/CD
│   └── ci.yml                           # Pipeline automatizado
│
├── README.md                            # Este arquivo
├── CHANGELOG.md                         # Histórico de mudanças
├── CONTRIBUTING.md                      # Guia de contribuição
├── LICENSE                              # MIT License
├── STRUCTURE.md                         # Documentação de estrutura
└── .gitignore                           # Arquivos ignorados pelo Git
```

---

## 🚀 Guia de Instalação e Execução

### Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado:

- **Java 21 LTS** — [Download](https://www.oracle.com/java/technologies/downloads/#java21)
- **Node.js 18+** — [Download](https://nodejs.org/)
- **Git** — [Download](https://git-scm.com/)
- **Maven 3.8+** (opcional, pois o projeto inclui Maven Wrapper)

**Verificar instalações:**
```bash
java -version        # Deve mostrar Java 21.x.x
node --version       # Deve mostrar v18.x.x ou superior
npm --version        # Deve mostrar versão compatível
git --version        # Deve mostrar Git versão
```

### ⚙️ Instalação do Backend

#### 1️⃣ Clonar o repositório
```bash
git clone https://github.com/seu_usuario/pacex.git
cd pacex
```

#### 2️⃣ Navegar até a pasta do backend
```bash
cd backend
```

#### 3️⃣ Instalar dependências (Maven)
```bash
# Usando Maven Wrapper (recomendado - sem necessidade de Maven instalado)
./mvnw clean install

# OU, se Maven já estiver instalado:
mvn clean install
```

⏱️ Primeira execução pode levar **2-5 minutos** (download de dependências).

#### 4️⃣ Executar o backend
```bash
# Opção 1: Usando Maven Wrapper
./mvnw spring-boot:run

# Opção 2: Compilar e executar JAR
./mvnw package -DskipTests
java -jar target/pacex-0.0.1-SNAPSHOT.jar
```

✅ Backend estará disponível em: **http://localhost:8080**

### 🎨 Instalação do Frontend

#### 1️⃣ Em outro terminal, navegar até a pasta frontend
```bash
cd frontend
```

#### 2️⃣ Instalar dependências (npm)
```bash
npm install
# ou, alternativamente:
npm ci  # Para instalação mais estrita (reproducível)
```

⏱️ Primeira execução pode levar **2-5 minutos**.

#### 3️⃣ Executar o frontend em modo desenvolvimento
```bash
npm start
```

✅ Frontend será aberto automaticamente em: **http://localhost:3000**

Se não abrir, acesse manualmente no navegador.

### ▶️ Verificar Status

- **Backend**: Acesse http://localhost:8080/actuator/health (deve retornar `{"status":"UP"}`)
- **Frontend**: Acesse http://localhost:3000 (deve mostrar tela de login)

---

## 🧪 Testes Automatizados

### Testes Backend (Java - JUnit 5)

#### Executar todos os testes
```bash
cd backend
./mvnw test
```

#### Executar teste específico
```bash
./mvnw test -Dtest=PeriodizacaoServiceTest
```

#### Ver cobertura de testes
```bash
./mvnw jacoco:report
# Relatório gerado em: target/site/jacoco/index.html
```

#### Testes inclusos

| Teste | Arquivo | Objetivo |
|-------|---------|----------|
| **Periodização** | `PeriodizacaoServiceTest.java` | Valida cálculo de fases de treino |
| **Autenticação** | (Coverage em CI/CD) | Testa login e tokens JWT |

**Exemplo de teste:**
```java
@Test
void deveCalcularNumeroCorretoDeSemanasParaMeiaMaratona() {
    // Arrange
    LocalDate dataProva = LocalDate.now().plusWeeks(14);
    
    // Act
    PlanoTreino plano = periodizacaoService.gerarPlano(dataProva, MEIA_MARATONA);
    
    // Assert
    assertEquals(12, plano.getSemanasTotal());
}
```

### Testes Frontend (React - Testing Library)

#### Executar testes
```bash
cd frontend
npm test
```

#### Executar em modo watch (reexecuta ao detectar mudanças)
```bash
npm test -- --watch
```

#### Gerar relatório de cobertura
```bash
npm test -- --coverage --watchAll=false
```

---

## 🔍 Análise Estática de Código (Linting)

### Backend - Checkstyle & SpotBugs

#### Executar Checkstyle (padrão de código)
```bash
cd backend
./mvnw checkstyle:check
```

#### Executar SpotBugs (detecção de bugs)
```bash
./mvnw spotbugs:check
```

#### Corrigir problemas automáticos (quando possível)
```bash
./mvnw checkstyle:check -Dcheckstyle.suppressions.location=suppressions.xml
```

**Configuração:** O projeto segue padrão **Google Checks** (google_checks.xml).

### Frontend - ESLint

#### Executar ESLint
```bash
cd frontend
npm run lint
```

**Nota:** O ESLint está configurado no `package.json` através da config `eslintConfig`.

#### Verificação de erros de linting no build
```bash
npm build  # Falhará se houver erros de linting bloqueantes
```

---

## 🔄 GitHub Actions - Pipeline CI/CD

### O que acontece automaticamente?

Toda vez que você faz **push** ou **pull request** para `main` ou `develop`, a pipeline executa:

```yaml
✅ Checkout do código
✅ Configurar JDK 21
✅ Rodar Checkstyle (linting backend)
✅ Rodar SpotBugs (bug detection)
✅ Executar testes backend
✅ Build backend (Maven package)
✅ Gerar relatório de cobertura (JaCoCo)
✅ Configurar Node.js (18 e 20)
✅ Instalar dependências frontend
✅ Rodar ESLint (linting frontend)
✅ Executar testes frontend
✅ Build produção (React)
✅ Quality Gate (verifica se tudo passou)
```

### Visualizar pipeline

1. Acesse: https://github.com/seu_usuario/pacex/actions
2. Clique no workflow mais recente
3. Veja detalhes de cada job

### Status Badge

Adicione ao README para mostrar status:

```markdown
[![Build Status](https://github.com/seu_usuario/pacex/workflows/CI%2FCD%20Pipeline/badge.svg?branch=main)](https://github.com/seu_usuario/pacex/actions)
```

---

## 📖 Guia de Uso da Aplicação

### Fluxo de Usuário

#### 1. **Cadastro e Autenticação**
- Acesse http://localhost:3000
- Clique em "Registrar"
- Preencha: email, senha e confirme
- Sistema gera token JWT automaticamente

#### 2. **Completar Perfil**
- Preencha informações pessoais:
  - **Objetivo de Corrida**: 5K, 10K, Meia Maratona, Maratona
  - **Nível de Experiência**: Iniciante, Intermediário, Avançado
  - **Dias por Semana Disponíveis**: 3-6 dias

#### 3. **Visualizar Plano Gerado**
- Sistema calcula automaticamente periodo de 12-16 semanas
- Estrutura em 4 fases: Base → Desenvolvimento → Pico → Taper
- Cada semana com treinos específicos

#### 4. **Registrar Execução**
- Marque treinos como concluídos
- Registre sensação/intensidade
- Sistema acumula dados para gráficos

#### 5. **Acompanhar Progresso**
- Dashboard mostra gráficos de:
  - Volume semanal
  - Intensidade média
  - Progressão de ritmo
  - Recuperação entre sessões

---

## 📝 Exemplos de Requisições à API

### Autenticação

#### Registrar novo usuário
```bash
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "email": "corredor@example.com",
  "password": "senha123",
  "confirmPassword": "senha123"
}
```

#### Login
```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "corredor@example.com",
  "password": "senha123"
}

# Resposta inclui: {"token": "eyJhbGc..."}
```

### Plano de Treino

#### Obter plano atual
```bash
GET http://localhost:8080/api/planos
Authorization: Bearer {token}
```

#### Criar novo plano
```bash
POST http://localhost:8080/api/planos
Authorization: Bearer {token}
Content-Type: application/json

{
  "objetivo": "MEIA_MARATONA",
  "dataProva": "2026-06-15",
  "nivelExperiencia": "INTERMEDIARIO",
  "diasTreinoSemana": 4
}
```

**Nota:** Coleção Postman disponível em `postman/resources.yaml` para testes manuais.

---

## 🐛 Troubleshooting

### Backend não inicia

**Erro**: `Port 8080 already in use`
```bash
# Solução 1: Mudar porta no application.properties
server.port=8081

# Solução 2: Matar processo na porta 8080
# No Windows:
netstat -ano | findstr :8080
taskkill /PID {PID} /F

# No macOS/Linux:
lsof -i :8080
kill -9 {PID}
```

### Frontend não conecta ao backend

**Erro**: `CORS error` ou `Connection refused`
```bash
# Verificar se backend está rodando:
http://localhost:8080/actuator/health

# Se retornar 404, backend não está em execução
# Se retornar {"status":"UP"}, backend está ok
```

### Testes falhando

**Erro**: `H2 Database connection issues`
```bash
# Limpar cache Maven:
./mvnw clean

# Reexecutar testes:
./mvnw test -U
```

**Erro**: `npm ERR! code ERESOLVE` (conflito de dependências)
```bash
# Deletar node_modules e reinstalar:
rm -rf node_modules package-lock.json
npm install
```

---

## 🤝 Contribuindo

Leia [CONTRIBUTING.md](CONTRIBUTING.md) para:
- Processo de pull requests
- Padrão de commits
- Convenção de branches
- Diretrizes de código

---

## 📄 Versão e Histórico

- **Versão Atual**: 1.0.0 (Março 2026)
- **Lançamento**: 2026-03-22
- **Histórico Completo**: Ver [CHANGELOG.md](CHANGELOG.md)

### Versionamento Semântico

Este projeto segue [Semantic Versioning](https://semver.org):
- **MAJOR** (1.0.0): Mudanças incompatíveis
- **MINOR** (1.1.0): Novas features compatíveis
- **PATCH** (1.0.1): Correções e ajustes

---

## ✍️ Autor

**Bruno Santos**
- 📧 Email: brunosantos6235@gmail.com
- 🔗 GitHub: [@Bruno-Kowalski](https://github.com/Bruno-Kowalski)
- 🌐 LinkedIn: [Bruno Santos](https://www.linkedin.com/in/bruno-santos-devkowa/)

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License**. Veja [LICENSE](LICENSE) para detalhes.

---

## 🔗 Links Importantes

- 🏠 [Repositório GitHub](https://github.com/Bruno-Kowalski/PaceX)
- 📚 [Documentação de Arquitetura](docs/architecture.md)
- 📋 [Requisitos Funcionais](docs/requirements.md)
- 🚀 [Releases & Tags](https://github.com/seu_usuario/pacex/releases)
- 🆘 [Reportar Issues](https://github.com/seu_usuario/pacex/issues)

---

## 🎓 Contexto Educacional

Este projeto foi desenvolvido como parte de uma **atividade de Bootcamp no curso de Análise e Desenvolvimento de Sistemas**, demonstrando:

✅ Análise de problema real e relevante  
✅ Design de solução estruturada e escalável  
✅ Implementação fullstack moderna (Java + React)  
✅ Organização e documentação profissional  
✅ Testes automatizados e validação de qualidade  
✅ Pipeline CI/CD com automação  
✅ Versionamento semântico e gestão de dependências  
✅ Práticas reais de desenvolvimento ágil e DevOps

---

## 📞 Suporte

Tem dúvidas ou encontrou um bug? 

1. **Verifique a seção Troubleshooting** acima
2. **Abra uma Issue** em https://github.com/seu_usuario/pacex/issues
3. **Consulte a documentação** em `/docs`

---

<div align="center">

**Desenvolvido por Bruno Santos | 2026**

[⬆ Voltar ao topo](#-pacex)

</div>
