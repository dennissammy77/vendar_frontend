import { UserContext } from "@/components/providers/user.context";
import { Badge, Box, Flex, HStack, Icon, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { FaInstagram, FaPhone, FaTiktok, FaWhatsapp } from "react-icons/fa";
import { FaLocationDot, FaXTwitter } from "react-icons/fa6";
import { GrFormEdit } from "react-icons/gr";
import { IoMdSettings } from "react-icons/io";
import { MdDeleteOutline, MdEmail } from "react-icons/md";

export default function StoreDetails({store,active_store}){
    const {user} = useContext(UserContext);
    const router = useRouter();
    return(
        <Box bg='#E4F0FC' borderRadius={'md'} boxShadow={'sm'} p='4'>
            <Flex justify={'space-between'}>
                <HStack>
                    <Text fontSize={{base:'lg',md:'x-large'}} fontWeight={'bold'} my='2'>{store?.name}</Text>
                    <HStack>
                        <Badge fontSize="xs" colorScheme={store?.payment_plan === 'free'? 'orange' : 'green'}>{store?.payment_plan}</Badge>
                        {active_store === store?._id ? <Badge fontSize="xs" colorScheme={'purple'}>active</Badge> : null }
                    </HStack>
                </HStack>
                {user?.data?.data?.account_type === 'vendor'? null : 
                    <HStack align='center' gap='2'>
                        <HStack color='gray.600'  _hover={{color:'#4E2FD7'}} cursor={'pointer'} pr='1' onClick={(()=>{router.push(`/dashboard/stores/view?uid=${user?.data?.data?._id}&&store_id=${store?._id}`)})}>
                            <Text fontSize={'md'} fontWeight={'bold'}>manage</Text>
                            <Icon boxSize='5' as={IoMdSettings} cursor='pointer'/>
                        </HStack>
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
            {user?.data?.data?.account_type === 'vendor'? null : 
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