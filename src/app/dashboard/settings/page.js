'use client'
import React, { useContext } from 'react'
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Text, Grid, GridItem, Badge, Flex, Icon, TableContainer, Table, Thead, Tr, Th, Tbody, Td, HStack, useDisclosure} from '@chakra-ui/react'
import { MdChevronRight, MdClose, MdDone, MdOutlineAdminPanelSettings } from 'react-icons/md'
import { UserContext } from '@/components/providers/user.context';
import { GrFormEdit } from 'react-icons/gr';
import { useRouter } from 'next/navigation';
import DELETE_ACCOUNT_ALERT from '@/components/ui/user/DELETE_ACCOUNT_ALERT';
import Link from 'next/link';

function Page() {
    const {user} = useContext(UserContext);
    const USER_DATA = user?.data?.data;
    const USER_ID = user?.data?.data?._id;
    const router = useRouter();
    const DELETE_ACCOUNT_ALERT_DISCLOSURE = useDisclosure()

    return (
        <Box>
            <DELETE_ACCOUNT_ALERT isOpen={DELETE_ACCOUNT_ALERT_DISCLOSURE?.isOpen} onClose={DELETE_ACCOUNT_ALERT_DISCLOSURE?.onClose} USER_ID={USER_ID} USER_DATA={USER_DATA}/>
            <Text fontWeight='bold' fontSize='32px'>Personal Settings</Text>
            <Breadcrumb spacing='8px' separator={<MdChevronRight color='gray.500' />}>
                <BreadcrumbItem>
                    <BreadcrumbLink href={`/dashboard/home/?uid=${user?.data?.data?._id}`}>Home</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink isCurrentPage>settings</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <Box boxShadow={'md'} my='4' p='4' borderRadius={'md'}>
                <Flex justify={'flex-end'} align='center' color='gray.600' gap='2' onClick={(()=>{router.push(`/dashboard/settings/edit?uid=${user?.data?.data?._id}`)})} cursor={'pointer'}>
                    <Text fontWeight={'bold'} fontSize={'md'}>Edit</Text>
                    <Icon boxSize='6' as={GrFormEdit} cursor='pointer'/>
                </Flex>
                <Grid
                    templateRows={{base:'repeat(2, 1fr)',md:'repeat(1, 1fr)'}}
                    templateColumns={{base:'repeat(1, 1fr)',md:'repeat(2, 1fr)'}}
                    gap={4}
                    my='2'
                >
                    <GridItem>
                        <Box>
                            <Text fontWeight={'bold'}>Name</Text>
                            <Text fontWeight={''}>{USER_DATA?.name}</Text>
                        </Box>
                        <Box my='2'>
                            <Text fontWeight={'bold'}>UserName</Text>
                            <Text fontWeight={''}>{USER_DATA?.username}</Text>
                        </Box>
                        <Box my='2'>
                            <Text fontWeight={'bold'}>Email</Text>
                            <Text fontWeight={''}>{USER_DATA?.email}</Text>
                        </Box>
                        <Box my='2'>
                            <Text fontWeight={'bold'}>Mobile</Text>
                            <Text fontWeight={''}>{USER_DATA?.mobile}</Text>
                        </Box>
                    </GridItem>
                    <GridItem>
                        <Box>
                            <Text fontWeight={'bold'}>Current role</Text>
                            <Badge fontSize="xs" color="#ffffff" bg='#4E2FD7' >{USER_DATA?.store_admin_account_ref?.role}</Badge>
                        </Box>
                        <Box my='2'>
                            <Text fontWeight={'bold'}>Store(s)</Text>
                            {USER_DATA?.store_ref?.map((store)=>{
                                return (
                                    <Text fontWeight={''} my='2'>{store?.name}</Text>
                                )
                            })}
                        </Box>
                    </GridItem>
                </Grid>
            </Box>
            <Flex boxShadow={'md'} borderRadius={'md'} justify={'space-between'} p='4' my='4' align={'center'} flexDirection={{base:'column',md:'row'}} gap='2'>
                <HStack align={'center'}>
                    <Icon as={MdOutlineAdminPanelSettings} boxSize='5'/>
                    <Text>Account Management</Text>
                </HStack>
                <HStack>
                    <Link fontSize={'sm'} fontWeight={'bold'} color='gray.400' textDecoration={'1px solid underline'} my='4' cursor={'pointer'} href={`/password_reset?email=${USER_DATA?.email}`}>Reset password</Link>
                    <Button onClick={DELETE_ACCOUNT_ALERT_DISCLOSURE?.onOpen}>Delete Account</Button>
                </HStack>
            </Flex>
            <Box p='4' boxShadow={'md'} borderRadius={'md'}>
                <Text fontWeight={'bold'} my='2'>Permissions</Text>
                <TableContainer>
                    <Table size='md'>
                        <Thead>
                            <Tr>
                                <Th></Th>
                                <Th>VIEW</Th>
                                <Th>CREATE</Th>
                                <Th>EDIT</Th>
                                <Th>DELETE</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            <Tr>
                                <Td>Store</Td>
                                <Td><Icon as={MdDone} boxSize={'5'} color={'gray.400'}/></Td>
                                <Td>{USER_DATA?.store_admin_account_ref?.role === 'owner' || USER_DATA?.store_admin_account_ref?.role === 'manager'? <Icon as={MdDone} boxSize={'5'} color={'gray.400'}/> : <Icon as={MdClose} boxSize={'5'} color={'gray.400'}/>}</Td>
                                <Td>{USER_DATA?.store_admin_account_ref?.role === 'owner' || USER_DATA?.store_admin_account_ref?.role === 'manager'? <Icon as={MdDone} boxSize={'5'} color={'gray.400'}/> : <Icon as={MdClose} boxSize={'5'} color={'gray.400'}/>}</Td>
                                <Td>{USER_DATA?.store_admin_account_ref?.role === 'owner' || USER_DATA?.store_admin_account_ref?.role === 'manager'? <Icon as={MdDone} boxSize={'5'} color={'gray.400'}/> : <Icon as={MdClose} boxSize={'5'} color={'gray.400'}/>}</Td>
                            </Tr>
                            <Tr>
                                <Td>Staff</Td>
                                <Td><Icon as={MdDone} boxSize={'5'} color={'gray.400'}/></Td>
                                <Td>{USER_DATA?.store_admin_account_ref?.role === 'owner' || USER_DATA?.store_admin_account_ref?.role === 'manager'? <Icon as={MdDone} boxSize={'5'} color={'gray.400'}/> : <Icon as={MdClose} boxSize={'5'} color={'gray.400'}/>}</Td>
                                <Td>{USER_DATA?.store_admin_account_ref?.role === 'owner' || USER_DATA?.store_admin_account_ref?.role === 'manager'? <Icon as={MdDone} boxSize={'5'} color={'gray.400'}/> : <Icon as={MdClose} boxSize={'5'} color={'gray.400'}/>}</Td>
                                <Td>{USER_DATA?.store_admin_account_ref?.role === 'owner' || USER_DATA?.store_admin_account_ref?.role === 'manager'? <Icon as={MdDone} boxSize={'5'} color={'gray.400'}/> : <Icon as={MdClose} boxSize={'5'} color={'gray.400'}/>}</Td>
                            </Tr>
                            <Tr>
                                <Td>Vendor</Td>
                                <Td><Icon as={MdDone} boxSize={'5'} color={'gray.400'}/></Td>
                                <Td>{USER_DATA?.store_admin_account_ref?.role === 'owner' || USER_DATA?.store_admin_account_ref?.role === 'manager'? <Icon as={MdDone} boxSize={'5'} color={'gray.400'}/> : <Icon as={MdClose} boxSize={'5'} color={'gray.400'}/>}</Td>
                                <Td>{USER_DATA?.store_admin_account_ref?.role === 'owner' || USER_DATA?.store_admin_account_ref?.role === 'manager'? <Icon as={MdDone} boxSize={'5'} color={'gray.400'}/> : <Icon as={MdClose} boxSize={'5'} color={'gray.400'}/>}</Td>
                                <Td>{USER_DATA?.store_admin_account_ref?.role === 'owner' || USER_DATA?.store_admin_account_ref?.role === 'manager'? <Icon as={MdDone} boxSize={'5'} color={'gray.400'}/> : <Icon as={MdClose} boxSize={'5'} color={'gray.400'}/>}</Td>
                            </Tr>
                            <Tr>
                                <Td>Product</Td>
                                <Td><Icon as={MdDone} boxSize={'5'} color={'gray.400'}/></Td>
                                <Td>{USER_DATA?.store_admin_account_ref?.role === 'owner' || USER_DATA?.store_admin_account_ref?.role === 'manager'? <Icon as={MdDone} boxSize={'5'} color={'gray.400'}/> : <Icon as={MdClose} boxSize={'5'} color={'gray.400'}/>}</Td>
                                <Td>{USER_DATA?.store_admin_account_ref?.role === 'owner' || USER_DATA?.store_admin_account_ref?.role === 'manager'? <Icon as={MdDone} boxSize={'5'} color={'gray.400'}/> : <Icon as={MdClose} boxSize={'5'} color={'gray.400'}/>}</Td>
                                <Td>{USER_DATA?.store_admin_account_ref?.role === 'owner' || USER_DATA?.store_admin_account_ref?.role === 'manager'? <Icon as={MdDone} boxSize={'5'} color={'gray.400'}/> : <Icon as={MdClose} boxSize={'5'} color={'gray.400'}/>}</Td>
                            </Tr>
                            <Tr>
                                <Td>Customer</Td>
                                <Td><Icon as={MdDone} boxSize={'5'} color={'gray.400'}/></Td>
                                <Td>{USER_DATA?.store_admin_account_ref?.role === 'owner' || USER_DATA?.store_admin_account_ref?.role === 'manager'? <Icon as={MdDone} boxSize={'5'} color={'gray.400'}/> : <Icon as={MdClose} boxSize={'5'} color={'gray.400'}/>}</Td>
                                <Td>{USER_DATA?.store_admin_account_ref?.role === 'owner' || USER_DATA?.store_admin_account_ref?.role === 'manager'? <Icon as={MdDone} boxSize={'5'} color={'gray.400'}/> : <Icon as={MdClose} boxSize={'5'} color={'gray.400'}/>}</Td>
                                <Td>{USER_DATA?.store_admin_account_ref?.role === 'owner' || USER_DATA?.store_admin_account_ref?.role === 'manager'? <Icon as={MdDone} boxSize={'5'} color={'gray.400'}/> : <Icon as={MdClose} boxSize={'5'} color={'gray.400'}/>}</Td>
                            </Tr>
                            <Tr>
                                <Td>Transcations</Td>
                                <Td><Icon as={MdDone} boxSize={'5'} color={'gray.400'}/></Td>
                                <Td>{USER_DATA?.store_admin_account_ref?.role === 'owner' || USER_DATA?.store_admin_account_ref?.role === 'manager'? <Icon as={MdDone} boxSize={'5'} color={'gray.400'}/> : <Icon as={MdClose} boxSize={'5'} color={'gray.400'}/>}</Td>
                                <Td>{USER_DATA?.store_admin_account_ref?.role === 'owner' || USER_DATA?.store_admin_account_ref?.role === 'manager'? <Icon as={MdDone} boxSize={'5'} color={'gray.400'}/> : <Icon as={MdClose} boxSize={'5'} color={'gray.400'}/>}</Td>
                                <Td>{USER_DATA?.store_admin_account_ref?.role === 'owner' || USER_DATA?.store_admin_account_ref?.role === 'manager'? <Icon as={MdDone} boxSize={'5'} color={'gray.400'}/> : <Icon as={MdClose} boxSize={'5'} color={'gray.400'}/>}</Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
  )
}

export default Page