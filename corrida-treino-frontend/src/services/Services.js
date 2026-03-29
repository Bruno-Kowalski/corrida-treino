import api from './Api'; // ← seu axios original

// ──────────────────────────────────────
// AUTH
// ──────────────────────────────────────
export const authService = {
  login: async (email, senha) => {
    const { data } = await api.post('/auth/login', { email, senha });
    if (data.token) localStorage.setItem('token', data.token);
    return data;
  },

  register: async (nome, email, senha) => {
    const { data } = await api.post('/auth/register', { nome, email, senha });
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  isLoggedIn: () => !!localStorage.getItem('token'),
};

// ──────────────────────────────────────
// PERFIL
// ──────────────────────────────────────
export const perfilService = {
  buscar: async () => {
    const { data } = await api.get('/perfil');
    return data;
  },

  salvar: async (dados) => {
    const { data } = await api.post('/perfil', dados);
    return data;
  },
};

// ──────────────────────────────────────
// PLANOS DE TREINO
// ──────────────────────────────────────
export const planosService = {
  listar: async () => {
    const { data } = await api.get('/planos');
    return data;
  },

  buscarPorId: async (id) => {
    const { data } = await api.get(`/planos/${id}`);
    return data;
  },

  gerar: async (dados) => {
    const { data } = await api.post('/planos/gerar', dados);
    return data;
  },

  deletar: async (id) => {
    const { data } = await api.delete(`/planos/${id}`);
    return data;
  },
};

// ──────────────────────────────────────
// REGISTROS DE TREINO
// ──────────────────────────────────────
export const registrosService = {
  listar: async () => {
    const { data } = await api.get('/registros');
    return data;
  },

  registrar: async (sessaoId, dados) => {
    const { data } = await api.post(`/registros/sessao/${sessaoId}`, dados);
    return data;
  },
};