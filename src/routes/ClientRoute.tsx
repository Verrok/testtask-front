import { Box, Button, Flex, Heading, Select, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import { format, parseISO } from 'date-fns'
import { ListRow, ReportRow } from '@/types';

import { useForm } from "react-hook-form";
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import axios from 'axios';

export const ClientRoute = () => {

    const { clientId } = useParams();

    const [cpId, setCpId] = useState('0')


    const getClient = async (id?: string) => {
        return (await axios.get('/data/getClientData', {
            params: {
                clientId: id
            }
        })).data
    }

    const getCateringPoints = async () => {
        return (await axios.get('/data/allCateringPoints')).data
    }

    const getDataByClient = async (id: string, id2: string) => {
        return (await axios.get('/data/client', {
            params: {
                clientId: id,
                cpId: id2,
            }
        })).data
    }

    const { data: clientData } = useQuery<ListRow>({ queryKey: ['get-client'], queryFn: () => getClient(clientId) })
    const { data: cateringPointsData } = useQuery<ListRow[]>({ queryKey: ['get-cp'], queryFn: getCateringPoints })


    const { data } = useQuery<ReportRow[]>({ queryKey: ['get-client', { clientId, cpId }], queryFn: () => getDataByClient(clientId!, cpId) })

    const { register, handleSubmit, setValue } = useForm();

    const onSubmit = ({ cpId }: { cpId: string }) => {
        setCpId(cpId)
    }

    const reset = () => {
        setValue("cpId", "0")
        setCpId("0");
    }

    if (!clientData)
        return null;

    return (
        <Box padding={ 8 }>
            <Heading>Клиент { clientData.name }</Heading>

            <form onSubmit={ handleSubmit(onSubmit) }>
                <Flex align="center" marginTop={ 8 } gap={ 8 }>
                    <Text fontSize='sm'>Организации</Text>
                    <Box w="30%">
                        <Select size='sm' {...register("cpId")}>
                            <option value={ 0 } >Все организации</option>
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