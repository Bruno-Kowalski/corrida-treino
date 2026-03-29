import React, { createContext, useState, useContext } from 'react';
import api from '../services/Api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email, senha) => {
    const response = await api.post('/auth/login', { email, senha });
    const { token, nome, email: userEmail } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({ nome, email: userEmail }));
    setUser({ nome, email: userEmail });

    // Verifica se já tem perfil
    try {
      await api.get('/perfil');
      return { temPerfil: true };
    } catch {
      return { temPerfil: false };
    }
  };

  const register = async (nome, email, senha) => {
    const response = await api.post('/auth/register', { nome, email, senha });
    const { token, nome: userName, email: userEmail } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({ nome: userName, email: userEmail }));
    setUser({ nome: userName, email: userEmail });

    return { temPerfil: false }; // novo usuário nunca tem perfil
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);