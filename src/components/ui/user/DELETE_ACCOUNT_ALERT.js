import React from 'react';
import { Button, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, useToast, UnorderedList, ListItem, OrderedList, Text } from '@chakra-ui/react'
import { useRouter } from 'next/navigation';
import { DELETE_USER_ACCOUNT } from '@/app/api/auth/route';
import useLogOut from '@/components/hooks/useLogOut.hook';

export default function DELETE_ACCOUNT_ALERT({isOpen, onClose, USER_ID, USER_DATA}) {
    const toast = useToast();
    const router = useRouter();

    const HANDLE_SUBMIT = async()=>{
        const FLAG = 'delete'
        const ACCOUNT_TYPE = USER_DATA?.account_type;
        await DELETE_USER_ACCOUNT(USER_ID, ACCOUNT_TYPE, FLAG).then((response)=>{
            console.log(response);
            if(response?.data?.error || response?.response?.data?.error){
                return toast({ title: 'Error!', description: `${response?.data?.message || response?.response?.data.message}`, status: 'error', variant:'left-accent', position: 'top-left', isClosable: true });
            }
            toast({ title: 'Success!', description: `${response?.data?.message}`, status: 'success', variant:'left-accent', position: 'top-left', isClosable: true });
            setTimeout(()=>{
                onClose();
                useLogOut();
                router.push(`/`)
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
                        Are you sure? You can't undo this action afterwards. You will lose your account and the following information:
                        <UnorderedList>
                            <ListItem>{USER_DATA?.store_ref?.length} stores</ListItem>
                            {USER_DATA?.store_ref?.map((store)=>{
                                return(
                                    <OrderedList>
                                        <Text fontWeight={'bold'}>{store?.name}</Text>
                                        {store?.staff?.length - 1 > 0 ? <ListItem>{store?.staff?.length - 1} staff</ListItem> : null}
                                        {store?.vendors?.length > 0 ? <ListItem>{store?.vendors?.length} vendors</ListItem> : null}
                                        {store?.staff?.products> 0 ? <ListItem>{store?.staff?.length} products</ListItem> : null}
                                        {store?.transactions?.length> 0 ? <ListItem>{store?.transactions?.length} transactions</ListItem> : null}
                                    </OrderedList>
                                )
                            })}
                        </UnorderedList>
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