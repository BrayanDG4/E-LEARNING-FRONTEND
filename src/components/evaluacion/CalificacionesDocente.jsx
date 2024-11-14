import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getTodasLasCalificaciones,
  updateEvaluacion,
} from '../../features/evaluacionSlice';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Input,
  Select,
  HStack,
  Button,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { EditIcon, ViewIcon } from '@chakra-ui/icons';

export const CalificacionesDocente = () => {
  const dispatch = useDispatch();
  const {
    calificaciones = [],
    isLoading,
    isError,
  } = useSelector(state => state.evaluaciones || {});

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCalificaciones, setFilteredCalificaciones] = useState([]);
  const [filtroEstudiante, setFiltroEstudiante] = useState('');
  const [filtroEvaluacion, setFiltroEvaluacion] = useState('');

  const [selectedCalificacion, setSelectedCalificacion] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getTodasLasCalificaciones()); // Despacha la acción para obtener las calificaciones
  }, [dispatch]);

  useEffect(() => {
    let data = calificaciones;

    if (filtroEstudiante) {
      data = data.filter(calificacion =>
        calificacion.estudiante.nombre
          .toLowerCase()
          .includes(filtroEstudiante.toLowerCase())
      );
    }

    if (filtroEvaluacion) {
      data = data.filter(calificacion =>
        calificacion.evaluacion.titulo
          .toLowerCase()
          .includes(filtroEvaluacion.toLowerCase())
      );
    }

    if (searchTerm) {
      data = data.filter(
        calificacion =>
          calificacion.estudiante.nombre
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          calificacion.evaluacion.titulo
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCalificaciones(data);
  }, [calificaciones, searchTerm, filtroEstudiante, filtroEvaluacion]);

  const handleView = calificacion => {
    setSelectedCalificacion(calificacion);
    setIsViewModalOpen(true);
  };

  const handleEdit = calificacion => {
    setSelectedCalificacion(calificacion);
    setIsEditModalOpen(true);
  };

  const handleUpdateCalificacion = () => {
    dispatch(updateEvaluacion(selectedCalificacion))
      .unwrap()
      .then(() => {
        setIsEditModalOpen(false);
      });
  };

  if (isLoading) {
    return <Text>Cargando calificaciones...</Text>;
  }

  if (isError) {
    return <Text>Error al cargar las calificaciones</Text>;
  }

  return (
    <Box p={4}>
      <Text fontSize="2xl" fontWeight="bold">
        Calificaciones de los Estudiantes
      </Text>

      {/* Filtros y Búsqueda */}
      <HStack spacing={4} mt={4} mb={4}>
        <Input
          placeholder="Buscar por estudiante o evaluación"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <Select
          placeholder="Filtrar por estudiante"
          value={filtroEstudiante}
          onChange={e => setFiltroEstudiante(e.target.value)}
        >
          {[...new Set(calificaciones.map(c => c.estudiante.nombre))].map(
            nombre => (
              <option key={nombre} value={nombre}>
                {nombre}
              </option>
            )
          )}
        </Select>
        <Select
          placeholder="Filtrar por evaluación"
          value={filtroEvaluacion}
          onChange={e => setFiltroEvaluacion(e.target.value)}
        >
          {[...new Set(calificaciones.map(c => c.evaluacion.titulo))].map(
            titulo => (
              <option key={titulo} value={titulo}>
                {titulo}
              </option>
            )
          )}
        </Select>
      </HStack>

      {/* Tabla de Calificaciones */}
      <Table mt={4}>
        <Thead>
          <Tr>
            <Th>Estudiante</Th>
            <Th>Evaluación</Th>
            <Th>Puntaje Obtenido</Th>
            <Th>Puntaje Total</Th>
            <Th>Porcentaje</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredCalificaciones && filteredCalificaciones.length > 0 ? (
            filteredCalificaciones.map(calificacion => (
              <Tr key={calificacion._id}>
                <Td>{calificacion.estudiante.nombre}</Td>
                <Td>{calificacion.evaluacion.titulo}</Td>
                <Td>{calificacion.puntajeObtenido}</Td>
                <Td>{calificacion.puntajeTotal}</Td>
                <Td>{calificacion.porcentaje}%</Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton
                      aria-label="Ver detalles"
                      icon={<ViewIcon />}
                      onClick={() => handleView(calificacion)}
                    />
                    <IconButton
                      aria-label="Editar calificación"
                      icon={<EditIcon />}
                      onClick={() => handleEdit(calificacion)}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={6} textAlign="center">
                No hay calificaciones disponibles
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>

      {/* Modal Ver */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Detalles de la Calificación</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedCalificacion && (
              <>
                <Text>
                  <strong>Estudiante:</strong>{' '}
                  {selectedCalificacion.estudiante.nombre}
                </Text>
                <Text>
                  <strong>Evaluación:</strong>{' '}
                  {selectedCalificacion.evaluacion.titulo}
                </Text>
                <Text>
                  <strong>Puntaje Obtenido:</strong>{' '}
                  {selectedCalificacion.puntajeObtenido}
                </Text>
                <Text>
                  <strong>Puntaje Total:</strong>{' '}
                  {selectedCalificacion.puntajeTotal}
                </Text>
                <Text>
                  <strong>Porcentaje:</strong> {selectedCalificacion.porcentaje}
                  %
                </Text>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setIsViewModalOpen(false)}>Cerrar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal Editar */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Calificación</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedCalificacion && (
              <>
                <FormControl>
                  <FormLabel>Puntaje Obtenido</FormLabel>
                  <Input
                    type="number"
                    value={selectedCalificacion.puntajeObtenido}
                    onChange={e =>
                      setSelectedCalificacion({
                        ...selectedCalificacion,
                        puntajeObtenido: e.target.value,
                      })
                    }
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>Puntaje Total</FormLabel>
                  <Input
                    type="number"
                    value={selectedCalificacion.puntajeTotal}
                    onChange={e =>
                      setSelectedCalificacion({
                        ...selectedCalificacion,
                        puntajeTotal: e.target.value,
                      })
                    }
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>Porcentaje</FormLabel>
                  <Input
                    type="number"
                    value={selectedCalificacion.porcentaje}
                    onChange={e =>
                      setSelectedCalificacion({
                        ...selectedCalificacion,
                        porcentaje: e.target.value,
                      })
                    }
                  />
                </FormControl>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleUpdateCalificacion} colorScheme="blue">
              Guardar
            </Button>
            <Button onClick={() => setIsEditModalOpen(false)} ml={3}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
