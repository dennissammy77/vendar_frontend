'use client'
import { UserContext } from '@/components/providers/user.context';
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Text, Flex, Icon, Image, Input, FormControl, FormErrorMessage, FormLabel, Checkbox, Select, useToast, HStack, } from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useContext, useState } from 'react';

import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { MANY_NEW_STORE_PRODUCTS } from '@/app/api/product/route';
import { FETCH_ACTIVE_STORE_ID } from '@/components/hooks/SELECT_ACTIVE_STORE';
import { CHEVRON_RIGHT_ICON, DELETE_ICON, DISCARD_ICON, DONE_ICON } from '@/components/lib/constants/icons';
import {IMPORT_MANY_PRODUCTS_FROM_EXCEL} from '@/components/hooks/import/EXCEL_IMPORT.js';
import { BASE_BRAND, PRIMARY_BRAND, SECONDARY_BRAND, TERTIARY_BRAND } from '@/components/lib/constants/theme';
import Excel from 'exceljs';

function Page() {
    const router = useRouter();
    const toast = useToast();
    const {user} = useContext(UserContext);
    
    const searchParams = useSearchParams();
    const USER_ID =  user?.data?.data?._id || searchParams.get('uid');
    const STORE_ID = FETCH_ACTIVE_STORE_ID() || searchParams.get('store_id');
    const schema = yup.object().shape({
        approval_status: yup.boolean().required(),
    });

    const [EXTRACTED_DATA_STATUS, SET_EXTRACTED_DATA_STATUS]=useState(false);
    let [EXTRACTED_DATA, SET_EXTRACTED_DATA]=useState([]);
    const {
        handleSubmit,
        register,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = async (data) => {
        SET_EXTRACTED_DATA_STATUS(true)
        toast({ title: 'Wait', description: `We are processing your file`, status: 'loading', variant:'left-accent', position: 'top-left', isClosable: true });
        try {
            // const result = await IMPORT_MANY_PRODUCTS_FROM_EXCEL(data,USER_ID,STORE_ID);
            // SET_EXTRACTED_DATA(result)
            // console.log(result)
            const FILE = data.products[0];
            if(!FILE){
                return {
                    error: true,
                    message: 'You did not provide any files to extract products from.'
                }
            }
            const wb = new Excel.Workbook();
            const reader = new FileReader();
            reader.readAsArrayBuffer(FILE);
            reader.onload = async() => {
                const buffer = reader.result;
                let IMPORTED_PRODUCTS_DATA = [];
                wb.xlsx.load(buffer).then((workbook) => {
                    console.log(workbook, 'workbook instance');
                    workbook.eachSheet((sheet, id) => {
                        sheet.eachRow((row, rowIndex) => {
                            const row_data = {
                                name: row.values[1],
                                description: row.values[2],
                                price: row.values[3],
                                buying_price: row.values[4],
                                category: row.values[5],
                                items: row.values[6],
                                discount: false,
                                discountprice: 0,
                                store_ref: STORE_ID,
                                product_image: '',
                                owner_ref_id: USER_ID
                            }
                            if(rowIndex === 1 || rowIndex === 2){
                                return;
                            }
                            IMPORTED_PRODUCTS_DATA.push(row_data);
                        });
                    });
                    SET_EXTRACTED_DATA(IMPORTED_PRODUCTS_DATA)
                });
            };
            toast({ title: 'Success!:Products extracted successfully', description: ``, status: 'success', variant:'left-accent', position: 'top-left', isClosable: true });
        } catch (error) {
            toast({ title: 'Error!:Products failed to be extracted', description: ``, status: 'success', variant:'left-accent', position: 'top-left', isClosable: true });
            SET_EXTRACTED_DATA_STATUS(false)
            return ;
        }
        // const file = data.products[0];
        // const wb = new Excel.Workbook();
        // const reader = new FileReader();


        // reader.readAsArrayBuffer(file);
        // reader.onload = async() => {
        //     const buffer = reader.result;
        //     wb.xlsx.load(buffer).then((workbook) => {
        //         console.log(workbook, 'workbook instance');
        //         let tempArr = [];
        //         workbook.eachSheet((sheet, id) => {
        //             sheet.eachRow((row, rowIndex) => {
        //                 const template = {
        //                     name: row.values[1],
        //                     description: row.values[2],
        //                     price: row.values[3],
        //                     buying_price: row.values[4],
        //                     category: row.values[5],
        //                     items: row.values[6],
        //                     discount: false,
        //                     discountprice: 0,
        //                     store_ref: STORE_ID,
        //                     product_image: '',
        //                     owner_ref_id: USER_ID
        //                 }
        //                 if(rowIndex === 1 || rowIndex === 2){
        //                     return;
        //                 }
        //                 tempArr.push(template);
        //             });
        //         });
        //         const payload = {
        //             publish_status: true,
        //             approval_status: data?.approval_status,
        //             products: tempArr
        //         }
        //         try {
        //             MANY_NEW_STORE_PRODUCTS(payload,STORE_ID,USER_ID).then((response)=>{
        //               if(response?.data?.error === true){
        //                   return toast({ title: `Error!:${response?.data?.message}`, description: ``, status: 'warning', variant:'left-accent', position: 'top-left', isClosable: true });
        //               }
        //               toast({ title: 'Success!:Products created successfully', description: ``, status: 'success', variant:'left-accent', position: 'top-left', isClosable: true });
        //               router.back();
        //               return ;
        //             }).catch((err)=>{
        //                 return toast({ title: `${err}`, description: ``, status: 'error', variant:'left-accent', position: 'top-left', isClosable: true });
        //             })
        //         } catch (error){
        //               console.log(error)
        //             setError("root", {
        //               message: error,
        //             });
        //             return;
        //         }
        //     });
        // };
    }
    const HANDLE_CLEAR_EXTRACTED_DATA=()=>{
        SET_EXTRACTED_DATA_STATUS(false);
        SET_EXTRACTED_DATA([])
    }
    const HANDLE_REMOVE_ITEM=(index)=>{
        SET_EXTRACTED_DATA(EXTRACTED_DATA?.slice(0,index).concat(EXTRACTED_DATA.slice(index+1, EXTRACTED_DATA.length)));
    }
    const HANDLE_ADD_ITEMS_TO_STORE=async()=>{
        const payload = {
            publish_status: true,
            approval_status: true,
            products: EXTRACTED_DATA
        }
        try {
            MANY_NEW_STORE_PRODUCTS(payload,STORE_ID,USER_ID).then((response)=>{
                if(response?.data?.error === true){
                    return toast({ title: `Error!:${response?.data?.message}`, description: ``, status: 'warning', variant:'left-accent', position: 'top-left', isClosable: true });
                }
                toast({ title: 'Success!:Products created successfully', description: ``, status: 'success', variant:'left-accent', position: 'top-left', isClosable: true });
                router.back();
                return ;
            }).catch((err)=>{
                return toast({ title: `${err}`, description: ``, status: 'error', variant:'left-accent', position: 'top-left', isClosable: true });
            })
        } catch (error){
                console.log(error)
            setError("root", {
                message: error,
            });
            return;
        }
    }
  return (
    <Box>
        <Text fontWeight='bold' fontSize='32px'>Import New Products</Text>
        <Breadcrumb spacing='8px' separator={<CHEVRON_RIGHT_ICON color='gray.500' />}>
            <BreadcrumbItem>
                <BreadcrumbLink href={`/dashboard/home/?uid=${USER_ID}&store_id=${STORE_ID}`}>Home</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
                <BreadcrumbLink href={`/dashboard/products?uid=${USER_ID}&store_id=${STORE_ID}`}>Products</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink >New</BreadcrumbLink>
            </BreadcrumbItem>
        </Breadcrumb>
        {EXTRACTED_DATA_STATUS?
            <Box>
                <Flex align='center' w='full' justify={'space-between'} boxShadow='md' p='2' borderRadius={'md'} my='2'>
                    <Text>{EXTRACTED_DATA?.length} items found</Text>
                    <HStack>
                        <Button leftIcon={<DELETE_ICON/>} variant={'outline'} color={SECONDARY_BRAND} onClick={(()=>HANDLE_CLEAR_EXTRACTED_DATA())}>Clear</Button>
                        <Button leftIcon={<DONE_ICON/>} bg={PRIMARY_BRAND} color={BASE_BRAND} onClick={(()=>HANDLE_ADD_ITEMS_TO_STORE())}>Add Items</Button>
                    </HStack>
                </Flex>
                {EXTRACTED_DATA?.map((product,index)=>{
                    return(
                        <Box boxShadow={'sm'} my='2' p='2' borderRadius={'md'}>
                            <Text>Name: {product?.name}</Text>
                            <Text>Price: {product?.price}</Text>
                            <Text>Buying price: {product?.buying_price}</Text>
                            <Text>Category: {product?.category}</Text>
                            <HStack spacing={'2'} align='center'>
                                <Button leftIcon={<DELETE_ICON/>} variant={'outline'} size='sm' w='full' onClick={(()=>{HANDLE_REMOVE_ITEM(index)})}>remove</Button>
                            </HStack>
                        </Box>
                    )
                })}
            </Box>
            :
            <>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl my={'4'} isRequired>
                        <FormLabel>Select file</FormLabel>
                        <Input disabled={isSubmitting} type='file' {...register('products')} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
                        <FormErrorMessage mt="1">{errors.products?.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl mt='1' isRequired>
                        <FormLabel>Approve Products</FormLabel>
                        <Select disabled={isSubmitting} {...register('approval_status')}>
                            <option value={true}>Yes, I want all products to be approved</option>
                            <option value={false}>No, Do not approve products</option>
                        </Select>
                        {errors.approval_status && ( <Text fontSize={'sm'} color='red'>{errors.approval_status.message}</Text>)}
                    </FormControl>
                    {isSubmitting?
                        <Button isLoading loadingText='Saving products' variant='ghost' borderRadius={'md'} w='full'/>
                        :
                        <Button type='submit' variant={'filled'} borderRadius={'md'} bg='#05232e' mt='2' w='full' color='#fff' onClick={handleSubmit}>Create products</Button>
                    }
                </form>
                <Button variant={'ghost'} borderRadius={'md'} mt='2' w='full' onClick={(()=>{router.back()})} leftIcon={<DISCARD_ICON />}>Discard</Button>
            </>
        }
    </Box>
  )
}

export default Page;