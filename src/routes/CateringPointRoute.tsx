import { Box, Button, Flex, Heading, Select, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import { format, parseISO } from 'date-fns'
import { ListRow, ReportRow } from '@/types';

import { useForm } from "react-hook-form";
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import axios from 'axios';

export const CateringPointRoute = () => {

    const { cpId } = useParams();

    const [clientId, setClientId] = useState('0')

    const getClient = async (id?: string) => {
        return (await axios.get('/data/getCateringPointData', {
            params: {
                cpId: id
            }
        })).data
    }

    const getClients = async () => {
        return (await axios.get("/data/allClients")).data
    }

    const getDataByCateringPoint = async (cpId: string, clientId: string) => {
        return (await axios.get('/data/cateringPoint', {
            params: {
                clientId: clientId,
                cpId: cpId,
            }
        })).data
    }

    const { data: clientData } = useQuery<ListRow>({ queryKey: ['get-client'], queryFn: () => getClient(cpId) })
    const { data: cateringPointsData } = useQuery<ListRow[]>({ queryKey: ['get-cp'], queryFn: getClients })


    const { data } = useQuery<ReportRow[]>({ queryKey: ['get-client', { cpId, clientId }], queryFn: () => getDataByCateringPoint(cpId!, clientId) })

    const { register, handleSubmit, setValue } = useForm();

    const onSubmit = ({ clientId }: { clientId: string }) => {
        setClientId(clientId)
    }

    const reset = () => {
        setValue("clientId", "0")
        setClientId("0");
    }

    if (!clientData)
        return null;

    return (
        <Box padding={ 8 }>
            <Heading>Клиент { clientData.name }</Heading>

            <form onSubmit={ handleSubmit(onSubmit) }>
                <Flex align="center" marginTop={ 8 } gap={ 8 }>
                    <Text fontSize='sm'>Клиенты</Text>
                    <Box w="30%">
                        <Select size='sm' {...register("clientId")}>
                            <option value={ 0 } >Все клиенты</option>
                            { cateringPointsData?.map(e => (
                                <option value={ e.id } key={ e.id }>{ e.name }</option>
                            )) }
                        </Select>
                    </Box>
                </Flex>

                <Flex gap={ 4 } marginTop={ 8 }>
                    <Button colorScheme='teal' variant='solid' type="submit">
                        Применить
                    </Button>
                    <Button colorScheme='teal' variant='ghost' onClick={ reset }>
                        Сбросить
                    </Button>
                </Flex>
            </form>

            <TableContainer marginTop={ 4 }>
                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th>Дата</Th>
                            <Th>Организация</Th>
                            <Th isNumeric>День недели</Th>
                            <Th>Событие</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        { data?.map(e => (
                            <Tr key={ e.date + e.name + e.dayOfWeek }>
                                <Td>{ format(parseISO(e.date), 'dd.MM.yyyy') }</Td>
                                <Td>{ e.name }</Td>
                                <Td isNumeric>{ e.dayOfWeek }</Td>
                                <Td>{ e.action }</Td>
                            </Tr>
                        )) }
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    )
}