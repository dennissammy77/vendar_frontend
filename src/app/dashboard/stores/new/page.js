'use client'
import { UserContext } from '@/components/providers/user.context'
import NewStoreForm from '@/components/ui/store/NewStoreForm'
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React, { useContext } from 'react'
import { MdChevronRight } from 'react-icons/md';
import { VscDiscard } from "react-icons/vsc";

function Page() {
    const {user} = useContext(UserContext);
    const router = useRouter();
  return (
    <Box>
        <Text fontWeight='bold' fontSize='32px'>New Store</Text>
        <Breadcrumb spacing='8px' separator={<MdChevronRight color='gray.500' />}>
            <BreadcrumbItem>
                <BreadcrumbLink href={`/dashboard/home/?uid=${user?.data?.data?._id}`}>Home</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
                <BreadcrumbLink href={`/dashboard/stores/?uid=${user?.data?.data?._id}`}>Stores</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink >New</BreadcrumbLink>
            </BreadcrumbItem>
        </Breadcrumb>
        <NewStoreForm/>
        <Button variant={'ghost'} borderRadius={'md'} mt='2' w='full' onClick={(()=>{router.push(`/dashboard/stores/?uid=${user?.data?.data?._id}`)})} leftIcon={<VscDiscard />}>Discard</Button>
    </Box>
  )
}

export default Page