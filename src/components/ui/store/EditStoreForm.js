'use client'
import { UserContext } from '@/components/providers/user.context';
import { Button, Divider, FormControl, FormLabel, Icon, Input, InputGroup, InputLeftElement, Text, Textarea, useToast } from '@chakra-ui/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup";
import { UPDATE_STORE_DATA } from '@/app/api/shop/route';
import { FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from 'react-icons/fa6';

export default function EditStoreForm(props) {
    const router = useRouter();
    const toast = useToast();
    const {user} = useContext(UserContext);
    
    const data = props.store_data;
    const EmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    const schema = yup.object().shape({
        name: yup.string().required(),
        description: yup.string().max(200,'200 maximum character length allowed'),
        mobile: yup.string(),
        email: yup.string().email().matches(EmailRegex, 'Email address must be of correct format'),
        location: yup.string(),
        shelves: yup.number().min(1).required('Number of shelves is required'),
        instagram_url: yup.string(),
        twitter_url:   yup.string(),
        tiktok_url:    yup.string(),
        whatsapp_url:  yup.string(),
        owner_ref_id:  yup.string()
    });
    const {
        register, 
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name:        data?.name,
            description: data?.description,
            mobile:      data?.mobile,
            location:    data?.location,
            email:       data?.email,
            shelves:     data?.shelves,
            instagram_url: data?.instagram_url,
            twitter_url:   data?.twitter_url,
            tiktok_url:    data?.tiktok_url,
            whatsapp_url:  data?.whatsapp_url,
            owner_ref_id:  user?.data?.data?._id
        },
    });

    const onSubmit = async(data) => {
        const user_id = user?.data?.data?._id;
        const flag = 'details';
        const store_id = props?.store_data?._id;
        try{
            await UPDATE_STORE_DATA(data,store_id,user_id,flag).then((response)=>{
                if(response?.data?.error || response?.response?.data?.error){
                    return toast({ title: 'Error!', description: `${response?.data?.message || response?.response?.data.message}`, status: 'error', variant:'left-accent', position: 'top-left', isClosable: true });
                }
                toast({ title: 'Success!', description: `${response?.data?.message}`, status: 'success', variant:'left-accent', position: 'top-left', isClosable: true });
                setTimeout(()=>{
                    router.back();
                },2000)
                return ;
            }).catch((err)=>{
                return toast({ title: `Error`, description: `Could not update your store:${err}`, status: 'error', variant:'left-accent', position: 'top-left', isClosable: true });
            })
        }catch(err){
            return toast({ title: `Error`, description: `Could not update your store:${err}`, status: 'error', variant:'left-accent', position: 'top-left', isClosable: true });
        }
    }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl mt='1' isRequired my='2'>
            <FormLabel>Store Name</FormLabel>
            <Input disabled={isSubmitting} {...register('name')} type='text' placeholder='Johns Shelf' variant='filled'/>
            {errors.name && ( <Text fontSize={'sm'} color='red'>{errors.name.message}</Text>)}
        </FormControl>
        <FormControl mt='1'>
            <FormLabel>Store email</FormLabel>
            <Input disabled={isSubmitting} {...register('email')} type='email' placeholder='johnstore@store.com' variant='filled'/>
            {errors.email && ( <Text fontSize={'sm'} color='red'>{errors.email.message}</Text>)}
        </FormControl>
        <FormControl mt='1'>
            <FormLabel>Store mobile</FormLabel>
            <Input disabled={isSubmitting} {...register('mobile')} type='tel' placeholder='0712345678' variant='filled'/>
            {errors.mobile && ( <Text fontSize={'sm'} color='red'>{errors.mobile.message}</Text>)}
        </FormControl>
        <FormControl mt='1' my='2'>
            <FormLabel>Store Location</FormLabel>
            <Input disabled={isSubmitting} {...register('location')} type='text' placeholder='Moi Avenue, Nairobi' variant='filled'/>
            {errors.location && ( <Text fontSize={'sm'} color='red'>{errors.location.message}</Text>)}
        </FormControl>
        <FormControl mt='1' my='2'>
            <FormLabel>Number of shelves</FormLabel>
            <Input disabled={isSubmitting} {...register('shelves')} type='number' placeholder='eg: 10' variant='filled'/>
            {errors.shelves && ( <Text fontSize={'sm'} color='red'>{errors.shelves.message}</Text>)}
        </FormControl>
        <FormControl mt='1' my='2'>
            <FormLabel>About the store</FormLabel>
            <Textarea h='100px' disabled={isSubmitting} {...register('description')} type='text' placeholder='Tell us a bit about your store' variant='filled'/>
            {errors.description && ( <Text fontSize={'sm'} color='red'>{errors.description.message}</Text>)}
        </FormControl>
        <Text fontWeight={'bold'}>Socials</Text>
        <Divider />
        <FormControl mt='1' my='2'>
            <FormLabel>Instagram</FormLabel>
            <InputGroup>
                <InputLeftElement pointerEvents='none'>
                    <Icon boxSize={'4'} as={FaInstagram} color='' />
                </InputLeftElement>
                <Input disabled={isSubmitting} {...register('instagram_url')} type='url' placeholder='instagram social link' variant='filled'/>
            </InputGroup>
            {errors.instagram_url && ( <Text fontSize={'sm'} color='red'>{errors.instagram_url.message}</Text>)}
        </FormControl>
        <FormControl mt='1' my='2'>
            <FormLabel>Twitter</FormLabel>
            <InputGroup>
                <InputLeftElement pointerEvents='none'>
                    <Icon boxSize={'4'} as={FaXTwitter} color='' />
                </InputLeftElement>
                <Input disabled={isSubmitting} {...register('twitter_url')} type='url' placeholder='twitter social link' variant='filled'/>
            </InputGroup>
            {errors.twitter_url && ( <Text fontSize={'sm'} color='red'>{errors.twitter_url.message}</Text>)}
        </FormControl>
        <FormControl mt='1' my='2'>
            <FormLabel>WhatsApp</FormLabel>
            <InputGroup>
                <InputLeftElement pointerEvents='none'>
                    <Icon boxSize={'4'} as={FaWhatsapp} color='' />
                </InputLeftElement>
                <Input disabled={isSubmitting} {...register('whatsapp_url')} type='url' placeholder='whatsapp social link' variant='filled'/>
            </InputGroup>
            {errors.whatsapp_url && ( <Text fontSize={'sm'} color='red'>{errors.whatsapp_url.message}</Text>)}
        </FormControl>
        <FormControl mt='1' my='2'>
            <FormLabel>Tiktok</FormLabel>
            <InputGroup>
                <InputLeftElement pointerEvents='none'>
                    <Icon boxSize={'4'} as={FaTiktok} color='' />
                </InputLeftElement>
                <Input disabled={isSubmitting} {...register('tiktok_url')} type='url' placeholder='tiktok social link' variant='filled'/>
            </InputGroup>
            {errors.tiktok_url && ( <Text fontSize={'sm'} color='red'>{errors.tiktok_url.message}</Text>)}
        </FormControl>
        {isSubmitting?
            <Button isLoading loadingText='saving...' variant='ghost' borderRadius={'md'} w='full'/>
            :
            <Button type='submit' variant={'filled'} borderRadius={'md'} bg='#05232e' mt='2' w='full' color='#fff' onClick={handleSubmit}>Update Store</Button>
        }
    </form>
  )
}