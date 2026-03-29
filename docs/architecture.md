# Arquitetura do Sistema

## Visão Geral

Corrida Treino utiliza uma arquitetura de **três camadas** com separação entre Frontend (React), Backend (Spring Boot) e Banco de Dados (PostgreSQL).

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer (React)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Navbar      │  │ Dashboard    │  │    Pages     │      │
│  │  Components  │  │  Charts      │  │  (Home,      │      │
│  │  Context     │  │  Statistics  │  │   Login...)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────┬──────────────────────────────────┘
                          │ HTTP/REST + JWT
┌─────────────────────────▼──────────────────────────────────┐
│                  API Gateway (Spring Boot)                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  CORS Config | JWT Filter | Spring Security         │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                          │
┌──────────────────────────▼──────────────────────────────────┐
│              Application Layer (Controllers)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ AuthCtrl     │  │ PerfilCtrl   │  │ PlanoCtrl    │      │
│  │ LoginRegister│  │ UserProfile  │  │ TrainingPlan │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└──────────────────────────────────────────────────────────────┘
                          │
┌──────────────────────────▼──────────────────────────────────┐
│               Business Logic Layer (Services)               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │AuthService   │  │PerfilService │  │ PlanoService │      │
│  │ JWT+Password │  │ UserBehavior │  │TrainingLogic │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└──────────────────────────────────────────────────────────────┘
                          │
┌──────────────────────────▼──────────────────────────────────┐
│                 Data Access Layer (JPA)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ usuarioRepo  │  │ perfilRepo   │  │ planoRepo    │      │
│  │              │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└──────────────────────────────────────────────────────────────┘
                          │
┌──────────────────────────▼──────────────────────────────────┐
│              Database Layer (PostgreSQL 15+)                │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │ USUARIO    │  │ PERFIL     │  │ PLANO      │            │
│  │ TREINO     │  │ SESSAO     │  │ SEMANA     │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└──────────────────────────────────────────────────────────────┘
```

## Componentes Principais

### Backend (Spring Boot)

#### Controllers
- **AuthController**: Endpoints de login, registro, refresh token
- **PerfilCorredorController**: CRUD do perfil do usuário
- **PlanoTreinoController**: Geração e visualização de planos
- **RegistroTreinoController**: Registro de execução de treinos

#### Services
- **AuthService**: Lógica de autenticação e JWT
- **PerfilCorredorService**: Validação e persistência de perfil
- **PlanoTreinoService**: Algoritmo de geração de plano
- **RegistroTreinoService**: Persistência de execuções

#### Security
- **JwtUtil**: Geração, validação, refresh de tokens JWT
- **JwtFilter**: Interceptação e validação de requisições
- **SecurityConfig**: Configuração Spring Security
- **UserDetailsServiceImpl**: Carregamento de usuário

#### Entities (JPA)
- **Usuario**: User account com email, password (bcrypt)
- **PerfilCorredor**: Profile com objetivo, experiência, dias
- **PlanoTreino**: Training plan com 4 fases
- **SemanaTreino**: Weekly structure com 1-7 sessões
- **SessaoTreino**: Individual session com tipo e duração
- **RegistroTreino**: Training log com data, km, tempo

#### DTOs
- **LoginRequest**: { email, password }
- **RegisterRequest**: { email, password, nome }
- **AuthResponse**: { token, refreshToken, usuario }
- **PerfilCorredorRequest**: { objetivo, nivelExperiencia, diasDisponiveis }
- **RegistroTreinoRequest**: { data, distancia, tempo, sensacao }

#### Repositories
- Implements Spring Data `JpaRepository`
- Custom queries for filtering, sorting
- Pagination support for lists

### Frontend (React 19.2.4)

#### Pages
- **Home**: Landing page com info do app
- **Login**: Form de login com validação
- **Register**: Form de registro com validação
- **Dashboard**: Visualização de plano e progresso
- **Perfil**: Edição do perfil do usuário
- **PaceX**: Componente auxiliar (pode ser removido)

#### Components
- **Navbar**: Navegação, logout, links

#### Context
- **AuthContext**: Estado global de autenticação (token, user)
- Providers para proteção de rotas

#### Services
- **Api.js**: Axios instance com interceptor JWT
- **Services.js**: Métodos HTTP (auth, perfil, plano, registro)

#### Styles
- **global.css**: CSS global da aplicação
- **App.css**: Estilos do App
- **Componentes com CSS inline** (futuro: CSS Modules)

## Fluxo de Dados

### 1. Autenticação
```
User Input → Login Form → AuthContext.login() → API.post(/auth/login) 
→ Backend: AuthController.login() → AuthService.authenticate() 
→ JwtUtil.generateToken() → Front: AuthContext.setToken() 
→ redirect(/dashboard)
```

### 2. Geração de Plano
```
User Profile → PlanoTreino Form → API.post(/plano/gerar) 
→ PlanoTreinoController.gerarPlano() → PlanoTreinoService.gerarPlano() 
→ Algorithm calcula 4 fases → Entities criadas → DB.save() 
→ Response com PlanoDTO → Dashboard exibe gráfico
```

### 3. Registro de Execução
```
User completes workout → RegistroTreino Form → API.post(/registro/criar) 
→ RegistroTreinoController.criar() → Service valida e salva 
→ DB.save(RegistroTreino) → Frontend atualiza dashboard
```

## Padrões de Design

### Backend
- **MVC**: Model-View-Controller separation
- **Repository Pattern**: Data abstraction
- **DTO Pattern**: Data Transfer Objects for API contracts
- **Service Layer**: Business logic isolation
- **Filter Pattern**: JWT authentication via Servlet Filter
- **Dependency Injection**: Spring annotations (@Service, @Repository)

### Frontend
- **Context API**: Global state management
- **Component Composition**: Functional components
- **Custom Hooks**: Logic reuse
- **Controlled Components**: Form handling
- **Axios Interceptors**: API request/response handling

## Segurança

### Autenticação
1. User registra com email + password
2. Backend: bcrypt hashing (JwtUtil.encodePassword())
3. Login: senha verificada, JWT gerado (access + refresh)
4. Frontend: token armazenado em localStorage/sessionStorage
5. API: Todo request contém `Authorization: Bearer {token}`
6. JwtFilter valida assinatura antes de processar

### Autorização
- Spring Security: @PreAuthorize validação
- JWT contém userId, roles
- API endpoints protegidos verificam autenticidade
- CORS restrito a domínio frontend

### Dados Sensíveis
- Senhas: nunca em logs, sempre criptografadas
- Tokens: expiração de 24h (refresh para estender)
- Email: validado no registro

## Deploy Architecture

```
GitHub Repository
        ↓
   CI/CD Pipeline (GitHub Actions)
        ↓
   ┌────────────────────┐
   │  Build Backend     │ → mvn clean package
   │  Build Frontend    │ → npm run build
   │  Run Tests         │ → coverage check
   │  Lint & Security   │ → Checkstyle, SpotBugs, ESLint
   └────────────────────┘
        ↓
   ┌────────────────────┐
   │  Push to Registry  │
   │  Docker/Container  │ (optional)
   └────────────────────┘
        ↓
   ┌────────────────────┐
   │  Deploy to Cloud   │
   │  Azure/AWS/etc     │ (optional future)
   └────────────────────┘
```

## Escalabilidade Futura

1. **Microserviços**: Separar Auth, Plano, Registro em serviços
2. **Cache**: Redis para tokens e dados frequentes
3. **Database**: Sharding por userId, read replicas
4. **Frontend**: Bundle splitting, lazy loading
5. **API Gateway**: Kong/Nginx para rate limiting
6. **Notifications**: WebSocket para atualizações real-time
7. **Mobile**: React Native app compartilhando API

## Tecnologias Envolvidas

- **Backend**: Java 21, Spring Boot 3.4.3, Hibernate, PostgreSQL 15
- **Frontend**: React 19.2.4, React Router DOM, Axios, Chart.js
- **DevOps**: Maven, npm, Docker (optional), GitHub Actions
- **Quality**: JUnit, Checkstyle, SpotBugs, ESLint, Prettier
- **Version Control**: Git, GitHub
