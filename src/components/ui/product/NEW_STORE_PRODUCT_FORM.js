'use client'
import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup";
import { Button, FormControl, FormLabel, HStack, Icon, Input, Select, Text, useToast, Textarea } from '@chakra-ui/react';
import { CiWarning } from 'react-icons/ci';
import { UserContext } from '@/components/providers/user.context';
import { useRouter, useSearchParams } from 'next/navigation';
import { NEW_STORE_PRODUCT } from '@/app/api/product/route';
import { FETCH_ACTIVE_STORE_ID } from '@/components/hooks/SELECT_ACTIVE_STORE';


export default function NEW_STORE_PRODUCT_FORM() {
    const {user} = useContext(UserContext);

    const EXISTING_STORES = user?.data?.data?.store_ref;

    const searchParams = useSearchParams()
    const STORE_ID = FETCH_ACTIVE_STORE_ID() || searchParams.get('store_id');
    const USER_ID = user?.data?.data?._id;

    // const [STORE_ID,SET_STORE_ID] =useState(query_store_id)

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
    });

    const onSubmit = async(data) => {
        try {
          await NEW_STORE_PRODUCT(data,STORE_ID,USER_ID).then((response)=>{
            if(response?.data?.error === true){
                return toast({ title: `Error!:${response?.data?.message}`, description: ``, status: 'warning', variant:'left-accent', position: 'top-left', isClosable: true });
            }
            toast({ title: 'Success!:Product created successfully', description: ``, status: 'success', variant:'left-accent', position: 'top-left', isClosable: true });
            setTimeout(()=>{
                router.back()
            },2000)
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
            {/**
             * 
            <FormControl isRequired>
                <FormLabel my='2' fontWeight={'bold'}>Store</FormLabel>
                <Select placeholder='Select the store' onChange={((e)=>{SET_STORE_ID(e.target.value)})}>
                    {EXISTING_STORES?.map((store)=>{
                        return(
                            <option value={store?._id}>{store?.name}</option>
                        )
                    })}
                </Select>
            </FormControl>
             */}
            {errors.root && 
                <HStack color='red.400' bg='red.200' borderRadius={'md'} p='2' mt='2' align={'center'}>
                    <Icon as={CiWarning} boxSize='4'/>
                    <Text>{errors.root.message}</Text>
                </HStack>
            }
            {isSubmitting?
                <Button isLoading loadingText='creating your product' variant='ghost' borderRadius={'md'} w='full'/>
            :
                <Button type='submit' variant={'filled'} borderRadius={'md'} bg='#05232e' mt='2' w='full' color='#fff' onClick={handleSubmit}>Create Product</Button>
            }
      </form>
    )
}
