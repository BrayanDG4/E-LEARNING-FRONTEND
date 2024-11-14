import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteEvaluacion, getEvaluations } from '../../features/evaluacionSlice';
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Button,
    IconButton,
    useDisclosure,
} from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';

export const AlertEliminar = ({ row }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = React.useRef();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = () => {
        setIsLoading(true);
        dispatch(deleteEvaluacion(row._id))
            .unwrap()
            .then(() => {
                dispatch(getEvaluations()); // Recarga la lista de evaluaciones
                setIsLoading(false);
                onClose();
            })
            .catch(() => {
                setIsLoading(false);
            });
    };

    return (
        <>
            <IconButton
                colorScheme="red"
                icon={<FaTrash />}
                onClick={onOpen}
                aria-label="Eliminar"
                ml={2}
            />
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Eliminar Evaluación
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            ¿Estás seguro de que deseas eliminar esta evaluación? No podrás deshacer esta acción.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancelar
                            </Button>
                            <Button
                                colorScheme="red"
                                onClick={handleDelete}
                                ml={3}
                                isLoading={isLoading}
                            >
                                Eliminar
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
};
