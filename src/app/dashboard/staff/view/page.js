'use client'
import { FetchUsersShop } from '@/app/api/auth/route';
import { UserContext } from '@/components/providers/user.context';
import { Avatar, Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Flex, HStack, Icon, Input, InputGroup, InputLeftElement, Spinner, Text, useQuery } from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useContext } from 'react'
import { FiSearch } from 'react-icons/fi'
import { IoMdAdd } from 'react-icons/io'
import { MdChevronRight } from 'react-icons/md';

export default function Page() {
    const {user} = useContext(UserContext);
    const router = useRouter();

    const searchParams = useSearchParams()
    const store_id = searchParams.get('store_id');

    const {data, isLoading} = useQuery({
        queryKey: ['staff_data', {store_id}],
        queryFn: () => FetchUsersShop(store_id)
    })
    //const data = staff_data?.data?.data;
    console.log(data);
    if(isLoading){
        return (
            <Flex flexDirection={'column'} justifyContent={'center'} align='center' h='60vh'>
                <Spinner />
                <Text fontSize={'md'} fontWeight={'bold'} color='gray.300' my='2'>Fetching store staff</Text>
            </Flex>
        )
    }
    return (
        <Box>
            <Flex justify={'space-between'} align={{base:'',lg:'center'}} flexDirection={{base:'column',lg:'row'}}>
                <Text fontWeight='bold' fontSize='32px'>Staff</Text>
                <Flex align='center' >
                    <InputGroup>
                        <InputLeftElement pointerEvents='none'>
                            <Icon as={FiSearch} color='gray.500' ml='2'/>
                        </InputLeftElement>
                        <Input type='search' placeholder={'Search staff'} mx='2' onChange={((e)=>{set_search_query(e.target.value)})}/>
                    </InputGroup>
                    <Button variant={'filled'} borderRadius={'md'} bg='#4E2FD7' color='#fff' leftIcon={<IoMdAdd />} onClick={(()=>{router.push(`/dashboard/stores/new?uid=${user?.data?.data?._id}`)})}>New</Button>
                </Flex>
            </Flex>
            <Breadcrumb spacing='8px' separator={<MdChevronRight color='gray.500' />} my='2'>
                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/home/?uid=${user?.data?.data?._id}`}>Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/stores/?uid=${user?.data?.data?._id}`}>Store-Staff</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink fontSize={'sm'} color='gray.400' fontWeight={'bold'}>#{store_id}</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            
            {data?.map((staff)=>{
                return(
                    <StaffItem key={staff._id} staff={staff} />
                )
            })}
        </Box>
    )
}

const StaffItem=({staff})=>{
    return(
      <HStack spacing='2' bg='#E4F0FC' p='2' borderRadius={'5'}>
        <Avatar name={staff?.name} size='sm' src={staff?.profile_image_url}/>
        <Box>
          <Text fontSize={'sm'} fontWeight={'bold'}>{staff?.name}</Text>
          <Text fontSize={'xs'}>{staff?.shop_admin_account_ref?.role}</Text>
        </Box>
      </HStack>
    )
  }