'use client'

// util
import { UserContext } from "@/components/providers/user.context";
import { useRouter } from "next/navigation";
import { useContext } from "react";
// styling
import { Badge, Box, Flex, HStack, Icon, Text } from "@chakra-ui/react";
// icon
import { EMAIL_ICON, INSTAGRAM_ICON, LOCATION_ICON, MANAGE_ICON, PHONE_ICON, TIKTOK_ICON, TWITTER_ICON, WHATSAPP_ICON } from "@/components/lib/constants/icons";
import Link from "next/link";
// api
// component

export default function StoreDetails({store,active_store}){
    const {user} = useContext(UserContext);
    const USER_ID = user?.data?.data?._id;
    const USER_DATA = user?.data?.data;
    return(
        <Box bg='#E4F0FC' borderRadius={'md'} boxShadow={'sm'} p='4' my='2'>
            <Flex justify={'space-between'}>
                <HStack>
                    <Text fontSize={{base:'lg',md:'x-large'}} fontWeight={'bold'} my='2'>{store?.name}</Text>
                    <HStack>
                        {active_store === store?._id ? <Badge fontSize="xs" colorScheme={'purple'}>active</Badge> : null }
                    </HStack>
                </HStack>
                {USER_DATA?.account_type === 'vendor'? null : 
                    <HStack align='center' gap='2'>
                        <Link href={`/dashboard/stores/view?uid=${USER_ID}&store_id=${store?._id}`}>
                            <HStack color='gray.600'  _hover={{color:'#4E2FD7'}} cursor={'pointer'} pr='1'>
                                <Text fontSize={'md'} fontWeight={'bold'}>manage</Text>
                                <Icon boxSize='5' as={MANAGE_ICON} cursor='pointer'/>
                            </HStack>
                        </Link>
                        {/**
                         * 
                        <Icon color='gray.600' boxSize='6' as={GrFormEdit} _hover={{color:'#4E2FD7'}} cursor='pointer' onClick={(()=>{router.push(`/dashboard/stores/edit?uid=${user?.data?.data?._id}&&store_id=${store?._id}`)})}/>
                         */}
                    </HStack>
                }
            </Flex>
            <Text my='2'>{store?.description}</Text>
            {/**Contact */}
            <Box>
                <HStack my='3'>
                    <Icon color='gray.600' boxSize='3' as={EMAIL_ICON}/>
                    <Text fontWeight={'bold'} fontSize='sm' color='gray.600' ml='2'>{store?.email}</Text>
                </HStack>
                <HStack my='3'>
                    <Icon color='gray.600' boxSize='3' as={PHONE_ICON}/>
                    <Text fontWeight={'bold'} fontSize='sm' color='gray.600' ml='2'>{store?.mobile}</Text>
                </HStack>
                <HStack my='3'>
                    <Icon color='gray.600' boxSize='3' as={LOCATION_ICON}/>
                    <Text fontWeight={'bold'} fontSize='sm' color='gray.600' ml='2'>{store?.location}</Text>
                </HStack>
                <HStack my='3'>
                    <Icon color='gray.600' boxSize='3' as={INSTAGRAM_ICON}/>
                    <Text fontWeight={'bold'} fontSize='sm' color='gray.600' ml='2'>{store?.instagram_url}</Text>
                </HStack>
                <HStack my='3'>
                    <Icon color='gray.600' boxSize='3' as={TWITTER_ICON}/>
                    <Text fontWeight={'bold'} fontSize='sm' color='gray.600' ml='2'>{store?.twitter_url}</Text>
                </HStack>
                <HStack my='3'>
                    <Icon color='gray.600' boxSize='3' as={WHATSAPP_ICON}/>
                    <Text fontWeight={'bold'} fontSize='sm' color='gray.600' ml='2'>{store?.whatsapp_url}</Text>
                </HStack>
                <HStack my='3'>
                    <Icon color='gray.600' boxSize='3' as={TIKTOK_ICON}/>
                    <Text fontWeight={'bold'} fontSize='sm' color='gray.600' ml='2'>{store?.tiktok_url}</Text>
                </HStack>
            </Box>
            {USER_DATA?.account_type === 'vendor'? null : 
                <>
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
                        <Text fontWeight={'bold'}>Transactions:</Text>
                        <Text>{store?.transactions?.length}</Text>
                    </HStack>
                    {/**
                     * 
                    <HStack spacing='2' my='2' fontSize='md'>
                        <Text fontWeight={'bold'}>PickUps:</Text>
                        <Text>{store?.pickups?.length}</Text>
                    </HStack>
                     */}
                    <HStack spacing='2' my='2' fontSize='md'>
                        <Text fontWeight={'bold'}>Shelves:</Text>
                        <Text>{store?.shelves}</Text>
                    </HStack>
                </>
            }
            {/**
             * 
            <Box my='4'>
                <Text fontWeight={'bold'}>Most Popular Items</Text>
                <SimpleGrid minChildWidth='100px' spacing='10px'>
                    <Box>
                        <Image boxShadow={'md'} src={'https://imgaz1.chiccdn.com/thumb/view/oaupload/newchic/images/AE/BC/3f9766a9-050c-4f94-b801-b133b73ccb46.jpg?s=360x480'} alt='product_image' objectFit={'cover'} borderRadius={'md'} w='100%' h='100px' my='2'/>
                        <Text fontSize={'sm'} >T-Shirt Black</Text>
                    </Box>
                    <Box>
                        <Image boxShadow={'md'} src={'https://imgaz1.chiccdn.com/thumb/view/oaupload/newchic/images/AE/BC/3f9766a9-050c-4f94-b801-b133b73ccb46.jpg?s=360x480'} alt='product_image' objectFit={'cover'} borderRadius={'md'} w='100%' h='100px' my='2'/>
                        <Text fontSize={'sm'} >T-Shirt Black</Text>
                    </Box>
                    <Box>
                        <Image boxShadow={'md'} src={'https://imgaz1.chiccdn.com/thumb/view/oaupload/newchic/images/AE/BC/3f9766a9-050c-4f94-b801-b133b73ccb46.jpg?s=360x480'} alt='product_image' objectFit={'cover'} borderRadius={'md'} w='100%' h='100px' my='2'/>
                        <Text fontSize={'sm'} >T-Shirt Black</Text>
                    </Box>
                    <Box>
                        <Image boxShadow={'md'} src={'https://imgaz1.chiccdn.com/thumb/view/oaupload/newchic/images/AE/BC/3f9766a9-050c-4f94-b801-b133b73ccb46.jpg?s=360x480'} alt='product_image' objectFit={'cover'} borderRadius={'md'} w='100%' h='100px' my='2'/>
                        <Text fontSize={'sm'} >T-Shirt Black</Text>
                    </Box>
                </SimpleGrid>
            </Box>
             */}
        </Box>
    )
}