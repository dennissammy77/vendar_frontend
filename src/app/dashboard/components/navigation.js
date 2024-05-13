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
import SELECT_ACTIVE_STORE, { FETCH_ACTIVE_STORE_ID } from "@/components/hooks/SELECT_ACTIVE_STORE";

import Cookies from 'universal-cookie';
import { ACCOUNT_SETTINGS_ICON, ADD_ICON, CHEVRON_DOWN_ICON, MANAGE_ICON } from "@/components/lib/constants/icons";
import { BASE_BRAND, PRIMARY_BRAND, SECONDARY_BRAND, TERTIARY_BRAND } from "@/components/lib/constants/theme";
import { UPDATE_USER_ACCOUNT } from "@/app/api/auth/route";


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
  const {user,set_user_handler} = useContext(UserContext);
  const cookies = new Cookies();
  const router = useRouter();
  const USER_ID = user?.data?.data?._id;
  const USER_DATA = user?.data?.data;
  const STORE_ID = FETCH_ACTIVE_STORE_ID();

  const HandleLogout =()=>{
    useLogOut();
    if (typeof(window) === undefined) {
      router.push('/')
    }else{
      window.location.href = `/`;
    }
  }

  const Handle_select_active_store=async(store)=>{
    SELECT_ACTIVE_STORE(store)
    const data = {
      name:               USER_DATA?.name,
      mobile:             USER_DATA?.mobile,
      active_store_ref:   store
    }
    await UPDATE_USER_ACCOUNT(data,USER_ID)
    set_user_handler(store);
    router.replace(`/dashboard/home?uid=${USER_ID}&store_id=${store}`) 
  }
  return (
    <Flex ml={{ base: 0, md: 60 }} px={{ base: 4, md: 4 }} height="20" align="center" justifyContent={{ base: 'space-between', md: 'flex-end'}} {...rest} bg='white' boxShadow={'md'}>
      <HStack spacing='2' align='center' hideFrom={'md'}>
        <IconButton  variant="outline" aria-label="open menu" icon={<IoMenu />} onClick={(()=>{onToggle()})} />
        <LOGO color={PRIMARY_BRAND} size='18px'/>
      </HStack>
      <HStack spacing={{ base: '0', md: '4' }}>
        {user?.data?.data?.account_type === 'vendor'? null : 
          <Link href={`/dashboard/transactions/new?uid=${USER_ID}&store_id=${STORE_ID}`}>
            <Button
                as={Button}
                bgColor={PRIMARY_BRAND} 
                color='#ffffff' 
                leftIcon={<ADD_ICON />}
                mr='2'
              >
                New Sale
            </Button>
          </Link>
        }
        <Menu>
          <MenuButton py={2} transition="all 0.3s" >
            <HStack>
              <Avatar size={'sm'} name={user?.data?.data?.name}/>
              <Box hideBelow='md' ml="2">
                <Text fontSize="md">{user?.data?.data?.name || '-'}</Text>
                <HStack spacing='2'>
                  <Text fontSize="xs" w='100px' overflow='hidden' textOverflow={'ellipsis'} whiteSpace='nowrap'>{user?.data?.data?.active_store_ref?.name || '-'}</Text>
                  <Icon as={CHEVRON_DOWN_ICON} boxSize={'3'}/>
                </HStack>
                {/**
                 * 
                <Badge fontSize="xs" color="#ffffff" bg={PRIMARY_BRAND}>{user?.data?.data?.account_type}</Badge>
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
                    icon={<FaStore/>}
                    key={store?._id}
                    onClick={(()=>{Handle_select_active_store(store?._id)})}
                    _hover={{bgColor:TERTIARY_BRAND}}
                    bg={user?.data?.data?.active_store_ref?._id === store?._id ? PRIMARY_BRAND : BASE_BRAND}
                    color={user?.data?.data?.active_store_ref?._id === store?._id ? BASE_BRAND : SECONDARY_BRAND}
                    cursor={'pointer'}
                    w='full'
                    overflow='hidden' 
                    textOverflow={'ellipsis'}
                    whiteSpace='nowrap'
                  > 
                    {store?.name}
                  </MenuItem>
                )
              })}
            </MenuGroup>
            <MenuGroup title='Profile'>
              <MenuItem  
                as='a' 
                href={`/dashboard/settings?uid=${USER_ID}&store_id=${STORE_ID}`} 
                icon={<ACCOUNT_SETTINGS_ICON/>}
              > 
                My Account </MenuItem>
            </MenuGroup>
            <MenuDivider />
            <MenuGroup title='Help'>
              {/**
               * 
              <MenuItem>FAQs</MenuItem>
                */}
              <MenuItem as='a' href={`/dashboard/support?uid=${USER_ID}&store_id=${STORE_ID}`}>Support</MenuItem>
            </MenuGroup>
            <MenuDivider />
            <MenuItem as='a' onClick={HandleLogout} cursor={'pointer'} color={PRIMARY_BRAND} fontWeight={'bold'} icon={<HiOutlineLogout/>}>
              Log out  
            </MenuItem>
          </MenuList>
        </Menu>
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
