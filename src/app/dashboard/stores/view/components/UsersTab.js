import { UserContext } from '@/components/providers/user.context'
import { Avatar, Box, Divider, Flex, HStack, Icon, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import React, { useContext } from 'react'
import { IoMdAdd, IoMdSettings } from 'react-icons/io'
import { MdOutlineAdminPanelSettings } from 'react-icons/md'

export default function UserTabs({store}) {
  return (
    <Tabs variant='soft-rounded' colorScheme='blue' isLazy>
        <TabList>
            <Tab>
              <Icon as={MdOutlineAdminPanelSettings} boxSize='5' mx='1'/>
              Staff
            </Tab>
            <Tab>Vendors</Tab>
            <Tab>Products</Tab>
        </TabList>
        <TabPanels>
            <TabPanel>
              <StaffCard  store={store}/>
            </TabPanel>
            <TabPanel>
              <p>two!</p>
            </TabPanel>
            <TabPanel>
              <p>two!</p>
            </TabPanel>
        </TabPanels>
    </Tabs>
  )
}

const StaffCard=({store})=>{
  const router = useRouter();
  const {user} = useContext(UserContext)
  return(
    <Box>
        
        <Flex justify={'end'} w='100%' align={'center'} fontWeight={'bold'} color='#4E2FD7'>
          <HStack borderRight='1px solid' borderColor='gray.200' px='2' _hover={{textDecoration:'1px solid underline'}} cursor='pointer' onClick={(()=>{router.push(`/dashboard/staff/new?uid=${user?.data?.data?._id}&&store_id=${store?._id}`)})}>
            <Icon as={IoMdAdd} boxSize={'4'}  />
            <Text>New</Text>
          </HStack>
          <Text ml='2' onClick={(()=>{router.push(`/dashboard/staff?uid=${user?.data?.data?._id}&&store_id=${store?._id}`)})} _hover={{textDecoration:'1px solid underline'}} cursor='pointer'>view all</Text>          
        </Flex>
        {store?.staff?.map((staff)=>{
          return(
            <Box key={staff?._id} py='2'>
              <StaffItem staff={staff} STORE_ID={store?._id}/>
              <Divider py='1'/>
            </Box>
          )})
        }
    </Box>
  )
}

const StaffItem=({staff,STORE_ID})=>{
  const router = useRouter();
  const {user} = useContext(UserContext)

  return(
    <Flex p='2' borderRadius={'5'} align={'center'} justify={'space-between'}>
      <HStack spacing='2' >
        <Avatar name={staff?.name} size='sm' src={staff?.profile_image_url}/>
        <Box>
          <Text fontSize={'sm'} fontWeight={'bold'}>{staff?.name}</Text>
          <Text fontSize={'xs'}>{staff?.store_admin_account_ref?.role}</Text>
        </Box>
      </HStack>
      {user?.data?.data?._id === staff?._id ? 
        null
        :
        <HStack color='gray.600' cursor={'pointer'}pr='1' onClick={(()=>{router.push(`/dashboard/staff/view?uid=${user?.data?.data?._id}&store_id=${STORE_ID}&account_id=${staff?._id}`)})}>
            <Text fontSize={'xs'} fontWeight={'bold'}>manage</Text>
            <Icon boxSize='4' as={IoMdSettings } cursor='pointer'/>
        </HStack>
      }
    </Flex>
  )
}