'use client'
import { Avatar, Box, Button, Divider, Drawer, DrawerContent, DrawerOverlay, Flex, HStack, Icon, IconButton, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, VStack, useDisclosure } from "@chakra-ui/react";
import { MdAdminPanelSettings, MdOutlineMenu, MdUpgrade } from "react-icons/md";
//import { dashboardContext } from "../../providers/dashboard.context";
import { useContext } from "react";
import { usePathname, useRouter  } from "next/navigation";
import { UserContext } from "@/components/providers/user.context";

import { IoMenu } from "react-icons/io5";
import { HiBell } from "react-icons/hi2";
import { FaBell } from "react-icons/fa";
import LOGO from "@/app/lib/LOGO";
import { IoCloseSharp } from "react-icons/io5";

export default function NavigationBody({children,navigation}){
    const sidebar = useDisclosure();
    return(
        <Box as="section" minH="100%">
            {/**side bar content on large screen */}
            <SidebarContent navigation={navigation} onClose={sidebar.onClose} display={{ base: "none", md: "unset", }} width='60'/> 
            {/**side bar content on small screen will use drawer*/}
            <Drawer isOpen={sidebar.isOpen} onClose={sidebar.onClose} placement={"left"}>
                <DrawerOverlay />
                <DrawerContent>
                    <SidebarContent navigation={navigation} onClose={sidebar.onClose} width='full'/>
                </DrawerContent>
            </Drawer>
            <TopNav isOpen={sidebar.isOpen} onClose={sidebar.onClose} onToggle={sidebar.onToggle}/>
            {/**body of the dasboard */}
            <Box ml={{ base: 0, md: 60, }} transition=".3s ease" p='4'>
                {/**Header for the body section 
                 * 
                <Flex as="header" align="center" w="full" px="4" bg="white" display={{ base: "inline-flex", md: "none", }} _dark={{ bg: "gray.800", }} borderBottomWidth="1px" color="inherit" h="14" gap='2' >
                    <IconButton aria-label="Menu" display={{ base: "inline-flex", md: "none", }} onClick={sidebar.onOpen} icon={<MdOutlineMenu />} size="sm" />
                    <Text display={{ base: "inline-flex", md: "none", }} >Navigation</Text>
                </Flex>
                */}
                {/**Contents of the body */}
                {children}
            </Box>
        </Box>
    )
};

const TopNav = ({ onOpen,onToggle, ...rest }) => {
  return (
    <Flex ml={{ base: 0, md: 60 }} px={{ base: 4, md: 4 }} height="20" alignItems="center" justifyContent={{ base: 'space-between', md: 'flex-end'}} {...rest} bg='white' >
      <IconButton display={{ base: 'flex', md: 'none' }} variant="outline" aria-label="open menu" icon={<IoMenu />} onClick={(()=>{onToggle()})} />
      <HStack spacing={{ base: '0', md: '6' }} bg='red'>
        <IconButton size="lg" variant="ghost" aria-label="open menu" icon={<FaBell />} />
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
              <HStack>
                <Avatar size={'sm'} src={ 'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9' }/>
                <VStack display={{ base: 'none', md: 'flex' }} alignItems="flex-start" spacing="1px" ml="2">
                  <Text fontSize="sm">Justina Clark</Text>
                  <Text fontSize="xs" color="gray.600"> Admin </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  {/**
                   * 
                  <FiChevronDown />
                   */}
                </Box>
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem>Billing</MenuItem>
              <MenuDivider />
              <MenuItem>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  )
}

const NavItem = (props) => {
    const { icon, children, ...rest } = props;
    return (
      <Flex align="center" mx='3' my='2' px="4" pl="4" py="3" cursor="pointer" _hover={{ bg: "gray.300", color: "gray.900", borderRadius:5,boxShadow:'sm' }} fontWeight="bold" fontSize={'md'} transition=".3s ease" {...rest}>
        {icon && ( <Icon mx="2" boxSize="5" _groupHover={{ color: "gray.900", }} as={icon} /> )}
        {children}
      </Flex>
    );
  };

const SidebarContent = ({onClose,navigation,display,width}) => {
  const {active_page,set_page} = 'useContext(dashboardContext)';
  const {user} = useContext(UserContext)
  const pathname = usePathname();
  const pathArr = pathname?.split('/');
  const router = useRouter();

  return(
    <Box as="nav" pos="fixed" top="0" left="0" zIndex="sticky" h="full" pb="10" overflowX="hidden" overflowY="auto" bg="white" bordercolor="inherit" boxShadow={'sm'} w={width} display={display}>
      <Flex px='4' py='5' align='center' justify='space-between'>
        <LOGO color='#4E2FD7' size='24px'/>
        {/**<Icon size="md" aria-label="close menu" as={IoCloseSharp} display={{sm:'flex',md:'none'}} cursor={'pointer'} onClick={(()=>{onClose()})}/>*/}
        <IconButton display={{ base: 'flex', md: 'none' }} variant="outline" aria-label="open menu" icon={<IoCloseSharp />} onClick={(()=>{onClose()})} />
      </Flex>
      {navigation?.map((item)=>{
        return(
          <NavItem key={item?.id} bg={pathArr[2] === item?.title?.toLowerCase() ? '#E4F0FC' : '#FAFAFA'} color={pathArr[2] === item?.title?.toLowerCase() ? '#4E2FD7' : '#9298AC'} borderRadius={pathArr[2] ==- item?.title?.toLowerCase()? 'md' : '5'} icon={item?.icon} onClick={(()=>{router.push(item?.route);onClose()})}>
            {item.title}
          </NavItem>
        )
      })}
    </Box>
  )};