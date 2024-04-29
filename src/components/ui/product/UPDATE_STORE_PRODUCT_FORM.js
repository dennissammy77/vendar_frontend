'use client'
import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup";
import { Button, FormControl, FormLabel, HStack, Icon, Input, Select, Text, useToast, Textarea, Flex } from '@chakra-ui/react';
import { CiWarning } from 'react-icons/ci';
import { useRouter } from 'next/navigation';
import { UPDATE_STORE_PRODUCT } from '@/app/api/product/route';
import Link from 'next/link';


export default function UPDATE_STORE_PRODUCT_FORM(props) {

    const USER_ID = props?.USER_ID;
    const STORE_ID = props?.STORE_ID;
    const PRODUCT_ID = props?.PRODUCT_DATA?._id;

    const schema = yup.object().shape({
        name: yup.string().required(),
        description: yup.string().required(),
        price: yup.number().required(),
        category: yup.string().required(),
        items: yup.number().required(),
        discount: yup.boolean(),
        discountprice: yup.number(),
        product_image: yup.string(),
    });
 
    const toast = useToast();
    const router = useRouter()

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: props?.PRODUCT_DATA?.name,
            description: props?.PRODUCT_DATA?.description,
            price: props?.PRODUCT_DATA?.price,
            category: props?.PRODUCT_DATA?.category,
            items: props?.PRODUCT_DATA?.items,
            discount: props?.PRODUCT_DATA?.discount,
            discountprice: props?.PRODUCT_DATA?.discountprice,
            product_image: props?.PRODUCT_DATA?.product_image,
        }
    });

    const onSubmit = async(data) => {
        const FLAG = 'details';
        try {
          await UPDATE_STORE_PRODUCT(data,STORE_ID,USER_ID,PRODUCT_ID,FLAG).then((response)=>{
            if(response?.data?.error === true){
                return toast({ title: `Error!:${response?.data?.message}`, description: ``, status: 'warning', variant:'left-accent', position: 'top-left', isClosable: true });
            }
            toast({ title: 'Success!:Product updated successfully', description: ``, status: 'success', variant:'left-accent', position: 'top-left', isClosable: true });
            setTimeout(()=>{
                router.back()
            },2000)
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
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl mt='1' isRequired>
                <FormLabel>Name</FormLabel>
            <Input disabled={isSubmitting} {...register('name')} type='text' placeholder='Nike Air Force' variant='filled'/>
            {errors.name && ( <Text fontSize={'sm'} color='red'>{errors.name.message}</Text>)}
            </FormControl>
            <FormControl mt='1' isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea disabled={isSubmitting} {...register('description')} type='text' placeholder='Briefly describe the product' variant='filled' h='200px'/>
                {errors.description && ( <Text fontSize={'sm'} color='red'>{errors.description.message}</Text>)}
            </FormControl>
            <FormControl mt='1' isRequired>
                <FormLabel>Price</FormLabel>
                <Input disabled={isSubmitting} {...register('price')} type='number' placeholder='200' variant='filled'/>
                {errors.price && ( <Text fontSize={'sm'} color='red'>{errors.price.message}</Text>)}
            </FormControl>
            <FormControl mt='1' isRequired>
                <FormLabel>Items</FormLabel>
                <Input disabled={isSubmitting} {...register('items')} type='number' placeholder='number of items' variant='filled'/>
                {errors.items && ( <Text fontSize={'sm'} color='red'>{errors.items.message}</Text>)}
            </FormControl>
            <FormControl isRequired>
                <FormLabel my='2' fontWeight={'bold'}>Category</FormLabel>
                <Select {...register("category")} placeholder='Select the category'>
                    <option value='apparel'>Apparel</option>
                    <option value='cosmetics'>Cosmetics</option>
                    <option value='stationary'>Stationary</option>
                    <option value='food&beverages'>Food&Beverages</option>
                    <option value='gifts'>Gifts</option>
                </Select>
                {errors.category && (<FormErrorMessage>{errors.category.message}</FormErrorMessage>)}
            </FormControl>
            <Flex p='4' borderRadius='sm' boxShadow='sm' align='center' justify={'space-between'} color='gray.300' my='4'>
                <Text fontWeight={'bold'}>Ownership management</Text>
                <Link href={`/dashboard/products/edit/management?uid=${USER_ID}&store_id=${STORE_ID}&product_id=${PRODUCT_ID}`}>
                    <Button variant={'ghost'} color='gray.300'>Transfer</Button>
                </Link>
            </Flex>
            {errors.root && 
                <HStack color='red.400' bg='red.200' borderRadius={'md'} p='2' mt='2' align={'center'}>
                    <Icon as={CiWarning} boxSize='4'/>
                    <Text>{errors.root.message}</Text>
                </HStack>
            }
            {isSubmitting?
                <Button isLoading loadingText='creating your product' variant='ghost' borderRadius={'md'} w='full'/>
            :
                <Button type='submit' variant={'filled'} borderRadius={'md'} bg='#05232e' mt='2' w='full' color='#fff' onClick={handleSubmit}>Update Product</Button>
            }
      </form>
    )
}
