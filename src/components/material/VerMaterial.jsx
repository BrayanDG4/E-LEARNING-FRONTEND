import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getMaterialById } from '../../features/materialSlice';
import { Box, Heading, Text } from '@chakra-ui/react';

export const VerMaterial = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { material } = useSelector(state => state.materials);

    useEffect(() => {
        dispatch(getMaterialById(id));
    }, [dispatch, id]);

    return (
        <Box>
            <Heading>{material.nombre}</Heading>
            <Text>{material.descripcion}</Text>
            <a href={material.archivo} download>Descargar</a>
        </Box>
    );
}
