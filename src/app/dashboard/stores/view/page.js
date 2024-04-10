'use client'
import { FETCH_STORE_DATA } from '@/app/api/shop/route';
import { UserContext } from '@/components/providers/user.context';
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Flex, HStack, Icon, Menu, MenuButton, MenuItem, MenuList, Spinner, Text, useDisclosure, VStack} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useContext } from 'react'
import { FaInstagram, FaPhone, FaTiktok, FaWhatsapp } from 'react-icons/fa';
import { FaLocationDot, FaWandMagicSparkles, FaXTwitter } from 'react-icons/fa6';
import { GrFormEdit } from 'react-icons/gr';
import { HiChevronDown } from 'react-icons/hi2';
import { MdChevronRight, MdDeleteOutline, MdEmail } from 'react-icons/md';
import UserTabs from './components/UsersTab';
import DELETE_STORE_ALERT from '@/components/ui/store/DELETE_STORE_ALERT.js';
import Link from "next/link";


function Page() {
    const {user} = useContext(UserContext);
    
    //const USER_ID = user?.data?.data?._id;

    const DELETE_STORE_ALERT_DISCLOSURE = useDisclosure()

    const router = useRouter();

    const searchParams = useSearchParams()
    const store_id = searchParams.get('store_id');
    const USER_ID = searchParams.get('uid');

    const {data, isLoading} = useQuery({
        queryKey: ['store_data', {store_id}],
        queryFn: () => FETCH_STORE_DATA(store_id,USER_ID)
    })
    const store = data?.data?.data;
    if(isLoading){
        return (
            <Flex flexDirection={'column'} justifyContent={'center'} align='center' h='60vh'>
                <Spinner />
                <Text fontSize={'md'} fontWeight={'bold'} color='gray.300' my='2'>Setting up your store</Text>
            </Flex>
        )
    }

    if (data?.data?.error){
        return (
            <Flex flexDirection={'column'} justifyContent={'center'} align='center' h='60vh'>
                <Text fontSize={'large'} fontWeight={'bold'} color='gray.300' my='2'>{data?.data?.message}</Text>
                <VStack spacing='2'>
                    <Button type='submit' variant={'filled'} borderRadius={'md'} bg='#05232e' my='4' w='full' color='#fff' leftIcon={<FaWandMagicSparkles />} onClick={(()=>{router.push(`/dashboard/stores/new?uid=${USER_ID}`)})}>Create Store</Button>
                    <Link cursor={'pointer'} href={`/dashboard/stores?uid=${USER_ID}`} textDecoration={'1px solid underline'}>Back to Stores</Link>
                </VStack>
            </Flex>
        )
    }
    return (
        <Box>
            <DELETE_STORE_ALERT isOpen={DELETE_STORE_ALERT_DISCLOSURE?.isOpen} onClose={DELETE_STORE_ALERT_DISCLOSURE?.onClose} USER_ID={USER_ID} STORE_ID={store_id}/>
            <Flex align='center' justifyContent={'space-between'}>
                <Text fontWeight='bold' fontSize='32px'>Store Details</Text>
                <Menu>
                    <MenuButton as={Button} rightIcon={<HiChevronDown />} bgColor={'#4E2FD7'} color='#ffffff'> Action </MenuButton>
                    <MenuList>
                        <MenuItem icon={<GrFormEdit style={{fontSize:'16px'}}/>} onClick={(()=>{router.push(`/dashboard/stores/edit?uid=${user?.data?.data?._id}&&store_id=${store?._id}`)})}>Edit</MenuItem>
                        <MenuItem icon={<MdDeleteOutline style={{fontSize:'16px'}}/>} onClick={DELETE_STORE_ALERT_DISCLOSURE?.onOpen}>Delete</MenuItem>
                    </MenuList>
                </Menu>
            </Flex>
            <Breadcrumb spacing='8px' separator={<MdChevronRight color='gray.500' />} my='2'>
                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/home/?uid=${user?.data?.data?._id}`}>Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/stores/?uid=${user?.data?.data?._id}`}>Stores</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink fontSize={'sm'} color='gray.400' fontWeight={'bold'}>#{store_id}</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <Box bg='#E4F0FC' borderRadius={'md'} boxShadow={'sm'} p='4' mb='2'>
                <Flex justify={'space-between'}>
                    <HStack>
                        <Text fontSize={'x-large'} fontWeight={'bold'} my='2'>{store?.name}</Text>
                    </HStack>
                </Flex>
                <Text my='2'>{store?.description}</Text>
                <Box>
                    <HStack my='3'>
                        <Icon color='gray.600' boxSize='3' as={MdEmail}/>
                        <Text fontWeight={'bold'} fontSize='sm' color='gray.600' ml='2'>{store?.email}</Text>
                    </HStack>
                    <HStack my='3'>
                        <Icon color='gray.600' boxSize='3' as={FaPhone}/>
                        <Text fontWeight={'bold'} fontSize='sm' color='gray.600' ml='2'>{store?.mobile}</Text>
                    </HStack>
                    <HStack my='3'>
                        <Icon color='gray.600' boxSize='3' as={FaLocationDot}/>
                        <Text fontWeight={'bold'} fontSize='sm' color='gray.600' ml='2'>{store?.location}</Text>
                    </HStack>
                    <HStack my='3'>
                        <Icon color='gray.600' boxSize='3' as={FaInstagram}/>
                        <Text fontWeight={'bold'} fontSize='sm' color='gray.600' ml='2'>{store?.instagram_url}</Text>
                    </HStack>
                    <HStack my='3'>
                        <Icon color='gray.600' boxSize='3' as={FaXTwitter}/>
                        <Text fontWeight={'bold'} fontSize='sm' color='gray.600' ml='2'>{store?.twitter_url}</Text>
                    </HStack>
                    <HStack my='3'>
                        <Icon color='gray.600' boxSize='3' as={FaWhatsapp}/>
                        <Text fontWeight={'bold'} fontSize='sm' color='gray.600' ml='2'>{store?.whatsapp_url}</Text>
                    </HStack>
                    <HStack my='3'>
                        <Icon color='gray.600' boxSize='3' as={FaTiktok}/>
                        <Text fontWeight={'bold'} fontSize='sm' color='gray.600' ml='2'>{store?.tiktok_url}</Text>
                    </HStack>
                </Box>
                <HStack spacing='2' my='2' fontSize='md'>
                    <Text fontWeight={'bold'}>Staff:</Text>
                    <Text>{store?.staff?.length}</Text>
                </HStack>
                <HStack spacing='2' my='2' fontSize='md'>
                    <Text fontWeight={'bold'}>Vendors:</Text>
                    <Text>{store?.vendors?.length}</Text>
                </HStack>
                <HStack spacing='2' my='2' fontSize='md'>
                    <Text fontWeight={'bold'}>Products:</Text>
                    <Text>{store?.products?.length}</Text>
                </HStack>
                <HStack spacing='2' my='2' fontSize='md'>
                    <Text fontWeight={'bold'}>Shelves:</Text>
                    <Text>{store?.shelves}</Text>
                </HStack>
            </Box>
            {/**Veiw users */}
            <UserTabs store={store}/>
        </Box>
    )
}

export default Page;