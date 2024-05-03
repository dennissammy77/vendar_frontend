import React, { useState } from 'react';
import { Button, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, useToast, UnorderedList, ListItem, OrderedList, Badge, Text } from '@chakra-ui/react'
import { useRouter } from 'next/navigation';
import { DELETE_STORE_PICKUP } from '@/app/api/pickup/route';

export default function DELETE_PICKUP_ALERT({isOpen, onClose, USER_ID, PICKUP_ID}) {
    const toast = useToast();
    const router = useRouter();
    const [isSubmitting,set_isSubmitting]=useState(false)

    const HANDLE_SUBMIT = async()=>{
        set_isSubmitting(true);
        await DELETE_STORE_PICKUP(USER_ID, PICKUP_ID).then((response)=>{
            if(response?.data?.error || response?.response?.data?.error){
                return toast({ title: 'Error!', description: `${response?.data?.message || response?.response?.data.message}`, status: 'error', variant:'left-accent', position: 'top-left', isClosable: true });
            }
            toast({ title: 'Success!', description: `${response?.data?.message}`, status: 'success', variant:'left-accent', position: 'top-left', isClosable: true });
            onClose();
            router.back()
            return ;
        }).catch((err)=>{
            return toast({ title: `Error`, description: `Could not delete this pickup:${err}`, status: 'error', variant:'left-accent', position: 'top-left', isClosable: true });
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
                        Delete PickUp
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        Are you sure? You can't undo this action afterwards.
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button onClick={onClose}>
                            Cancel
                        </Button>
                        {isSubmitting?
                            <Button isLoading loadingText='deleting item...' variant='ghost' borderRadius={'md'} w='full'/>
                        :
                            <Button colorScheme='red' onClick={HANDLE_SUBMIT} ml={3}> Delete </Button>
                        }
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    )
  }