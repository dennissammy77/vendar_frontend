'use client'
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup";
import { Button, FormControl, FormLabel, HStack, Icon, Input, InputGroup, InputRightElement, Select, Text, useToast } from '@chakra-ui/react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { CiWarning } from 'react-icons/ci';
import { UserContext } from '@/components/providers/user.context';
import { CreateShopAdmin } from '@/app/api/auth/route';
import { useRouter } from 'next/navigation';

export default function NewStaffForm() {
    const EmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const {user} = useContext(UserContext);
    const existing_stores = user?.data?.data?.shop_ref;
    const schema = yup.object().shape({
        name: yup.string().required(),
        email: yup.string().email().required().matches(EmailRegex, 'Email address must be of correct format'),
        mobile: yup.string().required(),
        password: yup.string().required().min(6).max(16),
        account_type: yup.string().default('shop_admin').required(),
        role: yup.string().required('You need to assign a role to this user'),
        shop_ref: yup.string().required('You need to select a store for this user'),
        profile_image_url: yup.string().default('')
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

    const [show, setShow] = useState(false); //handle state to toggle password
	const handleClick = () => setShow(!show); //handle state to toggle view of password

    const onSubmit = async(data) => {
        try {
          await CreateShopAdmin(data).then((response)=>{
            if(response?.data?.error === true){
                return toast({ title: `Error!:${response?.data?.message}`, description: ``, status: 'warning', variant:'left-accent', position: 'top-left', isClosable: true });
            }
            toast({ title: 'Success!:Account created successfully', description: ``, status: 'success', variant:'left-accent', position: 'top-left', isClosable: true });
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
            <Input disabled={isSubmitting} {...register('name')} type='text' placeholder='John Doe' variant='filled'/>
            {errors.name && ( <Text fontSize={'sm'} color='red'>{errors.name.message}</Text>)}
            </FormControl>
            <FormControl mt='1' isRequired>
                <FormLabel>Email</FormLabel>
                <Input disabled={isSubmitting} {...register('email')} type='email' placeholder='johndoe@gmail.com' variant='filled'/>
                {errors.email && ( <Text fontSize={'sm'} color='red'>{errors.email.message}</Text>)}
            </FormControl>
            <FormControl mt='1' isRequired>
                <FormLabel>Mobile</FormLabel>
                <Input disabled={isSubmitting} {...register('mobile')} type='tel' placeholder='0712345678' variant='filled'/>
                {errors.mobile && ( <Text fontSize={'sm'} color='red'>{errors.mobile.message}</Text>)}
            </FormControl>
            <FormControl isRequired>
                <FormLabel my='2' fontWeight={'bold'}>Role</FormLabel>
                <Select {...register("role")} placeholder='Select the role'>
                    <option value='manager'>Manager</option>
                    <option value='sale'>Supervisor</option>
                    <option value='sale'>Sale</option>
                    <option value='finance'>Finance</option>
                </Select>
                {errors.role && (<FormErrorMessage>{errors.role.message}</FormErrorMessage>)}
            </FormControl>
            <FormControl isRequired>
                <FormLabel my='2' fontWeight={'bold'}>Store</FormLabel>
                <Select {...register("shop_ref")} placeholder='Select the store for the user'>
                    {existing_stores?.map((store)=>{
                        return(
                            <option key={store?._id} value={store?._id}>{store?.name}</option>
                        )
                    })}
                </Select>
                {errors.shop_ref && (<FormErrorMessage>{errors.shop_ref.message}</FormErrorMessage>)}
            </FormControl>
            <FormControl mt='1' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup size='md'>
                    <Input disabled={isSubmitting} {...register('password')} pr='4.5rem' type={show ? 'text' : 'password'} placeholder='Enter password' variant='filled'/>
                    <InputRightElement width='4.5rem'>
                    <Button h='1.75rem' size='sm' onClick={handleClick} bg='#fff'> {show ? <MdVisibilityOff/> : <MdVisibility/>} </Button>
                    </InputRightElement>
                </InputGroup>
                {errors.password && ( <Text fontSize={'sm'} color='red'>{errors.password.message}</Text>)}
            </FormControl>
            {errors.root && 
                <HStack color='red.400' bg='red.200' borderRadius={'md'} p='2' mt='2' align={'center'}>
                    <Icon as={CiWarning} boxSize='4'/>
                    <Text>{errors.root.message}</Text>
                </HStack>
            }
            {isSubmitting?
                <Button isLoading loadingText='creating your account' variant='ghost' borderRadius={'md'} w='full'/>
            :
                <Button type='submit' variant={'filled'} borderRadius={'md'} bg='#05232e' mt='2' w='full' color='#fff' onClick={handleSubmit}>Create User</Button>
            }
      </form>
    )
}

