import React, { useState } from 'react';
import { Button, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, useToast, UnorderedList, ListItem, OrderedList, Badge, Text } from '@chakra-ui/react'
import { useRouter } from 'next/navigation';
import { DELETE_STORE_PRODUCT } from '@/app/api/product/route';

export default function DELETE_PRODUCT_ALERT({isOpen, onClose, USER_ID, PRODUCT_ID, PRODUCT_DATA}) {
    const toast = useToast();
    const router = useRouter();
    const [isSubmitting,set_isSubmitting]=useState(false)

    const HANDLE_SUBMIT = async()=>{
        set_isSubmitting(true);
        await DELETE_STORE_PRODUCT(USER_ID, PRODUCT_ID).then((response)=>{
            if(response?.data?.error || response?.response?.data?.error){
                return toast({ title: 'Error!', description: `${response?.data?.message || response?.response?.data.message}`, status: 'error', variant:'left-accent', position: 'top-left', isClosable: true });
            }
            toast({ title: 'Success!', description: `${response?.data?.message}`, status: 'success', variant:'left-accent', position: 'top-left', isClosable: true });
            onClose();
            router.back()
            return ;
        }).catch((err)=>{
            return toast({ title: `Error`, description: `Could not delete this product:${err}`, status: 'error', variant:'left-accent', position: 'top-left', isClosable: true });
        }).finally(()=>{
            set_isSubmitting(false);
        });
    }

    return (
        <AlertDialog
            motionPreset='slideInBottom'
            onClose={onClose}
            isOpen={isOpen}
            isCentered
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        Delete Product
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        Are you sure? You can't undo this action afterwards.You will lose your product and the following information:
                        <UnorderedList>
                            <Text fontWeight={'bold'} fontSize={'lg'}>{PRODUCT_DATA?.transactions?.length} sales</Text>
                            {PRODUCT_DATA?.transactions?.map((transaction)=>{
                                return(
                                    <ListItem>
                                        <Text fontWeight='bold'>Total: </Text>
                                        KES {transaction?.payment_total} 
                                        <Badge colorScheme={transaction?.payment ? 'green':'orange'} ml='2'>
                                            {transaction?.status}
                                        </Badge>
                                    </ListItem>
                                )
                            })}
                        </UnorderedList>
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button onClick={onClose}>
                            Cancel
                        </Button>
                        {isSubmitting?
                            <Button isLoading loadingText='deleting your product' variant='ghost' borderRadius={'md'} w='full'/>
                        :
                            <Button colorScheme='red' onClick={HANDLE_SUBMIT} ml={3}> Delete </Button>
                        }
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    )
  }