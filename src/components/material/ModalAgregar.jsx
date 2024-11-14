import React, { useState, useEffect } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Icon,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  Select,
  Tooltip,
} from '@chakra-ui/react';
import { VscAdd } from 'react-icons/vsc';
import { useDispatch, useSelector } from 'react-redux';
import { createMaterial } from '../../features/materialSlice';
import { getGrados } from '../../features/gradoSlice'; // Asegúrate de importar esto

export const ModalAgregar = () => {
  const dispatch = useDispatch();
  const { grados } = useSelector(state => state.grados); // Obtener los grados del estado global

  const [isModalOpen, setIsModalOpen] = useState(false);
  const initialValues = {
    titulo: '',
    descripcion: '',
    archivoUrl: '',
    tipo: '', // Nuevo campo para el tipo de material
    periodo: '',
    grado: '', // Nuevo campo para seleccionar el grado
  };
  const [indice, setIndice] = useState(initialValues);

  useEffect(() => {
    dispatch(getGrados()); // Obtener los grados cuando se monte el componente
  }, [dispatch]);

  const handleModalOpen = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIndice(initialValues);
  };

  const handleSave = () => {
    dispatch(createMaterial(indice));
    setIsModalOpen(false);
    setIndice(initialValues);
  };

  return (
    <>
      <Tooltip hasArrow label="Agregar Nuevo Material" placement="auto">
        <IconButton
          colorScheme="messenger"
          _dark={{
            bg: 'messenger.500',
            color: 'white',
            _hover: { bg: 'messenger.600' },
          }}
          aria-label="Agregar"
          icon={<Icon as={VscAdd} fontSize="2xl" />}
          variant="solid"
          onClick={handleModalOpen}
        />
      </Tooltip>
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        size="5xl"
        isCentered
      >
        <ModalOverlay />
        <ModalContent _dark={{ bg: 'primary.900' }} borderRadius="none">
          <ModalHeader textAlign="center">REGISTRAR NUEVO MATERIAL</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel fontWeight="semibold">TÍTULO</FormLabel>
              <Input
                placeholder="ESCRIBE EL TÍTULO"
                type="text"
                onChange={e => setIndice({ ...indice, titulo: e.target.value })}
                textTransform="uppercase"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel fontWeight="semibold">DESCRIPCIÓN</FormLabel>
              <Textarea
                placeholder="Escribe la descripcion"
                type="text"
                onChange={e =>
                  setIndice({ ...indice, descripcion: e.target.value })
                }
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel fontWeight="semibold">URL DEL ARCHIVO</FormLabel>
              <Input
                placeholder="ESCRIBE LA URL DEL ARCHIVO"
                type="text"
                onChange={e =>
                  setIndice({ ...indice, archivoUrl: e.target.value })
                }
                textTransform="uppercase"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel fontWeight="semibold">TIPO DE MATERIAL</FormLabel>
              <Select
                placeholder="SELECCIONA EL TIPO DE MATERIAL"
                onChange={e => setIndice({ ...indice, tipo: e.target.value })}
              >
                <option value="PDF">PDF</option>
                <option value="video">Video</option>
                <option value="enlace">Enlace</option>
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel fontWeight="semibold">PERIODO</FormLabel>
              <Select
                placeholder="SELECCIONA EL PERIODO"
                onChange={e =>
                  setIndice({ ...indice, periodo: e.target.value })
                }
              >
                <option value="Primer Periodo">Primer Periodo</option>
                <option value="Segundo Periodo">Segundo Periodo</option>
                <option value="Tercer Periodo">Tercer Periodo</option>
                <option value="Cuarto Periodo">Cuarto Periodo</option>
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel fontWeight="semibold">GRADO</FormLabel>
              <Select
                placeholder="SELECCIONA EL GRADO"
                onChange={e => setIndice({ ...indice, grado: e.target.value })}
              >
                {grados.map(grado => (
                  <option key={grado._id} value={grado._id}>
                    {grado.nombre}
                  </option>
                ))}
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              _dark={{
                bg: 'red.500',
                color: 'white',
                _hover: { bg: 'red.600' },
              }}
              size="lg"
              mr={3}
              onClick={handleModalClose}
              borderRadius="none"
            >
              CANCELAR
            </Button>
            <Button
              colorScheme="messenger"
              _dark={{
                bg: 'messenger.500',
                color: 'white',
                _hover: { bg: 'messenger.600' },
              }}
              size="lg"
              mr={3}
              onClick={handleSave}
              disabled={
                indice.titulo === '' ||
                indice.descripcion === '' ||
                indice.archivoUrl === '' ||
                indice.periodo === '' ||
                indice.grado === ''
              }
              borderRadius="none"
            >
              GUARDAR
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
