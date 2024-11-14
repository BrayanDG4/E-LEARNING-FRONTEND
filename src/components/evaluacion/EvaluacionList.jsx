import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEvaluations, toggleEvaluacionState } from '../../features/evaluacionSlice';
import {
    Box,
    HStack,
    IconButton,
    Icon,
    Stack,
    Text,
    useColorModeValue,
    Button
} from '@chakra-ui/react';
import { MdFilterList } from 'react-icons/md';
import { CgExport } from 'react-icons/cg';
import DataTable, { createTheme } from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';
import { SpinnerComponent } from '../../helpers/spinner';
import { customStyles } from '../../helpers/customStyles';
import { AlertEliminar } from './AlertEliminar';
import { ModalCrearEvaluacion } from './ModalCrearEvaluacion';
import { ModalEditar } from './ModalEditar';

export const EvaluacionList = () => {
    const dispatch = useDispatch();
    const themeTable = useColorModeValue('default', 'solarized');
    const { evaluaciones, isLoading, isError, message } = useSelector((state) => state.evaluaciones);

    useEffect(() => {
        dispatch(getEvaluations());
    }, [dispatch]);

    const handleToggle = (id, habilitada) => {
        dispatch(toggleEvaluacionState({ id, habilitada }))
            .then(() => dispatch(getEvaluations())); // Actualizar la lista de evaluaciones después de cambiar el estado
    };

    if (isLoading) {
        return <SpinnerComponent />;
    }

    if (isError) {
        return <Box>Error: {typeof message === 'object' ? JSON.stringify(message) : message}</Box>;
    }

    const columns = [
        {
            name: 'TÍTULO',
            selector: 'titulo',  // Cambiado a formato de string delimitado
            sortable: true,
            cellExport: row => row.titulo,
            resizable: true
        },
        {
            name: 'PERIODO',
            selector: 'periodo',  // Cambiado a formato de string delimitado
            sortable: true,
            cellExport: row => row.periodo,
            resizable: true
        },
        {
            name: 'ASIGNATURA',
            selector: 'grado.nombre',  // Asegúrate de que sigue el formato adecuado
            sortable: true,
            cellExport: row => row.grado?.nombre || 'Sin asignar',  // Maneja el caso en que grado sea undefined
            resizable: true
        },
        {
            name: 'DESCRIPCIÓN',
            selector: 'descripcion',  // Cambiado a formato de string delimitado
            sortable: true,
            cellExport: row => row.descripcion,
            resizable: true
        },
        {
            name: 'HABILITADA',
            selector: 'habilitada',  // Cambiado a formato de string delimitado
            sortable: true,
            resizable: true,
            center: true,
            cell: row => (row.habilitada ? 'Sí' : 'No'),
        },
        {
            name: 'ACCIONES',
            sortable: true,
            export: false,
            center: true,
            cell: row => (
                <HStack spacing={2}>
                    <Button
                        colorScheme={row.habilitada ? 'red' : 'green'}
                        onClick={() => handleToggle(row._id, !row.habilitada)}
                        size="sm"
                        width="120px"
                    >
                        {row.habilitada ? 'Deshabilitar' : 'Habilitar'}
                    </Button>
                    <ModalEditar row={row} />
                    <AlertEliminar row={row} />
                </HStack>
            ),
            width: '300px'
        }
    ];

    const tableData = {
        columns: columns,
        data: evaluaciones,
    }

    createTheme('solarized', {
        text: {
            primary: '#FFF',
            secondary: '#FFF',
            tertiary: '#FFF',
            error: '#FFF',
            warning: '#FFF',
        },
        background: {
            default: '#1e1e1e',
            hover: '#131516',
            active: '#131516'
        },
        context: {
            background: '#1e1e1e',
            text: '#FFF',
        },
        divider: {
            default: '#FFF opacity 92%',
        },
    });

    return (
        <>
            <Box
                borderRadius="xs"
                boxShadow="base"
                overflow="hidden"
                bg="white"
                _dark={{ bg: "primary.800" }}
            >
                <Stack spacing={4} direction="row" justifyContent="space-between" p={4}>
                    <HStack spacing={4} direction="row">
                        <ModalCrearEvaluacion />
                    </HStack>
                    <HStack spacing={4} direction="row">
                        <IconButton colorScheme="whatsapp" _dark={{ bg: "whatsapp.600", color: "white", _hover: { bg: "whatsapp.700" } }} aria-label='Filters' icon={<Icon as={MdFilterList} fontSize="2xl" />} variant="ghost" rounded="full" />
                        <IconButton colorScheme="messenger" _dark={{ bg: "messenger.600", color: "white", _hover: { bg: "messenger.700" }}} aria-label='Exports' icon={<Icon as={CgExport} fontSize="xl" />} variant="ghost" rounded="full" />
                    </HStack>
                </Stack>
            </Box>
            <Box
                borderRadius="xs"
                overflow="hidden"
                boxShadow={'base'}
                bg="white"
                _dark={{ bg: "primary.800" }}
                mt={2}
                pt={2}
            >
                <DataTableExtensions
                    {...tableData}
                    print={false}
                    exportHeaders={true}
                    filterPlaceholder="BUSCAR"
                    numberOfColumns={7}
                    fileName={'EVALUACIONES'}
                >
                    <DataTable
                        defaultSortField="createdAt"
                        defaultSortAsc={false}
                        defaultSortOrder="desc"
                        pagination={true}
                        paginationIconFirstPage={<Icon as={FiChevronsLeft} boxSize={6} _dark={{ color: "gray.300"}} />}
                        paginationIconLastPage={<Icon as={FiChevronsRight} boxSize={6} _dark={{ color: "gray.300"}} />}
                        paginationIconPrevious={<Icon as={FiChevronLeft} boxSize={6} _dark={{ color: "gray.300", _hover: { color: "white" } }} />}
                        paginationIconNext={<Icon as={FiChevronRight} boxSize={6} _dark={{ color: "gray.300", _hover: { color: "white" } }} />}
                        paginationRowsPerPageOptions={[5 ,10, 25, 50]}
                        paginationPerPage={10}
                        paginationComponentOptions={{
                            rowsPerPageText: 'Filas por pagina:',
                            rangeSeparatorText: 'de',
                            noRowsPerPage: false,
                            selectAllRowsItem: true,
                            selectAllRowsItemText: 'Todos',
                        }}
                        theme={themeTable}
                        customStyles={customStyles}
                        pointerOnHover={true}
                        responsive={true}
                        noDataComponent={<Text mb={4} fontSize="lg">NO DATA FOUND</Text>}
                    />
                </DataTableExtensions>
            </Box>
        </>
    );
};
