# Requisitos Funcionais e Não-Funcionais

## Requisitos Funcionais (RF)

### Autenticação e Usuários
- **RF001**: Usuário deve poder se registrar com email e senha
- **RF002**: Usuário deve poder fazer login com email e senha
- **RF003**: Usuário autenticado deve poder fazer logout
- **RF004**: Sistema deve gerar token JWT válido por 24 horas
- **RF005**: Sistema deve permitir refresh de token expirado

### Perfil do Corredor
- **RF101**: Usuário deve criar perfil informando objetivo (5K, 10K, Meia Maratona)
- **RF102**: Usuário deve informar nível de experiência (Iniciante, Intermediário, Avançado)
- **RF103**: Usuário deve informar dias disponíveis para treino (1-7 por semana)
- **RF104**: Usuário deve poder editar seu perfil
- **RF105**: Sistema deve armazenar histórico de perfis do usuário

### Plano de Treino
- **RF201**: Sistema deve gerar automaticamente plano de treino baseado no perfil
- **RF202**: Plano deve conter 4 fases: Base, Desenvolvimento, Pico, Taper
- **RF203**: Cada fase deve ter duração correspondente (8-12 semanas)
- **RF204**: Cada semana deve conter sessões de treino variadas
- **RF205**: Usuário deve poder visualizar plano gerado
- **RF206**: Usuário deve poder baixar plano em PDF (opcional)

### Registro de Execução
- **RF301**: Usuário deve registrar execução de sessão de treino
- **RF302**: Registro deve incluir: data, distância, tempo, sensação
- **RF303**: Sistema deve armazenar histórico de execuções
- **RF304**: Usuário deve poder editar registros anteriores

### Dashboard e Relatórios
- **RF401**: Dashboard deve exibir gráfico de progresso semanal
- **RF402**: Dashboard deve exibir gráfico de histórico mensal
- **RF403**: Dashboard deve exibir estatísticas (média de km, ritmo, etc)
- **RF404**: Dashboard deve ser responsivo (mobile-friendly)

## Requisitos Não-Funcionais (RNF)

### Performance
- **RNF001**: Sistema deve responder requisições em < 200ms
- **RNF002**: Página deve carregar em < 3 segundos
- **RNF003**: Suportar até 1000 usuários simultâneos

### Segurança
- **RNF101**: Senhas devem ser criptografadas com bcrypt
- **RNF102**: JWT deve ter assinatura HMAC-SHA256
- **RNF103**: API deve validar CORS
- **RNF104**: Senhas devem ter mínimo 8 caracteres
- **RNF105**: Dados de usuário não devem ser expostos em logs

### Usabilidade
- **RNF201**: Interface deve ser intuitiva (UX)
- **RNF202**: Suportar navegadores Chrome, Firefox, Safari, Edge
- **RNF203**: Aplicação deve funcionar em dispositivos móveis

### Confiabilidade
- **RNF301**: Uptime mínimo de 99%
- **RNF302**: Backup automático daily
- **RNF303**: Testes com cobertura mínima de 70%

### Mantenibilidade
- **RNF401**: Código deve seguir padrões de estilo (Checkstyle, ESLint)
- **RNF402**: Documentação de API completa
- **RNF403**: CI/CD pipeline automático
