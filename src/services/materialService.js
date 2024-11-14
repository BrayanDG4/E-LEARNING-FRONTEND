import axios from 'axios';

const API_URL = 'http://localhost:3001/api/materiales'; // Asegúrate de que la URL sea la correcta

// Crear un nuevo material
const createMaterial = async (materialData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.post(API_URL, materialData, config);
    return response.data;
};

// Obtener todos los materiales
const getMaterials = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.get(API_URL, config);
    return response.data;
};

// Obtener material por ID
const getMaterialById = async (id, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.get(`${API_URL}/${id}`, config);
    return response.data;
};

// Actualizar material
const updateMaterial = async (materialData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.put(`${API_URL}/${materialData._id}`, materialData, config);
    return response.data;
};

// Eliminar material
const deleteMaterial = async (id, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.delete(`${API_URL}/${id}`, config);
    return response.data;
};

const materialService = {
    createMaterial,
    getMaterials,
    getMaterialById,
    updateMaterial,
    deleteMaterial,
};

export default materialService;
