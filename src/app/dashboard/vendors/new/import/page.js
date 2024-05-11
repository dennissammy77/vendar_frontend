'use client'
import { UserContext } from '@/components/providers/user.context';
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Text, Flex, Icon, Image, Input, FormControl, FormErrorMessage, FormLabel, Checkbox, Select, useToast, } from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useContext, useState } from 'react';

import { useForm } from 'react-hook-form';
import Excel from 'exceljs';
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { MANY_NEW_STORE_PRODUCTS } from '@/app/api/product/route';
import { FETCH_ACTIVE_STORE_ID } from '@/components/hooks/SELECT_ACTIVE_STORE';
import { CHEVRON_RIGHT_ICON, DISCARD_ICON } from '@/components/lib/constants/icons';
import { MANY_NEW_STORE_STAKEHOLDER_ACCOUNT } from '@/app/api/auth/route';

function Page() {
    const router = useRouter();
    const toast = useToast();
    const {user} = useContext(UserContext);
    
    const searchParams = useSearchParams();
    const USER_ID =  user?.data?.data?._id || searchParams.get('uid');
    const STORE_ID = FETCH_ACTIVE_STORE_ID() || searchParams.get('store_id');
    const schema = yup.object().shape({

    });

    const {
        handleSubmit,
        register,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        //resolver: yupResolver(schema)
    });

    const onSubmit = async (data) => {
        console.log('data', data);
        const file = data.vendors[0];
        const wb = new Excel.Workbook();
        const reader = new FileReader();


        reader.readAsArrayBuffer(file);
        reader.onload = async() => {
            const buffer = reader.result;
            wb.xlsx.load(buffer).then((workbook) => {
                let tempArr = [];
                workbook.eachSheet((sheet, id) => {
                    sheet.eachRow((row, rowIndex) => {
                        const template = {
                            name: row.values[1],
                            username: row.values[2],
                            email: row.values[3],
                            mobile: row.values[4],
                            password: row.values[5],
                            account_type: "vendor",
                            profile_image_url: "",
                        }
                        if(rowIndex === 1 || rowIndex === 2){
                            return;
                        }
                        tempArr.push(template);
                    });
                });
                const payload = {
                    stakeholders: tempArr
                }
                try {
                    MANY_NEW_STORE_STAKEHOLDER_ACCOUNT(payload,USER_ID,STORE_ID).then((response)=>{
                      if(response?.data?.error === true){
                          return toast({ title: `Error!:${response?.data?.message}`, description: ``, status: 'warning', variant:'left-accent', position: 'top-left', isClosable: true });
                      }
                      toast({ title: 'Success!:Vendors created successfully', description: ``, status: 'success', variant:'left-accent', position: 'top-left', isClosable: true });
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
        <Text fontWeight='bold' fontSize='32px'>Import New Vendors</Text>
        <Breadcrumb spacing='8px' separator={<CHEVRON_RIGHT_ICON color='gray.500' />}>
            <BreadcrumbItem>
                <BreadcrumbLink href={`/dashboard/home/?uid=${USER_ID}&store_id=${STORE_ID}`}>Home</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
                <BreadcrumbLink href={`/dashboard/vendors?uid=${USER_ID}&store_id=${STORE_ID}`}>Vendors</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink >New</BreadcrumbLink>
            </BreadcrumbItem>
        </Breadcrumb>
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl my={'4'} isRequired>
                <FormLabel>Select file</FormLabel>
                <Input disabled={isSubmitting} type='file' {...register('vendors')} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
                <FormErrorMessage mt="1">{errors.vendors?.message}</FormErrorMessage>
            </FormControl>
            {/**
             * 
            <FormControl mt='1' isRequired>
                <FormLabel>Approve Vendors</FormLabel>
                <Select disabled={isSubmitting} {...register('approval_status')}>
                    <option value={true}>Yes, I want all products to be approved</option>
                    <option value={false}>No, Do not approve products</option>
                </Select>
                {errors.approval_status && ( <Text fontSize={'sm'} color='red'>{errors.approval_status.message}</Text>)}
            </FormControl>
             */}
            {isSubmitting?
                <Button isLoading loadingText='Saving vendors' variant='ghost' borderRadius={'md'} w='full'/>
                :
                <Button type='submit' variant={'filled'} borderRadius={'md'} bg='#05232e' mt='2' w='full' color='#fff' onClick={handleSubmit}>Create Vendors</Button>
            }
        </form>
        <Button variant={'ghost'} borderRadius={'md'} mt='2' w='full' onClick={(()=>{router.back()})} leftIcon={<DISCARD_ICON />}>Discard</Button>
    </Box>
  )
}

export default Page;