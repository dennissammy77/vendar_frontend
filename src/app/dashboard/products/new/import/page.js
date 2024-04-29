'use client'
import { UserContext } from '@/components/providers/user.context';
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Text, Flex, Icon, Image, Input, FormControl, FormErrorMessage, FormLabel, Checkbox, Select, useToast, } from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useContext, useState } from 'react'
import { MdChevronRight } from 'react-icons/md';
import { VscDiscard } from 'react-icons/vsc';

import { useForm } from 'react-hook-form';
import Excel from 'exceljs';
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { MANY_NEW_STORE_PRODUCTS } from '@/app/api/product/route';

function Page() {
    const router = useRouter();
    const toast = useToast();
    const {user} = useContext(UserContext);
    
    const searchParams = useSearchParams();
    const USER_ID =  searchParams.get('uid');
    const store_id = searchParams.get('store_id');
    const schema = yup.object().shape({
        approval_status: yup.boolean().required(),
    });

    const {
        handleSubmit,
        register,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = async (data) => {
        console.log('data', data);
        const file = data.products[0];
        const wb = new Excel.Workbook();
        const reader = new FileReader();


        reader.readAsArrayBuffer(file);
        reader.onload = async() => {
            const buffer = reader.result;
            wb.xlsx.load(buffer).then((workbook) => {
                console.log(workbook, 'workbook instance');
                let tempArr = [];
                workbook.eachSheet((sheet, id) => {
                    sheet.eachRow((row, rowIndex) => {
                        const template = {
                            name: row.values[1],
                            description: row.values[2],
                            price: row.values[3],
                            category: row.values[4],
                            items: row.values[5],
                            discount: false,
                            discountprice: 0,
                            store_ref: store_id,
                            product_image: '',
                            owner_ref_id: row.values[6]
                        }
                        //console.log(template,rowIndex)
                        if(rowIndex === 1 || rowIndex === 2){
                            return;
                        }
                        tempArr.push(template);
                        //console.log(tempArr)
                    });
                });
                const payload = {
                    publish_status: true,
                    approval_status: data?.approval_status,
                    products: tempArr
                }
                console.log(payload)
                try {
                    MANY_NEW_STORE_PRODUCTS(payload,store_id,USER_ID).then((response)=>{
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
            });
        };
    }
  return (
    <Box>
        <Text fontWeight='bold' fontSize='32px'>Import New Products</Text>
        <Breadcrumb spacing='8px' separator={<MdChevronRight color='gray.500' />}>
            <BreadcrumbItem>
                <BreadcrumbLink href={`/dashboard/home/?uid=${user?.data?.data?._id}&store_id=${store_id}`}>Home</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
                <BreadcrumbLink href={`/dashboard/products?uid=${user?.data?.data?._id}&store_id=${store_id}`}>Products</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink >New</BreadcrumbLink>
            </BreadcrumbItem>
        </Breadcrumb>
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl my={'4'} isRequired>
                <FormLabel>Select file</FormLabel>
                <Input disabled={isSubmitting} type='file' {...register('products')} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
                <FormErrorMessage mt="1">{errors.prodcuts?.message}</FormErrorMessage>
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
        <Button variant={'ghost'} borderRadius={'md'} mt='2' w='full' onClick={(()=>{router.back()})} leftIcon={<VscDiscard />}>Discard</Button>
    </Box>
  )
}

export default Page;