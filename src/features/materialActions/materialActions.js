// features/materialActions.js

import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Acción para obtener los materiales según el grado del estudiante
export const fetchMaterials = createAsyncThunk(
  'materiales/fetchMaterials',
  async (gradoId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        `http://localhost:3001/api/materiales/grado/${gradoId}`,
        config
      );
      return {
        materiales: response.data.materiales, // Solo devuelve los materiales
      };
    } catch (error) {
      console.error(
        'Error fetching materials:',
        error.response ? error.response.data : error.message
      );
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);
