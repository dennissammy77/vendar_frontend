'use client'

import { PRIVACY } from '@/components/lib/html/template';
import { UserContext } from '@/components/providers/user.context';
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react'
import React, { useContext } from 'react'
import { MdChevronRight } from 'react-icons/md'

function Page() {
  const {user} = useContext(UserContext);

  return (
    <Box p='6'>
      <Breadcrumb spacing='8px' separator={<MdChevronRight color='gray.500' />} my='2'>
          <BreadcrumbItem>
              <BreadcrumbLink href={`/dashboard/home/?uid=${user?.data?.data?._id}`}>Home</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
              <BreadcrumbLink href={`/dashboard/support/?uid=${user?.data?.data?._id}`}>Support</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink fontSize={'sm'} color='gray.400' fontWeight={'bold'}>privacy policy</BreadcrumbLink>
          </BreadcrumbItem>
      </Breadcrumb>
      <PRIVACY/>
    </Box>
  )
}

export default Page