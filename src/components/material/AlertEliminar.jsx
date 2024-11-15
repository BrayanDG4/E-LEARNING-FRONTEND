import React, { useState } from 'react';
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    IconButton,
    Button,
    Icon,
    Flex,
    Tooltip,
} from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { MdDelete } from 'react-icons/md';
import { AiOutlineAlert } from 'react-icons/ai';
import { deleteMaterial, getMaterials } from '../../features/materialSlice'; // Verifica que esta importación esté correcta
import { ToastChakra } from '../../helpers/toast'; // Asegúrate de tener esta importación para los mensajes

export const AlertEliminar = ({ row }) => {
    const dispatch = useDispatch();
    const [isOpenAlert, setIsOpenAlert] = useState(false);

    const handleOpenAlert = () => {
        setIsOpenAlert(true);
    }

    const handleCloseAlert = () => {
        setIsOpenAlert(false);
    }

    const handleDelete = (id) => {
        dispatch(deleteMaterial(id))
            .unwrap()
            .then(() => {
                ToastChakra('Material eliminado', 'El material ha sido eliminado correctamente', 'success', 1500, 'bottom');
                dispatch(getMaterials()); // Actualiza la lista de materiales después de la eliminación
                setIsOpenAlert(false);
            })
            .catch(() => {
                ToastChakra('Error', 'No se pudo eliminar el material', 'error', 1500, 'bottom');
            });
    }

    return (
        <>
            <Tooltip hasArrow label='Eliminar' placement='auto'>
                <IconButton
                    aria-label="Eliminar"
                    onClick={handleOpenAlert}
                    icon={<Icon as={MdDelete} />}
                    fontSize="2xl"
                    colorScheme="red"
                    variant={'ghost'}
                    _dark={{ color: "white", _hover: { bg: "red.800" } }}
                    ml={2}
                />
            </Tooltip>
            <AlertDialog
                motionPreset='slideInBottom'
                onClose={handleCloseAlert}
                isOpen={isOpenAlert}
                isCentered
                size="xl"
            >
                <AlertDialogOverlay
                    bg="rgba(0,0,0,0.7)"
                    backdropFilter='auto'
                    backdropBlur='2px'
                />

                <AlertDialogContent py={6} _dark={{ bg: "primary.900" }} borderRadius="none">
                    <Flex textAlign="center" justifyContent="center" p={2}>
                        <Icon as={AiOutlineAlert} fontSize="9xl" color="red.500" />
                    </Flex>
                    <AlertDialogHeader textAlign="center" fontSize="3xl">¿Está seguro de eliminar? </AlertDialogHeader>
                    <AlertDialogBody textAlign="center" fontSize="xl">
                        ¡No podrás revertir esto!
                    </AlertDialogBody>
                    <AlertDialogFooter justifyContent="center" fontWeight="normal">
                        <Button
                            onClick={handleCloseAlert}
                            colorScheme="red"
                            size="lg"
                            _dark={{ bg: "red.600", color: "white", _hover: { bg: "red.800" } }}
                            borderRadius="none"
                        >
                            CANCELAR
                        </Button>
                        <Button
                            colorScheme="green"
                            ml={3}
                            onClick={() => handleDelete(row._id)}
                            size="lg"
                            _dark={{ bg: "green.600", color: "white", _hover: { bg: "green.800" } }}
                            borderRadius="none"
                        >
                            ¡SÍ BÓRRALO!
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
