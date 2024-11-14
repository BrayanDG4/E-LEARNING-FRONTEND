import React, { useEffect, useState } from 'react';
import {
  Box,
  HStack,
  Stack,
  Text,
  Progress,
  IconButton,
  Select,
  Button,
} from '@chakra-ui/react';
import {
  FaCheckCircle,
  FaRegCircle,
  FaFilePdf,
  FaVideo,
  FaLink,
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMaterials } from '../../features/materialActions/materialActions';

export const MaterialEstudiante = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth || {});
  const {
    materials: globalMateriales = [],
    isLoading,
    isError,
  } = useSelector(state => state.materials || {});

  const [progreso, setProgreso] = useState(0);
  const [materiales, setMateriales] = useState([]);
  const [asignaturasDisponibles, setAsignaturasDisponibles] = useState([]);
  const [periodosDisponibles, setPeriodosDisponibles] = useState([]);
  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState('');
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('');

  useEffect(() => {
    // Obtener todos los materiales
    dispatch(fetchMaterials());
  }, [dispatch]);

  useEffect(() => {
    if (globalMateriales && Array.isArray(globalMateriales.materiales)) {
      const savedProgress =
        JSON.parse(localStorage.getItem('progresoMateriales')) || {};
      const updatedMaterials = globalMateriales.materiales.map(material => ({
        ...material,
        visto: savedProgress[material._id] || false,
      }));
      setMateriales(updatedMaterials);
      actualizarProgreso(updatedMaterials);

      // Extraer grados únicos usando Set para evitar duplicados
      const asignaturas = [
        ...new Set(
          globalMateriales.materiales.map(material => material.grado.nombre)
        ),
      ];
      setAsignaturasDisponibles(asignaturas);

      // Extraer los periodos únicos
      const periodos = [
        ...new Set(
          globalMateriales.materiales.map(material => material?.periodo)
        ),
      ];
      setPeriodosDisponibles(periodos);
    }
  }, [globalMateriales]);

  const handleFiltroAsignatura = e => {
    setAsignaturaSeleccionada(e.target.value);
    filtrarMateriales(e.target.value, periodoSeleccionado);
  };

  const handleFiltroPeriodo = e => {
    setPeriodoSeleccionado(e.target.value);
    filtrarMateriales(asignaturaSeleccionada, e.target.value);
  };

  const filtrarMateriales = (asignatura, periodo) => {
    let materialesFiltrados = globalMateriales.materiales;

    if (asignatura) {
      materialesFiltrados = materialesFiltrados.filter(
        material => material?.grado?.nombre === asignatura
      );
    }

    if (periodo) {
      materialesFiltrados = materialesFiltrados.filter(
        material => material?.periodo === periodo
      );
    }

    setMateriales(materialesFiltrados);
  };

  const toggleVisto = id => {
    const updatedMaterials = materiales.map(material =>
      material._id === id ? { ...material, visto: !material.visto } : material
    );
    setMateriales(updatedMaterials);

    const updatedProgress = updatedMaterials.reduce((acc, material) => {
      acc[material._id] = material.visto;
      return acc;
    }, {});
    localStorage.setItem('progresoMateriales', JSON.stringify(updatedProgress));

    actualizarProgreso(updatedMaterials);
  };

  const actualizarProgreso = updatedMaterials => {
    const totalMateriales = updatedMaterials.length;
    const materialesVistos = updatedMaterials.filter(
      material => material.visto
    ).length;
    const nuevoProgreso =
      totalMateriales > 0 ? (materialesVistos / totalMateriales) * 100 : 0;
    setProgreso(nuevoProgreso);
  };

  if (isLoading) {
    return <Text>Cargando materiales...</Text>;
  }

  if (isError) {
    return <Text>Error al cargar los materiales</Text>;
  }

  return (
    <Box p={4}>
      <Text fontSize="2xl" fontWeight="bold">
        Progreso del Curso
      </Text>
      <Progress value={progreso} size="lg" colorScheme="green" mt={4} />
      <Text mt={2}>{progreso.toFixed(2)}% completado</Text>

      <Select
        placeholder="Selecciona una asignatura"
        onChange={handleFiltroAsignatura}
        mt={4}
      >
        {asignaturasDisponibles.length > 0 ? (
          asignaturasDisponibles.map((asignatura, index) => (
            <option key={index} value={asignatura}>
              {asignatura}
            </option>
          ))
        ) : (
          <option>No hay asignaturas disponibles</option>
        )}
      </Select>

      <Select
        placeholder="Selecciona un periodo"
        onChange={handleFiltroPeriodo}
        mt={4}
      >
        {periodosDisponibles.length > 0 ? (
          periodosDisponibles.map((periodo, index) => (
            <option key={index} value={periodo}>
              {periodo}
            </option>
          ))
        ) : (
          <option>No hay periodos disponibles</option>
        )}
      </Select>

      <Stack mt={6} spacing={4}>
        {materiales.length > 0 ? (
          materiales.map(material => (
            <Box
              key={material._id}
              p={4}
              shadow="md"
              borderWidth="1px"
              rounded="md"
            >
              <HStack justifyContent="space-between">
                <Text fontSize="lg" fontWeight="bold">
                  {material.titulo}
                </Text>
                <IconButton
                  icon={material.visto ? <FaCheckCircle /> : <FaRegCircle />}
                  colorScheme={material.visto ? 'green' : 'gray'}
                  aria-label="Marcar como visto"
                  onClick={() => toggleVisto(material._id)}
                />
              </HStack>
              <Text mt={2}>{material.descripcion}</Text>

              {material.tipo === 'PDF' && <FaFilePdf size={24} />}
              {material.tipo === 'video' && <FaVideo size={24} />}
              {material.tipo === 'enlace' && <FaLink size={24} />}

              {material.archivoUrl && (
                <Button
                  mt={2}
                  colorScheme="teal"
                  as="a"
                  href={material.archivoUrl}
                  download
                >
                  Descargar
                </Button>
              )}
            </Box>
          ))
        ) : (
          <Text>No hay materiales disponibles</Text>
        )}
      </Stack>
    </Box>
  );
};
