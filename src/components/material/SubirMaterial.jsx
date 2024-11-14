import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createMaterial } from '../../features/materialSlice';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    Textarea,
    useToast
} from '@chakra-ui/react';

export const SubirMaterial = () => {
    const dispatch = useDispatch();
    const toast = useToast();
    const { user } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        archivoUrl: '',
        periodo: ''
    });

    const { titulo, descripcion, archivoUrl, periodo } = formData;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createMaterial({ ...formData, profesor: user._id }))
            .unwrap()
            .then(() => {
                toast({
                    title: 'Material creado.',
                    description: "El material ha sido creado exitosamente.",
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
                setFormData({
                    titulo: '',
                    descripcion: '',
                    archivoUrl: '',
                    periodo: ''
                });
            })
            .catch((error) => {
                toast({
                    title: 'Error.',
                    description: error.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            });
    };

    return (
        <Box p={4} bg="white" shadow="md" rounded="md">
            <form onSubmit={handleSubmit}>
                <FormControl isRequired>
                    <FormLabel>Título</FormLabel>
                    <Input
                        type="text"
                        name="titulo"
                        value={titulo}
                        onChange={handleChange}
                        placeholder="Título del material"
                    />
                </FormControl>
                <FormControl mt={4} isRequired>
                    <FormLabel>Descripción</FormLabel>
                    <Textarea
                        name="descripcion"
                        value={descripcion}
                        onChange={handleChange}
                        placeholder="Descripción del material"
                    />
                </FormControl>
                <FormControl mt={4} isRequired>
                    <FormLabel>Enlace del archivo</FormLabel>
                    <Input
                        type="text"
                        name="archivoUrl"
                        value={archivoUrl}
                        onChange={handleChange}
                        placeholder="Enlace del archivo"
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
                <Button mt={4} colorScheme="teal" type="submit">Subir Material</Button>
            </form>
        </Box>
    );
};