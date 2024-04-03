import { Avatar, Box, Divider, HStack, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import React from 'react'

export default function UserTabs({store}) {
  return (
    <Tabs variant='soft-rounded' colorScheme='blue' isLazy>
        <TabList>
            <Tab>Staff</Tab>
            <Tab>Vendors</Tab>
            <Tab>Products</Tab>
        </TabList>
        <TabPanels>
            <TabPanel>
              {store?.staff?.map((staff)=>{
                return(
                  <Box key={staff?._id}>
                    <Staff staff={staff}/>
                    <Divider/>
                  </Box>
                )})
              }
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

const Staff=({staff})=>{
  return(
    <HStack spacing='2'>
      <Avatar name={staff?.name} size='sm' src={staff?.profile_image_url}/>
      <Box>
        <Text fontSize={'sm'} fontWeight={'bold'}>{staff?.name}</Text>
        <Text fontSize={'xs'}>{staff?.account_type}</Text>
      </Box>
    </HStack>
  )
}