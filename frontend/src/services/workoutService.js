import api from './Api';

export const iniciarWorkout = (lat, lng, treino) =>
  api.post('/api/workouts/iniciar', {
    lat,
    lng,
    intervaloSegmentosMetros: 1000,
    sessaoTreinoId: treino?.id ?? null,
    distanciaMetaKm: treino?.distanciaKm ?? null,
    ritmoAlvo: treino?.ritmoAlvo ?? null,
    tipoTreino: treino?.tipo ?? null,
  });

export const enviarPontos = (workoutId, pontos) =>
  api.post(`/api/workouts/${workoutId}/pontos`, pontos);

export const finalizarWorkout = (workoutId) =>
  api.post(`/api/workouts/${workoutId}/finalizar`);

export const registrarWorkout = (workoutId, descricao) =>
  api.patch(`/api/workouts/${workoutId}/registrar`, { descricao });

export const listarWorkouts = () =>
  api.get('/api/workouts');

export const listarPontosWorkout = (workoutId) =>
  api.get(`/api/workouts/${workoutId}/pontos`);
