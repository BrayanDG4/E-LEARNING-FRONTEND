import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getEvaluations,
  submitRespuestas,
} from '../../features/evaluacionSlice';
import {
  Box,
  Button,
  RadioGroup,
  Radio,
  Stack,
  FormControl,
  FormLabel,
  Select,
  Text,
  Heading,
  Divider,
  Badge,
  VStack,
} from '@chakra-ui/react';

export const EvaluacionesEstudiante = () => {
  const dispatch = useDispatch();
  const { evaluaciones, isLoading, isError } = useSelector(
    state => state.evaluaciones || {}
  );
  const [evaluacionSeleccionada, setEvaluacionSeleccionada] = useState(null);
  const [respuestas, setRespuestas] = useState({});
  const [retroalimentacion, setRetroalimentacion] = useState(null);
  const [filtroAsignatura, setFiltroAsignatura] = useState('');
  const [filtroPeriodo, setFiltroPeriodo] = useState('');

  useEffect(() => {
    dispatch(getEvaluations());
  }, [dispatch]);

  const handleChangeRespuesta = (preguntaId, opcionTexto) => {
    setRespuestas({
      ...respuestas,
      [preguntaId]: opcionTexto,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (evaluacionSeleccionada) {
      dispatch(
        submitRespuestas({
          evaluacionId: evaluacionSeleccionada._id,
          respuestas,
        })
      )
        .unwrap()
        .then(res => {
          setRetroalimentacion(res);
        })
        .catch(error => {
          console.error('Error al enviar respuestas:', error);
        });
    }
  };

  const evaluacionesFiltradas = evaluaciones
    .filter(evaluacion => evaluacion.habilitada)
    .filter(
      evaluacion =>
        !filtroAsignatura || evaluacion.grado.nombre === filtroAsignatura
    )
    .filter(
      evaluacion => !filtroPeriodo || evaluacion.periodo === filtroPeriodo
    );

  return (
    <Box p={6} maxW="6xl" mx="auto">
      <Heading as="h1" size="xl" mb={6} textAlign="center" color="teal.600">
        Evaluaciones Interactivas
      </Heading>

      {/* Filtros */}
      <VStack spacing={4} mb={6} align="stretch">
        <FormControl>
          <FormLabel>Filtrar por Asignatura</FormLabel>
          <Select
            placeholder="Selecciona Asignatura"
            bg="white"
            onChange={e => setFiltroAsignatura(e.target.value)}
          >
            {[...new Set(evaluaciones.map(e => e.grado.nombre))].map(
              asignatura => (
                <option key={asignatura} value={asignatura}>
                  {asignatura}
                </option>
              )
            )}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Filtrar por Periodo</FormLabel>
          <Select
            placeholder="Selecciona Periodo"
            bg="white"
            onChange={e => setFiltroPeriodo(e.target.value)}
          >
            {[...new Set(evaluaciones.map(e => e.periodo))].map(periodo => (
              <option key={periodo} value={periodo}>
                {periodo}
              </option>
            ))}
          </Select>
        </FormControl>
      </VStack>

      <Divider my={4} />

      {/* Listado de evaluaciones */}
      <Heading as="h2" size="lg" mb={4} color="teal.500">
        Evaluaciones Disponibles
      </Heading>
      {/* Listado de evaluaciones */}
      <Stack spacing={6}>
        {evaluacionesFiltradas.length > 0 ? (
          evaluacionesFiltradas.map(evaluacion => (
            <Box
              key={evaluacion._id}
              p={6}
              borderWidth={1}
              borderRadius="md"
              bg="gray.50"
              shadow="md"
              _hover={{ bg: 'teal.50' }}
              transition="background-color 0.2s"
            >
              <Heading as="h3" size="md" mb={2}>
                {evaluacion.titulo}
              </Heading>
              <Text mb={4}>{evaluacion.descripcion}</Text>
              <Badge colorScheme="teal" mb={4}>
                Periodo: {evaluacion.periodo}
              </Badge>
              <Box mt={4}>
                <Button
                  colorScheme="teal"
                  onClick={() => {
                    setRetroalimentacion(null);
                    setEvaluacionSeleccionada(evaluacion);
                  }}
                >
                  Responder
                </Button>
              </Box>
            </Box>
          ))
        ) : (
          <Text mt={6} color="gray.500">
            No hay evaluaciones disponibles
          </Text>
        )}
      </Stack>

      {/* Formulario para responder la evaluación */}
      {evaluacionSeleccionada && !retroalimentacion && (
        <Box
          p={6}
          mt={6}
          borderWidth={1}
          borderRadius="md"
          bg="white"
          shadow="lg"
        >
          <Heading as="h3" size="lg" mb={4} color="teal.500">
            Respondiendo: {evaluacionSeleccionada.titulo}
          </Heading>
          <form onSubmit={handleSubmit}>
            {evaluacionSeleccionada.preguntas.map(pregunta => (
              <Box
                key={pregunta._id}
                mt={4}
                p={4}
                borderWidth={1}
                borderRadius="md"
                bg="gray.50"
              >
                <Text fontSize="lg" fontWeight="bold" mb={2}>
                  {pregunta.pregunta}
                </Text>
                <RadioGroup
                
                  onChange={value => handleChangeRespuesta(pregunta._id, value)}
                >
                  <Stack direction="column" spacing={2}>
                    {pregunta.opciones.map((opcion, index) => (
                      <Radio key={index} value={opcion.texto}>
                        {opcion.texto}
                      </Radio>
                    ))}
                  </Stack>
                </RadioGroup>
              </Box>
            ))}
            <Button type="submit" colorScheme="teal" mt={6} width="full">
              Enviar Respuestas
            </Button>
          </form>
        </Box>
      )}
    </Box>
  );
};
