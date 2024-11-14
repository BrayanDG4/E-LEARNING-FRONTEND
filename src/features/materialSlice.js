import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import materialService from '../services/materialService';
import { fetchMaterials } from './materialActions/materialActions';

const initialState = {
  materials: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

export const createMaterial = createAsyncThunk(
  'materials/create',
  async (materialData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const profesor = thunkAPI.getState().auth.user._id;
      const data = { ...materialData, profesor };
      return await materialService.createMaterial(data, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.msg) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getMaterials = createAsyncThunk(
  'materials/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await materialService.getMaterials(token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.msg) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getMaterialById = createAsyncThunk(
  'materials/getById',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await materialService.getMaterialById(id, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.msg) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateMaterial = createAsyncThunk(
  'materials/update',
  async (materialData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await materialService.updateMaterial(materialData, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.msg) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteMaterial = createAsyncThunk(
  'materials/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await materialService.deleteMaterial(id, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.msg) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const materialSlice = createSlice({
  name: 'materials',
  initialState,
  reducers: {
    reset: state => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(createMaterial.pending, state => {
        state.isLoading = true;
      })
      .addCase(createMaterial.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.materials.push(action.payload);
      })
      .addCase(createMaterial.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getMaterials.pending, state => {
        state.isLoading = true;
      })
      .addCase(getMaterials.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.materials = action.payload;
      })
      .addCase(getMaterials.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getMaterialById.pending, state => {
        state.isLoading = true;
      })
      .addCase(getMaterialById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.materials = action.payload;
      })
      .addCase(getMaterialById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateMaterial.pending, state => {
        state.isLoading = true;
      })
      .addCase(updateMaterial.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.materials = state.materials.map(material =>
          material._id === action.payload._id ? action.payload : material
        );
      })
      .addCase(updateMaterial.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteMaterial.pending, state => {
        state.isLoading = true;
      })
      .addCase(deleteMaterial.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.materials = state.materials.filter(
          material => material._id !== action.payload._id
        );
      })
      .addCase(deleteMaterial.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(fetchMaterials.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMaterials.fulfilled, (state, action) => {
        console.log("Datos recibidos del fetchMaterials:", action.payload);
        state.isLoading = false;
        state.isSuccess = true;
        state.materials = action.payload;
      })      
      .addCase(fetchMaterials.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
  },
});

export const { reset } = materialSlice.actions;
export default materialSlice.reducer;
