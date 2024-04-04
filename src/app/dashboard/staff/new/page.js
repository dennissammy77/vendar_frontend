'use client'
import { UserContext } from '@/components/providers/user.context';
import NewStaffForm from '@/components/ui/staff/NewStaffForm'
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Text } from '@chakra-ui/react'
import { useRouter } from 'next/navigation';
import React, { useContext } from 'react'
import { MdChevronRight } from 'react-icons/md';
import { VscDiscard } from 'react-icons/vsc';

function Page() {
  const router = useRouter();
  const {user} = useContext(UserContext);

  return (
    <Box>
        <Text fontWeight='bold' fontSize='32px'>New Staff</Text>
        <Breadcrumb spacing='8px' separator={<MdChevronRight color='gray.500' />}>
            <BreadcrumbItem>
                <BreadcrumbLink href={`/dashboard/home/?uid=${user?.data?.data?._id}`}>Home</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
                <BreadcrumbLink href={`/dashboard/staff/?uid=${user?.data?.data?._id}`}>Staff</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink >New</BreadcrumbLink>
            </BreadcrumbItem>
        </Breadcrumb>
        <NewStaffForm />
        <Button variant={'ghost'} borderRadius={'md'} mt='2' w='full' onClick={(()=>{router.back()})} leftIcon={<VscDiscard />}>Discard</Button>
    </Box>
  )
}

export default Page