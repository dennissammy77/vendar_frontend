import React from 'react';
import { Button, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, useToast, UnorderedList, ListItem, OrderedList, Text } from '@chakra-ui/react'
import { useRouter } from 'next/navigation';
import { DELETE_STORE_STAKEHOLDER_ACCOUNT } from '@/app/api/auth/route';
import useLogOut from '@/components/hooks/useLogOut.hook';

export default function DELETE_STAKEHOLDER_ACCOUNT_ALERT({isOpen, onClose, USER_ID, USER_DATA}) {
    const toast = useToast();
    const router = useRouter();

    const HANDLE_SUBMIT = async()=>{
        const FLAG = 'delete'
        const ACCOUNT_TYPE = USER_DATA?.account_type;
        const ACCOUNT_ID = USER_DATA?._id;
        if(USER_ID === ACCOUNT_ID){
            return toast({ title: 'Error!', description: 'You cannot delete your own account.', status: 'error', variant:'left-accent', position: 'top-left', isClosable: true });
        }
        await DELETE_STORE_STAKEHOLDER_ACCOUNT(USER_ID,ACCOUNT_ID, ACCOUNT_TYPE, FLAG).then((response)=>{
            if(response?.data?.error || response?.response?.data?.error){
                return toast({ title: 'Error!', description: `${response?.data?.message || response?.response?.data.message}`, status: 'error', variant:'left-accent', position: 'top-left', isClosable: true });
            }
            toast({ title: 'Success!', description: `${response?.data?.message}`, status: 'success', variant:'left-accent', position: 'top-left', isClosable: true });
            setTimeout(()=>{
                onClose();
                if(ACCOUNT_TYPE === 'store_admin'){
                    router.push(`/dashboard/staff?uid=${USER_ID}&store_id=`)
                }
                if(ACCOUNT_TYPE === 'vendor'){
                    router.push(`/dashboard/vendors?uid=${USER_ID}&store_id=`)
                }
            },5000)
            return ;
        }).catch((err)=>{
            return toast({ title: `Error`, description: `Could not delete your account:${err}`, status: 'error', variant:'left-accent', position: 'top-left', isClosable: true });
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
                        Delete Account
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