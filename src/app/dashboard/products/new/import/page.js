'use client'
import { UserContext } from '@/components/providers/user.context';
import NEW_STORE_PRODUCT_FORM from '@/components/ui/product/NEW_STORE_PRODUCT_FORM';
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Text, Flex, Icon, Image, Input, FormControl, FormErrorMessage, } from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useContext, useState } from 'react'
import { MdChevronRight } from 'react-icons/md';
import { VscDiscard } from 'react-icons/vsc';

import Dropzone, { useDropzone } from 'react-dropzone'
import { MdClose } from 'react-icons/md'
import { BiImageAdd } from 'react-icons/bi'

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { FaFileCsv } from 'react-icons/fa';

function Page() {
    const router = useRouter();
    const {user} = useContext(UserContext);

    const searchParams = useSearchParams()
    const store_id = searchParams.get('store_id');

    const {
        handleSubmit, register, setValue, getValues, setError, clearErrors, watch, control,
        formState: { errors, isSubmitting },
    } = useForm({
    });

    const onSubmit = async (data) => {
        const values = getValues();
        console.log(values);
    }
  return (
    <Box>
        <Text fontWeight='bold' fontSize='32px'>Import New Products</Text>
        <Breadcrumb spacing='8px' separator={<MdChevronRight color='gray.500' />}>
            <BreadcrumbItem>
                <BreadcrumbLink href={`/dashboard/home/?uid=${user?.data?.data?._id}`}>Home</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
                <BreadcrumbLink href={`/dashboard/products?uid=${user?.data?.data?._id}&store_id=${store_id}`}>Product</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink >New</BreadcrumbLink>
            </BreadcrumbItem>
        </Breadcrumb>
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.image} my={'4'}>
                <DROP_ZONE name="excel" setValue={setValue} setError={setError} watch={watch} control={control}/>
                <FormErrorMessage mt="1">{errors.image?.message}</FormErrorMessage>
            </FormControl>   
            {isSubmitting?
                <Button isLoading loadingText='Saving products' variant='ghost' borderRadius={'md'} w='full'/>
                :
                <Button type='submit' variant={'filled'} borderRadius={'md'} bg='#05232e' mt='2' w='full' color='#fff' onClick={handleSubmit}>Save products</Button>
            }
        </form>
        <Button variant={'ghost'} borderRadius={'md'} mt='2' w='full' onClick={(()=>{router.back()})} leftIcon={<VscDiscard />}>Discard</Button>
    </Box>
  )
}

export default Page

export function DROP_ZONE({ control, name, error, watch, setValue, setError, ...rest }) {
    const [file, setFile] = useState({});

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'csv' : [".csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"]
        },
        maxFiles: 1,
        onDrop: (acceptedFiles) => {
            if(acceptedFiles.length === 1){
                const file = acceptedFiles.map((file) => Object.assign(file, {
                    key: file.path,
                    preview: URL.createObjectURL(file)
                }));
                setFile(file[0]);
                setValue(name, file[0], {
                    shouldValidate: true,
                })
            } else {
                alert('ops!')
            }
        }
    });

    function handleClear(){
        setFile({})
        setValue(name, '', {
            shouldValidate: true,
        })
    }

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange, value  } }) => (
                <Flex justify="center" align="center" w="100%" position="relative" cursor="pointer">
                    <Flex justify="center" align="center" w="100%" minH="100px" border="1px" borderStyle="solid" borderColor={isDragActive ? 'green.500' : error ? 'red.500' : 'gray.300'} borderRadius="7px" overflow="hidden" {...getRootProps()} position="relative" transition="0.3s" padding="5px" bg="gray.50" _hover={{
                        borderColor: 'gray.400'
                    }}>
                        {file.path ? (
                            <Flex w="100%" h="100%" justify="center" align="center" position="absolute" top="0px" left="0px">
                                <Flex w="30px" h="30px" justify="center" align="center" background="rgba(0, 0, 0, 0.5)" borderRadius="100%" position="absolute" top="15px" right="15px" transition="0.3s" cursor="pointer" onClick={handleClear} _hover={{
                                    background: 'rgba(0, 0, 0, 1);'
                                }}>
                                    <Icon as={MdClose} color="#fff" fontSize="20px" />
                                </Flex>
                            </Flex>
                        ) : (
                            isDragActive ? (
                                <Flex align="center" position="absolute" mt="0" mb="0" mr="0" ml="0" color="gray.400">
                                    <Icon as={FaFileCsv} fontSize="22px" mr="10px"/>
                                    <Text fontSize="12px">Drop your file to preview.</Text>
                                </Flex>
                            ) : (
                                <Flex align="center" position="absolute" mt="0" mb="0" mr="0" ml="0" color="gray.400">
                                    <input {...getInputProps()} />
                                    <Icon as={FaFileCsv} fontSize="22px" mr="10px"/>
                                    <Text fontSize="12px">Select File to save products</Text>
                                </Flex>
                            )
                        )}
                        <Flex>
                            {file && (
                                <Flex>
                                    <Image key={file.key} src={file.preview} w="100%" borderRadius="7px" />
                                </Flex>
                            )}
                        </Flex>
                    </Flex>
                </Flex>
            )}
        />
    )
}