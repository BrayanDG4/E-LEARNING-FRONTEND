import React, { useState } from 'react';
import {
  Box,
  Stack,
  Radio,
  RadioGroup,
  Button,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { enviarRespuestasEvaluacion } from '../../features/evaluacionSlice'; // Crear acción para enviar respuestas

export const ResponderEvaluacion = ({ evaluacion }) => {
  const dispatch = useDispatch();
  const [respuestas, setRespuestas] = useState({});

  const handleRespuesta = (preguntaId, respuesta) => {
    setRespuestas({
      ...respuestas,
      [preguntaId]: respuesta,
    });
  };

  const handleSubmit = () => {
    dispatch(
      enviarRespuestasEvaluacion({
        evaluacionId: evaluacion._id,
        respuestas,
      })
    );
  };

  return (
    <Box p={4}>
      <Text fontSize="2xl" fontWeight="bold">
        {evaluacion.titulo}
      </Text>
      <Text>{evaluacion.descripcion}</Text>
      <VStack spacing={4} mt={4}>
        {evaluacion.preguntas.map((pregunta, index) => (
          <Box key={pregunta._id} p={4} borderWidth="1px" rounded="md">
            <Text fontWeight="bold">
              Pregunta {index + 1}: {pregunta.pregunta}
            </Text>
            <RadioGroup
              onChange={value => handleRespuesta(pregunta._id, value)}
            >
              <Stack>
                {pregunta.opciones.map((opcion, idx) => (
                  <Radio key={idx} value={opcion.texto}>
                    {opcion.texto}
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
          </Box>
        ))}
      </VStack>
      <Button mt={4} colorScheme="green" onClick={handleSubmit}>
        Enviar Respuestas
      </Button>
    </Box>
  );
};
