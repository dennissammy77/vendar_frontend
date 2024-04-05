'use client'
import { FetchUsersShop } from '@/app/api/auth/route';
import { UserContext } from '@/components/providers/user.context';
import { Avatar, Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Flex, HStack, Icon, Input, InputGroup, InputLeftElement, Spinner, Text } from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useContext, useEffect } from 'react'
import { FiSearch } from 'react-icons/fi'
import { IoMdAdd } from 'react-icons/io'
import { MdChevronRight } from 'react-icons/md';
import { useQuery } from '@tanstack/react-query';
import { TbUserEdit } from "react-icons/tb";
import { TiUserDeleteOutline } from "react-icons/ti";


export default function Page() {
    const {user} = useContext(UserContext);
    const router = useRouter();

    const [search_query, set_search_query] = React.useState('');

    const searchParams = useSearchParams()
    const store_id = searchParams.get('store_id');

    const {data, isLoading} = useQuery({
        queryKey: ['staff_data',{store_id,search_query}],
        queryFn: () => FetchUsersShop(store_id)
    })
    const staff_data = data?.data?.data;
    
    if(isLoading){
        return (
            <Flex flexDirection={'column'} justifyContent={'center'} align='center' h='60vh'>
                <Spinner />
                <Text fontSize={'md'} fontWeight={'bold'} color='gray.300' my='2'>Fetching staff data...</Text>
            </Flex>
        )
    }

    return (
        <Box>
            <Flex justify={'space-between'} align={{base:'',lg:'center'}} flexDirection={{base:'column',lg:'row'}} mb='4'>
                <Text fontWeight='bold' fontSize='32px'>Staff</Text>
                <Flex align='center' >
                    <InputGroup>
                        <InputLeftElement pointerEvents='none'>
                            <Icon as={FiSearch} color='gray.500' ml='2'/>
                        </InputLeftElement>
                        <Input type='search' placeholder={'Search staff'} mx='2' onChange={((e)=>{set_search_query(e.target.value)})}/>
                    </InputGroup>
                    <Button variant={'filled'} borderRadius={'md'} bg='#4E2FD7' color='#fff' leftIcon={<IoMdAdd />} onClick={(()=>{router.push(`/dashboard/staff/new?uid=${user?.data?.data?._id}&&store_id=${store_id}`)})}>New</Button>
                </Flex>
            </Flex>
            {staff_data?.length === 0 && (
                <Flex flexDirection={'column'} justifyContent={'center'} align='center' h='60vh'>
                    <Text fontSize={'md'} fontWeight={'bold'} color='gray.300' my='2'>No Data Found</Text>
                </Flex>
            )}
            {staff_data && staff_data?.map((staff)=>{
                return(
                    <StaffItem key={staff._id} staff={staff} />
                )
            })}
        </Box>
    )
}

const StaffItem=({staff})=>{
    return(
        <Flex align='center' my='2' justify='space-between' p='2' borderBottom={'1px solid'} borderColor={'gray.200'}>
            <HStack spacing='2'>
                <Avatar name={staff?.name} size='sm' src={staff?.profile_image_url}/>
                <Box>
                <   Text fontSize={'sm'} fontWeight={'bold'}>{staff?.name}</Text>
                    <Text fontSize={'xs'}>{staff?.shop_admin_account_ref?.role}</Text>
                </Box>
            </HStack>
            <HStack spacing='4' align='center'>
                <Icon as={TbUserEdit} boxSize='6' cursor='pointer' _hover={{color:'#4E2FD7'}}/>
                <Icon as={TiUserDeleteOutline} boxSize='6' cursor='pointer' _hover={{color:'red.400'}}/>
            </HStack>
        </Flex>
    )
  }