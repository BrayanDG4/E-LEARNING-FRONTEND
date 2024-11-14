import React from 'react';
import {
  Box,
  Text,
  Heading,
  Button,
  VStack,
  Icon,
  Image,
  useColorModeValue,
} from '@chakra-ui/react';
import { RiBook2Fill, RiFileList2Line } from 'react-icons/ri';
import { MdAssignmentTurnedIn } from 'react-icons/md';
import { Link } from 'react-router-dom';

const InicioEstudiante = () => {
  const bgGradient = useColorModeValue(
    'linear(to-r, blue.200, teal.500)',
    'linear(to-r, gray.700, gray.900)'
  );

  return (
    <Box
      minHeight="100vh"
      bgGradient={bgGradient}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={6}
    >
      <VStack
        spacing={6}
        textAlign="center"
        bg="white"
        _dark={{ bg: 'gray.800' }}
        p={8}
        rounded="lg"
        boxShadow="xl"
      >
        <Heading as="h1" size="xl" color="teal.500">
          ¡Bienvenido, Estudiante!
        </Heading>
        <Text fontSize="lg" color="gray.600" _dark={{ color: 'gray.300' }}>
          Aquí puedes encontrar tus materiales de estudio y evaluaciones.
          ¡Continúa aprendiendo y alcanzando tus metas!
        </Text>

        <Image
          src="https://via.placeholder.com/300x150.png?text=Bienvenido+Estudiante"
          alt="Bienvenido"
          borderRadius="md"
        />

        <VStack spacing={4} width="100%">
          <Link to="/ebr/estudiante/materiales" style={{ width: '100%' }}>
            <Button
              leftIcon={<Icon as={RiFileList2Line} />}
              colorScheme="teal"
              size="lg"
              width="100%"
            >
              Mis Materiales
            </Button>
          </Link>

          <Link
            to="/ebr/estudiante/evaluaciones-estudiante"
            style={{ width: '100%' }}
          >
            <Button
              leftIcon={<Icon as={MdAssignmentTurnedIn} />}
              colorScheme="blue"
              size="lg"
              width="100%"
            >
              Mis Evaluaciones
            </Button>
          </Link>
        </VStack>

        <Text fontSize="sm" color="gray.500" mt={4}>
          Recuerda revisar tu progreso y estar al tanto de nuevas actividades.
        </Text>
      </VStack>
    </Box>
  );
};

export default InicioEstudiante;
