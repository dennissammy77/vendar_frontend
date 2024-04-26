'use client'
import { Avatar, Badge, Box, Button, Divider, Drawer, DrawerContent, DrawerOverlay, Flex, HStack, Icon, IconButton, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, VStack, useDisclosure, MenuGroup } from "@chakra-ui/react";
import { useContext } from "react";
import { usePathname, useRouter  } from "next/navigation";
import { UserContext } from "@/components/providers/user.context";

import { IoMenu } from "react-icons/io5";
import { RiAccountCircleLine } from "react-icons/ri";
import { HiOutlineLogout } from "react-icons/hi";
import { FaBell, FaStore } from "react-icons/fa";
import LOGO from "@/app/lib/LOGO";
import { IoCloseSharp } from "react-icons/io5";
import Link from "next/link";
import useLogOut from "@/components/hooks/useLogOut.hook";
import { IoMdAdd } from "react-icons/io";
import SELECT_ACTIVE_STORE from "@/components/hooks/SELECT_ACTIVE_STORE";

import Cookies from 'universal-cookie';


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
            <TopNav onClose={sidebar.onClose} onToggle={sidebar.onToggle}/>
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
  const {user} = useContext(UserContext);
  const cookies = new Cookies();

  const HandleLogout =()=>{
    useLogOut();
    if (typeof(window) === "undefined") {
      window.location.href(`/`);
    }
  }

  const Handle_select_active_store=(store)=>{
    SELECT_ACTIVE_STORE(store)
  }
  const active_store = cookies.get('active_store');
  return (
    <Flex ml={{ base: 0, md: 60 }} px={{ base: 4, md: 4 }} height="20" alignItems="center" justifyContent={{ base: 'space-between', md: 'flex-end'}} {...rest} bg='white' boxShadow={'md'}>
      <HStack spacing='2' align='center' hideFrom={'md'}>
        <IconButton  variant="outline" aria-label="open menu" icon={<IoMenu />} onClick={(()=>{onToggle()})} />
        <LOGO color='#4E2FD7' size='18px'/>
      </HStack>
      <HStack spacing={{ base: '0', md: '4' }}>
        {/**
         * 
        <IconButton size="lg" variant="ghost" aria-label="open menu" icon={<FaBell />} />
         */}
        {user?.data?.data?.account_type === 'vendor'? null : 
          <Menu>
            <MenuButton
                as={Button}
                bgColor={'#4E2FD7'} 
                color='#ffffff' 
                leftIcon={<IoMdAdd />} 
                //onClick={(()=>{router.push(`/dashboard/transactions/new?uid=${user?.data?.data?._id}&store_id=${user?.data?.data?.store_ref[0]?._id}`)})} 
                mr='2'
              >
                New Sale
            </MenuButton>
            <MenuList>
                {user?.data?.data?.store_ref?.map((store)=>{
                  return(
                    <MenuItem  
                      as='a' 
                      href={`/dashboard/transactions/new?uid=${user?.data?.data?._id}&store_id=${store?._id}`} 
                      icon={<FaStore/>}
                      key={store?._id}
                    > 
                     {store?.name}
                    </MenuItem>
                  )
                })}
            </MenuList>
          </Menu>
        }
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
              <HStack>
                <Avatar size={'sm'} name={user?.data?.data?.name}/>
                <VStack display={{ base: 'none', md: 'flex' }} alignItems="flex-start" spacing="1px" ml="2">
                  <Text fontSize="md">{user?.data?.data?.name || '-'}</Text>
                  <Badge fontSize="xs" color="#ffffff" bg='#4E2FD7'>{user?.data?.data?.account_type}</Badge>
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
              <MenuGroup title='Store(s)'>
                {user?.data?.data?.store_ref?.map((store)=>{
                  return(
                    <MenuItem  
                      as='a' 
                      href={`/dashboard/home?uid=${user?.data?.data?._id}&store_id=${store?._id}`} 
                      icon={<FaStore/>}
                      key={store?._id}
                      onClick={(()=>{Handle_select_active_store(store?._id)})}
                      bg={active_store === store?._id ? '#E4F0FC' : ''}
                      color={active_store === store?._id ? '#4E2FD7' : ''}
                    > 
                     {store?.name}
                    </MenuItem>
                  )
                })}
              </MenuGroup>
              <MenuGroup title='Profile'>
                <MenuItem  
                as='a' 
                href={`/dashboard/settings?uid=${user?.data?.data?._id}&store_id=${user?.data?.data?.store_ref[0]?._id}`} 
                icon={<RiAccountCircleLine/>}
              > 
                My Account </MenuItem>
              </MenuGroup>
              <MenuDivider />
              <MenuGroup title='Help'>
                {/**
                 * 
                <MenuItem>FAQs</MenuItem>
                 */}
                <MenuItem as='a' href={`/dashboard/support?uid=${user?.data?.data?._id}&store_id=${user?.data?.data?.store_ref[0]?._id}`}>Support</MenuItem>
              </MenuGroup>
              <MenuDivider />
              <MenuItem as='a' onClick={(()=>{HandleLogout})} href={'/'} cursor={'pointer'} color='#4E2FD7' fontWeight={'bold'} icon={<HiOutlineLogout/>}>
                Log out  
              </MenuItem>
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
      <Link href={`${props?.route}?uid=${props?.user_id}&store_id=${props?.store_id}`} >
          <Flex align="center" mx='3' my='2' px="4" pl="4" py="3" cursor="pointer" _hover={{ bg: "gray.300", color: "gray.900", borderRadius:5,boxShadow:'sm' }} fontWeight="bold" fontSize={'md'} transition=".3s ease" {...rest}>
          {icon && ( <Icon mx="2" boxSize="5" _groupHover={{ color: "gray.900", }} as={icon} /> )}
          {children}
          </Flex>
      </Link>
    );
  };

const SidebarContent = ({onClose,navigation,display,width}) => {
  const {user} = useContext(UserContext)
  const pathname = usePathname();
  const pathArr = pathname?.split('/');
  const router = useRouter();

  const cookies = new Cookies();

  const active_store = cookies.get('active_store') || user?.data?.data?.store_ref[0]?._id;
  return(
    <Box as="nav" pos="fixed" top="0" left="0" zIndex="sticky" h="full" pb="10" overflowX="hidden" overflowY="auto" bg="white" bordercolor="inherit" boxShadow={'md'} w={width} display={display}>
      <Flex px='4' py='5' align='center' justify='space-between'>
        <LOGO color='#4E2FD7' size='24px'/>
        <IconButton display={{ base: 'flex', md: 'none' }} variant="outline" aria-label="open menu" icon={<IoCloseSharp />} onClick={(()=>{onClose()})} />
      </Flex>
      {navigation?.map((item)=>{
        return(
          <NavItem 
            key={item?.id}
            bg={pathArr[2] === item?.title?.toLowerCase() ? '#E4F0FC' : '#FAFAFA'} 
            color={pathArr[2] === item?.title?.toLowerCase() ? '#4E2FD7' : '#9298AC'} 
            borderRadius={pathArr[2] ==- item?.title?.toLowerCase()? 'md' : '5'} 
            icon={item?.icon}
            route={item?.route}
            user_id={user?.data?.data?._id}
            store_id={active_store}
            onClick={(()=>{
              onClose()
            })}
            display={user?.data?.data?.account_type === 'vendor' && (item?.title.toLowerCase() === 'staff' || item?.title.toLowerCase() === 'vendors' || item?.title.toLowerCase() === 'home' ) ? 'none' : ''}
          >
            {item.title}
          </NavItem>
        )
      })}
    </Box>
  )};