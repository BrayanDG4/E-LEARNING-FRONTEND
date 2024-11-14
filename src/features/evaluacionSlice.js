import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import evaluacionService from '../services/evaluacionService';

// Acción para obtener las evaluaciones
export const getEvaluations = createAsyncThunk(
  'evaluaciones/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await evaluacionService.getEvaluaciones(token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Acción para crear una nueva evaluación
export const createEvaluation = createAsyncThunk(
  'evaluaciones/create',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await evaluacionService.createEvaluacion(data, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Acción para eliminar una evaluación
export const deleteEvaluacion = createAsyncThunk(
  'evaluaciones/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await evaluacionService.deleteEvaluacion(id, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Acción para habilitar/deshabilitar una evaluación
export const toggleEvaluacionState = createAsyncThunk(
  'evaluaciones/toggle',
  async ({ id, habilitada }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await evaluacionService.toggleEvaluacionState(
        id,
        habilitada,
        token
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Acción para actualizar una evaluación
export const updateEvaluacion = createAsyncThunk(
  'evaluaciones/update',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await evaluacionService.updateEvaluacion(data, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Acción para enviar respuestas del estudiante
export const submitRespuestas = createAsyncThunk(
  'evaluaciones/submitRespuestas',
  async ({ evaluacionId, respuestas }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await evaluacionService.submitRespuestas(
        evaluacionId,
        respuestas,
        token
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Acción para obtener las calificaciones de una evaluación específica
export const getCalificaciones = createAsyncThunk(
  'evaluaciones/getCalificaciones',
  async (evaluacionId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await evaluacionService.getCalificaciones(evaluacionId, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Acción para obtener todas las calificaciones
export const getTodasLasCalificaciones = createAsyncThunk(
  'evaluaciones/getTodasLasCalificaciones',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await evaluacionService.getTodasLasCalificaciones(token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const evaluacionSlice = createSlice({
  name: 'evaluaciones',
  initialState: {
    evaluaciones: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
  },
  reducers: {
    reset: state => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getEvaluations.pending, state => {
        state.isLoading = true;
      })
      .addCase(getEvaluations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.evaluaciones = action.payload;
      })
      .addCase(getEvaluations.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createEvaluation.pending, state => {
        state.isLoading = true;
      })
      .addCase(createEvaluation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.evaluaciones.push(action.payload);
      })
      .addCase(createEvaluation.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateEvaluacion.pending, state => {
        state.isLoading = true;
      })
      .addCase(updateEvaluacion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.evaluaciones = state.evaluaciones.map(evaluacion =>
          evaluacion._id === action.payload._id ? action.payload : evaluacion
        );
      })
      .addCase(updateEvaluacion.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteEvaluacion.pending, state => {
        state.isLoading = true;
      })
      .addCase(deleteEvaluacion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.evaluaciones = state.evaluaciones.filter(
          evaluacion => evaluacion._id !== action.payload._id
        );
      })
      .addCase(deleteEvaluacion.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(toggleEvaluacionState.fulfilled, (state, action) => {
        const index = state.evaluaciones.findIndex(
          evaluacion => evaluacion._id === action.payload._id
        );
        if (index !== -1) {
          state.evaluaciones[index].habilitada = action.payload.habilitada;
        }
      })
      .addCase(submitRespuestas.pending, state => {
        state.isLoading = true;
      })
      .addCase(submitRespuestas.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(submitRespuestas.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getCalificaciones.pending, state => {
        state.isLoading = true;
      })
      .addCase(getCalificaciones.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.calificaciones = action.payload.calificaciones;
      })
      .addCase(getCalificaciones.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Error al cargar las calificaciones';
      })
      .addCase(getTodasLasCalificaciones.pending, state => {
        state.isLoading = true;
      })
      .addCase(getTodasLasCalificaciones.fulfilled, (state, action) => {
        state.isLoading = false;
        state.calificaciones = action.payload.calificaciones;
      })
      .addCase(getTodasLasCalificaciones.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = evaluacionSlice.actions;
export default evaluacionSlice.reducer;
