import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createEvaluation, getEvaluations } from '../../features/evaluacionSlice';  // Importa getEvaluations
import { getGrados } from '../../features/gradoSlice'; 
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Select,
    VStack,
    HStack,
    Radio,
    RadioGroup,
    IconButton,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    useToast
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

export const ModalCrearEvaluacion = () => {
    const dispatch = useDispatch();
    const { grados } = useSelector((state) => state.grados);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        periodo: '',
        grado: '', 
        preguntas: []
    });

    const { titulo, descripcion, periodo, grado, preguntas = [] } = formData;

    useEffect(() => {
        dispatch(getGrados());
    }, [dispatch]);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleAddPregunta = () => {
        setFormData((prev) => ({
            ...prev,
            preguntas: [...(prev.preguntas || []), { texto: '', opciones: [{ texto: '', correcta: false }] }]
        }));
    };

    const handleRemovePregunta = (index) => {
        const nuevasPreguntas = preguntas.filter((_, i) => i !== index);
        setFormData({ ...formData, preguntas: nuevasPreguntas });
    };

    const handlePreguntaChange = (index, value) => {
        const nuevasPreguntas = preguntas.map((pregunta, i) =>
            i === index ? { ...pregunta, texto: value } : pregunta
        );
        setFormData({ ...formData, preguntas: nuevasPreguntas });
    };

    const handleAddOpcion = (preguntaIndex) => {
        const nuevasPreguntas = preguntas.map((pregunta, i) =>
            i === preguntaIndex
                ? { ...pregunta, opciones: [...pregunta.opciones, { texto: '', correcta: false }] }
                : pregunta
        );
        setFormData({ ...formData, preguntas: nuevasPreguntas });
    };

    const handleOpcionChange = (preguntaIndex, opcionIndex, value) => {
        const nuevasPreguntas = preguntas.map((pregunta, i) =>
            i === preguntaIndex
                ? {
                      ...pregunta,
                      opciones: pregunta.opciones.map((opcion, j) =>
                          j === opcionIndex ? { ...opcion, texto: value } : opcion
                      )
                  }
                : pregunta
        );
        setFormData({ ...formData, preguntas: nuevasPreguntas });
    };

    const handleCorrectaChange = (preguntaIndex, opcionIndex) => {
        const nuevasPreguntas = preguntas.map((pregunta, i) =>
            i === preguntaIndex
                ? {
                      ...pregunta,
                      opciones: pregunta.opciones.map((opcion, j) => ({
                          ...opcion,
                          correcta: j === opcionIndex
                      }))
                  }
                : pregunta
        );
        setFormData({ ...formData, preguntas: nuevasPreguntas });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Verificar que cada pregunta tenga al menos una opción marcada como correcta
        const preguntasValidas = preguntas.every((pregunta) =>
            pregunta.opciones.some((opcion) => opcion.correcta)
        );

        if (!preguntasValidas) {
            toast({
                title: "Error",
                description: "Cada pregunta debe tener al menos una opción marcada como correcta.",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        const preguntasVerificadas = formData.preguntas.map(pregunta => {
            const opcionesVerificadas = pregunta.opciones.map(opcion => ({
                texto: opcion.texto,
                correcta: opcion.correcta || false 
            }));
    
            const respuestaCorrecta = opcionesVerificadas.find(opcion => opcion.correcta)?.texto || '';
    
            return {
                pregunta: pregunta.texto,
                opciones: opcionesVerificadas,
                respuestaCorrecta
            };
        });
    
        const datosVerificados = {
            ...formData,
            preguntas: preguntasVerificadas
        };
    
        dispatch(createEvaluation(datosVerificados))
            .unwrap()
            .then(() => {
                dispatch(getEvaluations()); // Actualiza la lista de evaluaciones
                setFormData({
                    titulo: '',
                    descripcion: '',
                    periodo: '',
                    grado: '', 
                    preguntas: []
                });
                onClose();
            })
            .catch((error) => {
                console.error('Error al crear la evaluación:', error);
            });
    };

    return (
        <>
            <Button onClick={onOpen} colorScheme="teal">
                Crear Evaluación
            </Button>

            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Crear Nueva Evaluación</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form>
                            <FormControl isRequired>
                                <FormLabel>Título</FormLabel>
                                <Input
                                    type="text"
                                    name="titulo"
                                    value={titulo}
                                    onChange={handleChange}
                                    placeholder="Título de la evaluación"
                                />
                            </FormControl>
                            <FormControl mt={4} isRequired>
                                <FormLabel>Descripción</FormLabel>
                                <Textarea
                                    name="descripcion"
                                    value={descripcion}
                                    onChange={handleChange}
                                    placeholder="Descripción de la evaluación"
                                />
                            </FormControl>
                            <FormControl mt={4} isRequired>
                                <FormLabel>Periodo</FormLabel>
                                <Select
                                    name="periodo"
                                    value={periodo}
                                    onChange={handleChange}
                                    placeholder="Seleccione el periodo"
                                >
                                    <option value="Primer Periodo">Primer Periodo</option>
                                    <option value="Segundo Periodo">Segundo Periodo</option>
                                    <option value="Tercer Periodo">Tercer Periodo</option>
                                    <option value="Cuarto Periodo">Cuarto Periodo</option>
                                </Select>
                            </FormControl>

                            <FormControl mt={4} isRequired>
                                <FormLabel>Grado</FormLabel>
                                <Select
                                    name="grado"
                                    value={grado}
                                    onChange={handleChange}
                                    placeholder="Seleccione el grado"
                                >
                                    {grados.map((grado) => (
                                        <option key={grado._id} value={grado._id}>
                                            {grado.nombre}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>

                            <VStack mt={4} spacing={4} align="start">
                                {preguntas?.map((pregunta, i) => (
                                    <Box key={i} w="full" p={4} border="1px solid" borderColor="gray.200" borderRadius="md">
                                        <HStack justify="space-between">
                                            <FormControl isRequired>
                                                <FormLabel>Pregunta {i + 1}</FormLabel>
                                                <Input
                                                    value={pregunta.texto}
                                                    onChange={(e) => handlePreguntaChange(i, e.target.value)}
                                                    placeholder="Texto de la pregunta"
                                                />
                                            </FormControl>
                                            <IconButton
                                                aria-label="Eliminar pregunta"
                                                icon={<DeleteIcon />}
                                                onClick={() => handleRemovePregunta(i)}
                                                colorScheme="red"
                                            />
                                        </HStack>

                                        {pregunta.opciones.map((opcion, j) => (
                                            <HStack key={j} mt={2} spacing={2}>
                                                <Input
                                                    value={opcion.texto}
                                                    onChange={(e) => handleOpcionChange(i, j, e.target.value)}
                                                    placeholder={`Opción ${j + 1}`}
                                                />
                                                <RadioGroup value={opcion.correcta ? 'true' : 'false'}>
                                                    <Radio
                                                        onChange={() => handleCorrectaChange(i, j)}
                                                        value="true"
                                                        colorScheme="green"
                                                    >
                                                        Correcta
                                                    </Radio>
                                                </RadioGroup>
                                            </HStack>
                                        ))}

                                        <Button mt={2} onClick={() => handleAddOpcion(i)} colorScheme="blue">
                                            Agregar Opción
                                        </Button>
                                    </Box>
                                ))}
                                <Button onClick={handleAddPregunta} colorScheme="blue">
                                    Agregar Pregunta
                                </Button>
                            </VStack>
                        </form>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="teal" onClick={handleSubmit}>
                            Crear Evaluación
                        </Button>
                        <Button variant="ghost" onClick={onClose}>
                            Cancelar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
