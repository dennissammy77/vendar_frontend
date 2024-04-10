import React from 'react';
import { FormControl, Input, FormLabel, Text, useToast, Button, Select } from '@chakra-ui/react'
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup";
import { useForm } from 'react-hook-form';
import { UPDATE_STORE_STAKEHOLDER_ACCOUNT, UPDATE_USER_ACCOUNT } from '@/app/api/auth/route';
import { useRouter } from 'next/navigation';

export default function UPDATE_USER_FORM(props) {
    const toast = useToast();
    const router = useRouter();


    const EmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    
    const schema = yup.object().shape({
        name: yup.string().required(),
        username: yup.string(),
        email: yup.string().email().required().matches(EmailRegex, 'Email address must be of correct format'),
        mobile: yup.string().required(),
        account_type: yup.string().required(),
        profile_image_url: yup.string(),
        account_id: yup.string().required(),
    });

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
      } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name:               props?.USER_DATA?.name,
            username:           props?.USER_DATA?.username,
            email:              props?.USER_DATA?.email,
            mobile:             props?.USER_DATA?.mobile,
            account_type:       props?.USER_DATA?.account_type,
            profile_image_url:  props?.USER_DATA?.profile_image_url,
            account_id:         props?.USER_DATA?._id,
        }, 
    });

    const USER_ID = props?.USER_DATA?._id;

    const onSubmit = async(data) => {
        try{
            await UPDATE_USER_ACCOUNT(data,USER_ID).then((response)=>{
                if(response?.data?.error || response?.response?.data?.error){
                    return toast({ title: 'Error!', description: `${response?.data?.message || response?.response?.data.message}`, status: 'error', variant:'left-accent', position: 'top-left', isClosable: true });
                }
                toast({ title: 'Success!', description: `${response?.data?.message}`, status: 'success', variant:'left-accent', position: 'top-left', isClosable: true });
                setTimeout(()=>{
                    router.back();
                },2000)
                return ;
            }).catch((err)=>{
                return toast({ title: `Error`, description: `Could not update your profile:${err}`, status: 'error', variant:'left-accent', position: 'top-left', isClosable: true });
            })
        }catch(err){
            return toast({ title: `Error`, description: `Could not update your profile:${err}`, status: 'error', variant:'left-accent', position: 'top-left', isClosable: true });
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl mt='1' isRequired>
                <FormLabel>Name</FormLabel>
                <Input disabled={isSubmitting} {...register('name')} type='text' placeholder='John Doe' variant='filled'/>
                {errors.name && ( <Text fontSize={'sm'} color='red'>{errors.name.message}</Text>)}
            </FormControl>
            <FormControl mt='1'>
                <FormLabel>UserName</FormLabel>
                <Input disabled={isSubmitting} {...register('username')} type='text' placeholder='John Doe' variant='filled'/>
                {errors.username && ( <Text fontSize={'sm'} color='red'>{errors.username.message}</Text>)}
            </FormControl>
            <FormControl mt='1' isRequired>
                <FormLabel>Mobile</FormLabel>
                <Input disabled={isSubmitting} {...register('mobile')} type='tel' placeholder='0712345678' variant='filled'/>
                {errors.mobile && ( <Text fontSize={'sm'} color='red'>{errors.mobile.message}</Text>)}
            </FormControl>
            {isSubmitting?
                <Button isLoading loadingText='saving...' variant='ghost' borderRadius={'md'} w='full'/>
                :
                <Button type='submit' variant={'filled'} borderRadius={'md'} bg='#05232e' mt='2' w='full' color='#fff' onClick={handleSubmit}>Update Profile</Button>
            }
        </form>
    )
};

export const UPDATE_STORE_STAKEHOLDER_FORM=(props)=>{

    const toast = useToast();
    const router = useRouter();
    
    const schema = yup.object().shape({
        name: yup.string().required(),
        username: yup.string(),
        mobile: yup.string().required(),
        account_type: yup.string().required(),
        account_id: yup.string().required(),
        role: yup.string().required(),
    });

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
      } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name:               props?.USER_DATA?.name,
            username:           props?.USER_DATA?.username,
            mobile:             props?.USER_DATA?.mobile,
            account_type:       props?.USER_DATA?.account_type,
            account_id:         props?.USER_DATA?._id,
            role:               props?.USER_DATA?.account_type === 'store_admin'? props?.USER_DATA?.store_admin_account_ref?.role : 'undefined',
        }, 
    });

    const USER_ID = props?.USER_ID;
    const STORE_ID = props?.STORE_ID;

    const onSubmit = async(data) => {
        try{
            if (data?.role !== props?.USER_DATA?.store_admin_account_ref?.role && props?.USER_DATA?.account_type === 'store_admin'){
                const FLAG = 'staff-role';
                await UPDATE_STORE_STAKEHOLDER_ACCOUNT(data,USER_ID,STORE_ID,FLAG).then((response)=>{
                    if(response?.data?.error || response?.response?.data?.error){
                        return toast({ title: 'Error!', description: `${response?.data?.message || response?.response?.data.message}`, status: 'error', variant:'left-accent', position: 'top-left', isClosable: true });
                    }
                    toast({ title: 'Success!', description: `${response?.data?.message}`, status: 'success', variant:'left-accent', position: 'top-left', isClosable: true });
                    setTimeout(()=>{
                        router.back();
                    },2000)
                    return ;
                }).catch((err)=>{
                    return toast({ title: `Error`, description: `Could not update profile:${err}`, status: 'error', variant:'left-accent', position: 'top-left', isClosable: true });
                })
            }
            const FLAG = 'details';
            await UPDATE_STORE_STAKEHOLDER_ACCOUNT(data,USER_ID,STORE_ID,FLAG).then((response)=>{
                if(response?.data?.error || response?.response?.data?.error){
                    return toast({ title: 'Error!', description: `${response?.data?.message || response?.response?.data.message}`, status: 'error', variant:'left-accent', position: 'top-left', isClosable: true });
                }
                toast({ title: 'Success!', description: `${response?.data?.message}`, status: 'success', variant:'left-accent', position: 'top-left', isClosable: true });
                setTimeout(()=>{
                    router.back();
                },2000)
                return ;
            }).catch((err)=>{
                return toast({ title: `Error`, description: `Could not update profile:${err}`, status: 'error', variant:'left-accent', position: 'top-left', isClosable: true });
            })
            
            
        }catch(err){
            return toast({ title: `Error`, description: `Could not update profile:${err}`, status: 'error', variant:'left-accent', position: 'top-left', isClosable: true });
        }
    }

    return(
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl mt='1' isRequired>
                <FormLabel>Name</FormLabel>
                <Input disabled={isSubmitting} {...register('name')} type='text' placeholder='John Doe' variant='filled'/>
                {errors.name && ( <Text fontSize={'sm'} color='red'>{errors.name.message}</Text>)}
            </FormControl>
            <FormControl mt='1'>
                <FormLabel>UserName</FormLabel>
                <Input disabled={isSubmitting} {...register('username')} type='text' placeholder='John Doe' variant='filled'/>
                {errors.username && ( <Text fontSize={'sm'} color='red'>{errors.username.message}</Text>)}
            </FormControl>
            <FormControl mt='1' isRequired>
                <FormLabel>Mobile</FormLabel>
                <Input disabled={isSubmitting} {...register('mobile')} type='tel' placeholder='0712345678' variant='filled'/>
                {errors.mobile && ( <Text fontSize={'sm'} color='red'>{errors.mobile.message}</Text>)}
            </FormControl>
            {props?.USER_DATA?.account_type === 'store_admin'?
                <FormControl isRequired>
                    <FormLabel my='2' fontWeight={'bold'}>Role</FormLabel>
                    <Select {...register("role")} placeholder='Select the role'>
                        <option value='manager'>Manager</option>
                        <option value='supervisor'>Supervisor</option>
                        <option value='sale'>Sale</option>
                        <option value='finance'>Finance</option>
                    </Select>
                    {errors.role && (<FormErrorMessage>{errors.role.message}</FormErrorMessage>)}
                </FormControl>
                :
                null
            }
            {isSubmitting?
                <Button isLoading loadingText='saving...' variant='ghost' borderRadius={'md'} w='full'/>
                :
                <Button type='submit' variant={'filled'} borderRadius={'md'} bg='#05232e' mt='2' w='full' color='#fff' onClick={handleSubmit}>Update Profile</Button>
            }
        </form>
    )
}