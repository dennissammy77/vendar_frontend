'use client'
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Divider, Flex, FormControl, FormErrorMessage, FormLabel, Icon, Input, InputGroup, InputLeftElement, ListItem, OrderedList, Select, Spinner, Text, UnorderedList, useToast } from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useContext, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { FETCH_STAKEHOLDERS_DATA } from '@/app/api/auth/route';
import { FETCH_PRODUCT_DATA, MOVE_STORE_PRODUCT_TO_STAKEHOLDER } from '@/app/api/product/route';

import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup";
import { MdChevronRight } from 'react-icons/md';
import FAILED_DATA_REQUEST from '@/components/ui/handlers/failed.data.error';
import { UserContext } from '@/components/providers/user.context';
import { FETCH_ACTIVE_STORE_ID } from '@/components/hooks/SELECT_ACTIVE_STORE';
import { BASE_BRAND, TERTIARY_BRAND } from '@/components/lib/constants/theme';
import { DISCARD_ICON, PEOPLE_ICON, SEARCH_ICON } from '@/components/lib/constants/icons';

function Page() {
    // Utils
    const {user} = useContext(UserContext);
    const router = useRouter();
    const toast = useToast();
    const searchParams = useSearchParams();
    // filter options
    const [search_query, set_search_query]=useState('');
    const [page,set_page] = useState(1);
    // config
    const STORE_ID = FETCH_ACTIVE_STORE_ID() || searchParams.get('store_id');
    const USER_ID = user?.data?.data?._id || searchParams.get('uid');
    const PRODUCT_ID = searchParams.get('product_id');
    const ACCOUNT_TYPE = 'vendor';
    // States
    const [SELECTED_VENDOR,SET_SELECTED_VENDOR]=useState('');
    // Functions
    const {data:FETCHED_PRODUCT_DATA} = useQuery({
        queryKey: ['product data', {PRODUCT_ID}],
        queryFn: () => FETCH_PRODUCT_DATA(PRODUCT_ID)
    });

    const {data, isLoading} = useQuery({
        queryKey: ['stakeholders', {STORE_ID,page,search_query}],
        queryFn: () => FETCH_STAKEHOLDERS_DATA(STORE_ID,ACCOUNT_TYPE,page,search_query)
    });
        
    const PRODUCT_DATA =FETCHED_PRODUCT_DATA?.data?.data
    const VENDORS_DATA = data?.data?.data;

    const schema = yup.object().shape({
        vendor: yup.string().length(24, 'User ID Format length validation error').required('Vendor ID is required'),
    });

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async(data) => {
        const ACCOUNT_ID = data?.vendor;
        try {
          await MOVE_STORE_PRODUCT_TO_STAKEHOLDER (STORE_ID,USER_ID,ACCOUNT_ID,PRODUCT_ID).then((response)=>{
            if(response?.data?.error === true){
                return toast({ title: `Error!:${response?.data?.message}`, description: ``, status: 'warning', variant:'left-accent', position: 'top-left', isClosable: true });
            }
            toast({ title: 'Success!:Product updated successfully', description: ``, status: 'success', variant:'left-accent', position: 'top-left', isClosable: true });
            router.back();
            return ;
          }).catch((err)=>{
              return toast({ title: `${err}`, description: ``, status: 'error', variant:'left-accent', position: 'top-left', isClosable: true });
          })
        } catch (error){
            setError("root", {
                message: error,
            });
          return;
        }
    }

//    if (isLoading){
//      return(
//            <Flex flexDirection={'column'} justifyContent={'center'} align='center' h='60vh'>
//                <Spinner />
//                <Text fontSize={'md'} fontWeight={'bold'} color='gray.300' my='2'>Setting up...</Text>
//           </Flex>
//        )
//    }

    if (data?.data?.error){
        return (
            <FAILED_DATA_REQUEST message={data?.data?.message}/>
        )
    }

    // Fetch All store users - done
    // Change Ownership of product
    // Feedback
    // Return to previous page done
    // notify user the contents of the product that will be moved
    return (
        <Box>
            <Text fontWeight='bold' fontSize='32px'>Edit Product Data</Text>
            <Breadcrumb spacing='8px' separator={<MdChevronRight color='gray.500' />} my='4'>
                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/home/?uid=${USER_ID}`}>Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/products/view/?uid=${USER_ID}&store_id=${STORE_ID}&product_id=${PRODUCT_ID}`}>Product</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/products/edit/?uid=${USER_ID}&store_id=${STORE_ID}&product_id=${PRODUCT_ID}`}>edit</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink isCurrentPage>management</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <Box p='2'>
                <Text>The Following information will be transfered and updated:</Text>
                <OrderedList>
                    <ListItem fontWeight={'bold'}>{PRODUCT_DATA?.transactions?.length} Transactions</ListItem>
                    <UnorderedList>
                        <ListItem>KES {PRODUCT_DATA?.transactions?.reduce(function(accumulator, currentValue) { return accumulator + currentValue.payment_total; }, 0)} worth of goods sold.</ListItem>
                    </UnorderedList>
                    <ListItem fontWeight={'bold'}>Current Owner</ListItem>
                    <UnorderedList>
                        <ListItem>Name: {PRODUCT_DATA?.owner_ref_id?.name}</ListItem>
                        <ListItem>Email: {PRODUCT_DATA?.owner_ref_id?.email}</ListItem>
                        <ListItem>Mobile: {PRODUCT_DATA?.owner_ref_id?.mobile}</ListItem>
                        <ListItem>Account: {PRODUCT_DATA?.owner_ref_id?.account_type}</ListItem>
                    </UnorderedList>
                    <ListItem fontWeight={'bold'}>{PRODUCT_DATA?.items} Stock(s)</ListItem>
                </OrderedList>
            </Box>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl isRequired>
                    <FormLabel fontSize={'xl'} fontWeight={'bold'}>Transfer product ownership to Vendor</FormLabel>
                    {SELECTED_VENDOR?.name?.length > 0 ? 
                        <Flex boxShadow={'sm'} bg={TERTIARY_BRAND} borderRadius={'sm'} justify={'space-between'} align={'center'} p='2'>
                            <Text fontWeight={'bold'} fontSize={'lg'}>{SELECTED_VENDOR?.name}</Text>
                            <Text cursor={'pointer'} fontSize={'sm'} onClick={(()=>{SET_SELECTED_VENDOR({})})}>change vendor</Text>
                        </Flex>
                            :
                        <Box position={'relative'}>
                            <InputGroup>
                                <InputLeftElement pointerEvents='none'>
                                    <Icon as={SEARCH_ICON} color='gray.500' ml='2'/>
                                </InputLeftElement>
                                <Input type='search' placeholder={'Search vendors by name'} mx='2' onChange={((e)=>{set_search_query(e.target.value)})}/>
                            </InputGroup>
                            <Box boxShadow={'sm'} p='4' borderRadius={'md'} bg={BASE_BRAND} display={search_query?.length > 0 ? '' : 'none'} position={'absolute'} top={50} left={0} zIndex={200} w='full'>
								{isLoading?
									<Flex flexDirection={'column'} justifyContent={'center'} align='center' h='60vh'>
											<Spinner />
											<Text fontSize={'md'} fontWeight={'bold'} color='gray.300' my='2'>Setting up...</Text>
									</Flex>
								:
									<>
										{VENDORS_DATA?.length === 0? 
											<Flex border='1px solid' borderRadius={'md'} boxShadow={'sm'} p='10' h='40vh' justify={'center'} alignItems={'center'} textAlign={'center'} color='gray.300' fontWeight={'bold'} flexDirection={'column'} w='100%' my='4'>
                                            <Icon as={PEOPLE_ICON} boxSize={'6'}/>
                                            <Text>No vendors found!.</Text>
											</Flex>
										:
											<>
												{VENDORS_DATA?.map((vendor)=>{
													return(
														<Text key={vendor?._id} boxShadow={'sm'} bg={TERTIARY_BRAND} cursor='pointer' my='2' p='2' borderRadius={'sm'} onClick={(()=>{SET_SELECTED_VENDOR(vendor);set_search_query('')})}>
															{vendor?.name}
													</Text>
													)
												})}
											</>
										}
									</>
								} 
                            </Box>
                        </Box>
                    }
                </FormControl>
                {isSubmitting?
                    <Button isLoading loadingText='Transferring your product' variant='ghost' borderRadius={'md'} w='full'/>
                :
                    <Button type='submit' variant={'filled'} borderRadius={'md'} bg='#05232e' mt='2' w='full' color='#fff' onClick={handleSubmit}>Transfer Product</Button>
                }
				<Button variant='ghost' borderRadius={'md'} mt='2' w='full' onClick={(()=>{router.back()})} leftIcon={<DISCARD_ICON/>}>Discard</Button>
            </form>
        </Box>
    )
}

export default Page
