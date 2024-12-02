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
  Divider,
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
        .then(res => setRetroalimentacion(res))
        .catch(error => console.error('Error al enviar respuestas:', error));
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
    <Box p={4}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Evaluaciones Interactivas
      </Text>

      <Stack direction="row" spacing={4} mb={4}>
        <FormControl>
          <FormLabel>Filtrar por Asignatura</FormLabel>
          <Select
            placeholder="Selecciona Asignatura"
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
            onChange={e => setFiltroPeriodo(e.target.value)}
          >
            {[...new Set(evaluaciones.map(e => e.periodo))].map(periodo => (
              <option key={periodo} value={periodo}>
                {periodo}
              </option>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {/* Listado de evaluaciones */}
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Evaluaciones Disponibles
      </Text>
      {evaluacionesFiltradas.length > 0 ? (
        evaluacionesFiltradas.map(evaluacion => (
          <Box
            key={evaluacion._id}
            p={4}
            mt={6}
            borderWidth={1}
            borderRadius="md"
            shadow="md"
          >
            <Text fontSize="lg" fontWeight="bold">
              {evaluacion.titulo}
            </Text>
            <Text mb={4}>{evaluacion.descripcion}</Text>
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
        ))
      ) : (
        <Text mt={6}>No hay evaluaciones disponibles</Text>
      )}

      {evaluacionSeleccionada && !retroalimentacion && (
        <Box
          p={4}
          mt={6}
          borderWidth={1}
          borderRadius="md"
          shadow="md"
          bg="white"
        >
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            Respondiendo: {evaluacionSeleccionada.titulo}
          </Text>
          <form onSubmit={handleSubmit}>
            {evaluacionSeleccionada.preguntas.map((pregunta, index) => (
              <Box
                key={pregunta._id}
                p={4}
                mt={4}
                borderWidth={1}
                borderRadius="md"
                bg="white"
              >
                <Text fontWeight="bold" mb={2}>
                  {index + 1}. {pregunta.pregunta}
                </Text>
                <RadioGroup
                  onChange={value => handleChangeRespuesta(pregunta._id, value)}
                >
                  <Stack direction="column" spacing={2}>
                    {pregunta.opciones.map((opcion, index) => (
                      <Radio
                        key={index}
                        value={opcion.texto}
                        colorScheme="teal"
                      >
                        {opcion.texto}
                      </Radio>
                    ))}
                  </Stack>
                </RadioGroup>
              </Box>
            ))}
            <Button type="submit" colorScheme="teal" mt={6} width="100%">
              Enviar Respuestas
            </Button>
          </form>
        </Box>
      )}

      {retroalimentacion && (
        <Box
          p={4}
          mt={6}
          borderWidth={1}
          borderRadius="md"
          shadow="md"
          bg="white"
        >
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            Resultados de la Evaluación
          </Text>
          <Text>
            Puntaje: {retroalimentacion.puntajeObtenido} /{' '}
            {retroalimentacion.puntajeTotal}
          </Text>
          <Text>Porcentaje: {retroalimentacion.porcentaje.toFixed(2)}%</Text>
          {retroalimentacion.retroalimentacion.map((item, index) => (
            <Box
              key={index}
              mt={4}
              p={4}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
            >
              <Text fontWeight="bold">Pregunta: {item.pregunta}</Text>
              <Text>
                Tu respuesta: {item.respuestaEstudiante} -{' '}
                <Text
                  as="span"
                  fontWeight="bold"
                  color={item.esCorrecta ? 'green.500' : 'red.500'}
                >
                  {item.esCorrecta ? 'Correcta' : 'Incorrecta'}
                </Text>
              </Text>
              {!item.esCorrecta && (
                <Text color="gray.600" mt={2}>
                  Respuesta correcta: {item.respuestaCorrecta}
                </Text>
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};
