import { FETCH_ACTIVE_STORE_ID } from '@/components/hooks/SELECT_ACTIVE_STORE';
import { ADD_ICON, CHEVRON_RIGHT_ICON, SEARCH_ICON } from '@/components/lib/constants/icons'
import { UserContext } from '@/components/providers/user.context';
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Flex, Icon, Input, InputGroup, InputLeftElement, Text } from '@chakra-ui/react'
import { useSearchParams } from 'next/navigation';
import React, { useContext } from 'react'

function Page() {
    const {user} = useContext(UserContext);
    const searchParams = useSearchParams();
    const STORE_ID = FETCH_ACTIVE_STORE_ID() || searchParams.get('store_id');

    return (
        <Box>
            <Flex justify={'space-between'} align={{base:'',lg:'center'}} flexDirection={{base:'column',lg:'row'}}>
                {/**
                 * Products tag & management goes here
                 * Search field, New product and product imports
                 */}
                <Text fontWeight='bold' fontSize='32px'>PickUps</Text>
                <Flex align='center' >
                    <InputGroup>
                        <InputLeftElement pointerEvents='none'>
                            <Icon as={SEARCH_ICON} color='gray.500' ml='2'/>
                        </InputLeftElement>
                        <Input type='search' placeholder={'Search products'} mx='2' onChange={((e)=>{set_search_query(e.target.value)})}/>
                    </InputGroup>
                    <Link href={`/dashboard/pickups/new?uid=${user?.data?.data?._id}&store_id=${STORE_ID}`}>
                        <Button bgColor={'#4E2FD7'} color='#ffffff' leftIcon={<ADD_ICON />} >New</Button>
                    </Link>
                </Flex>
            </Flex>
            <Breadcrumb spacing='8px' separator={<CHEVRON_RIGHT_ICON color='gray.500' />} my='2'>
                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/home/new?uid=${user?.data?.data?._id}&store_id=${STORE_ID}`}>Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink fontSize={'sm'} color='gray.400' fontWeight={'bold'}>pickups</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
        </Box>
    )
}

export default Page