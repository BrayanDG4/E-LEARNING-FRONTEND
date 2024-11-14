import axios from 'axios';
import { ToastChakra } from '../helpers/toast';

const API_URL = process.env.REACT_APP_API_URL;

// Crear una nueva evaluación
const createEvaluacion = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.post(`${API_URL}/evaluaciones`, data, config);
    ToastChakra(
      'Evaluación creada',
      'La evaluación ha sido creada correctamente',
      'success',
      1500,
      'bottom'
    );
    return response.data;
  } catch (error) {
    ToastChakra(
      'Error',
      'No se pudo crear la evaluación',
      'error',
      1500,
      'bottom'
    );
    console.error('Error al crear la evaluación:', error);
    throw error;
  }
};

// Obtener todas las evaluaciones
const getEvaluaciones = async token => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.get(`${API_URL}/evaluaciones`, config);
    return response.data;
  } catch (error) {
    ToastChakra(
      'Error',
      'No se pudo obtener las evaluaciones',
      'error',
      1500,
      'bottom'
    );
    console.error('Error al obtener las evaluaciones:', error);
    throw error;
  }
};

// Eliminar una evaluación
const deleteEvaluacion = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.delete(
      `${API_URL}/evaluaciones/${id}`,
      config
    );
    if (response.status === 200) {
      ToastChakra(
        'Evaluación eliminada',
        'La evaluación ha sido eliminada correctamente',
        'success',
        1500,
        'bottom'
      );
    }
    return response.data;
  } catch (error) {
    ToastChakra(
      'Error',
      'No se pudo eliminar la evaluación',
      'error',
      1500,
      'bottom'
    );
    console.error('Error al eliminar la evaluación:', error);
    throw error;
  }
};

// Actualizar una evaluación
const updateEvaluacion = async (data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.put(
      `${API_URL}/evaluaciones/${data._id}`,
      data,
      config
    );
    ToastChakra(
      'Evaluación actualizada',
      'La evaluación ha sido actualizada correctamente',
      'success',
      1500,
      'bottom'
    );
    return response.data;
  } catch (error) {
    ToastChakra(
      'Error',
      'No se pudo actualizar la evaluación',
      'error',
      1500,
      'bottom'
    );
    console.error('Error al actualizar la evaluación:', error);
    throw error;
  }
};

// Habilitar/deshabilitar una evaluación
const toggleEvaluacionState = async (id, habilitada, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.put(
      `${API_URL}/evaluaciones/${id}/habilitar`,
      { habilitada },
      config
    );
    const msg = habilitada
      ? 'Evaluación habilitada'
      : 'Evaluación deshabilitada';
    ToastChakra(
      msg,
      `La evaluación ha sido ${
        habilitada ? 'habilitada' : 'deshabilitada'
      } correctamente`,
      'success',
      1500,
      'bottom'
    );
    return response.data;
  } catch (error) {
    ToastChakra(
      'Error',
      `No se pudo ${habilitada ? 'habilitar' : 'deshabilitar'} la evaluación`,
      'error',
      1500,
      'bottom'
    );
    console.error(
      `Error al ${habilitada ? 'habilitar' : 'deshabilitar'} la evaluación:`,
      error
    );
    throw error;
  }
};

// Enviar respuestas de los estudiantes
const submitRespuestas = async (evaluacionId, respuestas, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.post(
      `${API_URL}/evaluaciones/${evaluacionId}/responder`, // Asegúrate de que esta URL coincida con la del backend
      { respuestas },
      config
    );
    ToastChakra(
      'Respuestas enviadas',
      'Las respuestas han sido enviadas correctamente',
      'success',
      1500,
      'bottom'
    );
    return response.data;
  } catch (error) {
    ToastChakra(
      'Error',
      'No se pudo enviar las respuestas',
      'error',
      1500,
      'bottom'
    );
    console.error('Error al enviar las respuestas:', error);
    throw error;
  }
};

// Obtener las calificaciones de una evaluación específica
const getCalificaciones = async (evaluacionId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(
    `${API_URL}/evaluaciones/${evaluacionId}/calificaciones`,
    config
  );

  return response.data;
};

const getTodasLasCalificaciones = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}/evaluaciones/calificaciones`, config);
  return response.data;
};

const evaluacionService = {
  createEvaluacion,
  getEvaluaciones,
  deleteEvaluacion,
  updateEvaluacion,
  toggleEvaluacionState,
  submitRespuestas,
  getCalificaciones,
  getTodasLasCalificaciones,
};

export default evaluacionService;
