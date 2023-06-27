import { ListRow } from "@/types";
import {Box, Heading, List, ListItem, UnorderedList } from "@chakra-ui/react"
import {useQuery} from "@tanstack/react-query";

import axios from "axios"


export const RootRoute = () => {

    const getClients = async () => {
        return (await axios.get("/data/allClients")).data
    }

    const getCateringPoints = async () => {
        return (await axios.get("/data/allCateringPoints")).data
    }

    const { data: clientData } = useQuery<ListRow[]>({ queryKey: ['get-clients'], queryFn: getClients })
    const { data: cateringPointsData } = useQuery<ListRow[]>({ queryKey: ['get-cp'], queryFn: getCateringPoints })

    return (
        <div>
            <Box padding={ 12 }>
                <Heading>Все клиенты</Heading>

                { clientData && (
                    <List marginTop={ 12 }>
                        { clientData.map(e => (
                            <ListItem fontSize={ 18 } key={ e.id } marginBottom={ 2 }>
                                <a href={`/client/${e.id}`}>{ e.name }</a>
                            </ListItem>
                        )) }
                    </List>
                ) }
            </Box>
            <Box padding={ 12 }>
                <Heading>Все организации</Heading>

                { cateringPointsData && (
                    <List marginTop={ 12 }>
                        { cateringPointsData.map(e => (
                            <ListItem fontSize={ 18 } key={ e.id } marginBottom={ 2 }>
                                <a href={`/cp/${e.id}`}>{ e.name }</a>
                            </ListItem>
                        )) }
                    </List>
                ) }
            </Box>
        </div>
    )
}