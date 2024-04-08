import React from 'react';
import { Button, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, useToast } from '@chakra-ui/react'
import { DELETE_STORE_DATA } from '@/app/api/shop/route';
import { useRouter } from 'next/navigation';

export default function DELETE_STORE_ALERT({isOpen, onClose, USER_ID, STORE_ID}) {
    const toast = useToast();
    const router = useRouter()
    const HANDLE_SUBMIT = async()=>{
        const flag = 'delete'
        await DELETE_STORE_DATA(USER_ID, STORE_ID,flag).then((response)=>{
            if(response?.data?.error || response?.response?.data?.error){
                return toast({ title: 'Error!', description: `${response?.data?.message || response?.response?.data.message}`, status: 'error', variant:'left-accent', position: 'top-left', isClosable: true });
            }
            toast({ title: 'Success!', description: `${response?.data?.message}`, status: 'success', variant:'left-accent', position: 'top-left', isClosable: true });
            setTimeout(()=>{
                onClose();
                router.push(`/dashboard/stores/?uid=${USER_ID}`)
            },2000)
            return ;
        }).catch((err)=>{
            return toast({ title: `Error`, description: `Could not delete your store:${err}`, status: 'error', variant:'left-accent', position: 'top-left', isClosable: true });
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
                        Delete Store
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        Are you sure? You can't undo this action afterwards.
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme='red' onClick={HANDLE_SUBMIT} ml={3}>
                            Delete
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    )
  }