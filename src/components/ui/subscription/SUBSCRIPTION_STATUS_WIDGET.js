// 'use client'

// import React from 'react';
// import { 
//     Card, 
//     CardBody, 
//     CardHeader, 
//     Heading, 
//     Text, 
//     VStack, 
//     HStack, 
//     Badge, 
//     Button, 
//     Progress, 
//     Flex,
//     Icon,
//     useColorModeValue
// } from '@chakra-ui/react';
// import { useRouter } from 'next/navigation';
// import { 
//     CheckIcon, 
//     WarningIcon, 
//     StarIcon,
//     ArrowForwardIcon 
// } from '@chakra-ui/icons';

// function SubscriptionStatusWidget({ user, compact = false }) {
//     const router = useRouter();
//     const cardBg = useColorModeValue('white', 'gray.800');
//     const borderColor = useColorModeValue('gray.200', 'gray.600');

//     const subscription = user?.subscription_ref;
//     const currentPlan = subscription?.plan || 'free';
//     const isActive = subscription?.status || false;
//     const expiryDate = subscription?.expiry_date;

//     const formatPrice = (price) => {
//         return new Intl.NumberFormat('en-KE', {
//             style: 'currency',
//             currency: 'KES'
//         }).format(price);
//     };

//     const calculateDaysRemaining = () => {
//         if (!expiryDate) return 0;
//         const today = new Date();
//         const expiry = new Date(expiryDate);
//         const diffTime = expiry - today;
//         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//         return Math.max(0, diffDays);
//     };

//     const getDaysRemainingPercentage = () => {
//         const daysRemaining = calculateDaysRemaining();
//         if (currentPlan === 'free') {
//             return (daysRemaining / 30) * 100;
//         } else {
//             return (daysRemaining / 30) * 100;
//         }
//     };

//     const getPlanInfo = () => {
//         switch (currentPlan) {
//             case 'free':
//                 return {
//                     name: 'Free Trial',
//                     price: 0,
//                     color: 'green',
//                     icon: CheckIcon
//                 };
//             case 'starter':
//                 return {
//                     name: 'Starter',
//                     price: 1500,
//                     color: 'blue',
//                     icon: StarIcon
//                 };
//             case 'pro':
//                 return {
//                     name: 'Pro',
//                     price: 3500,
//                     color: 'purple',
//                     icon: StarIcon
//                 };
//             default:
//                 return {
//                     name: 'Free',
//                     price: 0,
//                     color: 'gray',
//                     icon: CheckIcon
//                 };
//         }
//     };

//     const planInfo = getPlanInfo();
//     const daysRemaining = calculateDaysRemaining();
//     const percentage = getDaysRemainingPercentage();

//     const getStatusBadge = () => {
//         if (!isActive) {
//             return <Badge colorScheme="red" size="sm">Inactive</Badge>;
//         }
        
//         if (currentPlan === 'free') {
//             if (daysRemaining <= 7) {
//                 return <Badge colorScheme="orange" size="sm">Expiring Soon</Badge>;
//             }
//             return <Badge colorScheme="green" size="sm">Active</Badge>;
//         }
        
//         return <Badge colorScheme="green" size="sm">Active</Badge>;
//     };

//     if (compact) {
//         return (
//             <Card bg={cardBg} borderColor={borderColor} size="sm">
//                 <CardBody>
//                     <VStack spacing={2} align="stretch">
//                         <HStack justify="space-between" align="center">
//                             <HStack spacing={2}>
//                                 <Icon as={planInfo.icon} color={`${planInfo.color}.500`} boxSize={4} />
//                                 <Text fontSize="sm" fontWeight="semibold">
//                                     {planInfo.name}
//                                 </Text>
//                             </HStack>
//                             {getStatusBadge()}
//                         </HStack>
                        
//                         {currentPlan === 'free' && isActive && (
//                             <Box>
//                                 <HStack justify="space-between" mb={1}>
//                                     <Text fontSize="xs" color="gray.600">
//                                         Trial Progress
//                                     </Text>
//                                     <Text fontSize="xs" color="gray.600">
//                                         {daysRemaining}d left
//                                     </Text>
//                                 </HStack>
//                                 <Progress 
//                                     value={percentage} 
//                                     colorScheme={percentage > 30 ? 'green' : 'orange'}
//                                     size="xs"
//                                     borderRadius="full"
//                                 />
//                             </Box>
//                         )}
                        
//                         {currentPlan !== 'pro' && (
//                             <Button 
//                                 size="xs" 
//                                 colorScheme={planInfo.color}
//                                 rightIcon={<ArrowForwardIcon />}
//                                 onClick={() => router.push('/subscription')}
//                             >
//                                 Upgrade
//                             </Button>
//                         )}
//                     </VStack>
//                 </CardBody>
//             </Card>
//         );
//     }

//     return (
//         <Card bg={cardBg} borderColor={borderColor}>
//             <CardHeader pb={2}>
//                 <HStack justify="space-between" align="center">
//                     <VStack align="start" spacing={1}>
//                         <HStack spacing={2}>
//                             <Icon as={planInfo.icon} color={`${planInfo.color}.500`} boxSize={5} />
//                             <Heading size="md" color="gray.800">
//                                 {planInfo.name} Plan
//                             </Heading>
//                         </HStack>
//                         <Text color="gray.600" fontSize="sm">
//                             {formatPrice(planInfo.price)}/month
//                         </Text>
//                     </VStack>
//                     {getStatusBadge()}
//                 </HStack>
//             </CardHeader>
            
//             <CardBody pt={0}>
//                 <VStack spacing={4} align="stretch">
//                     {/* Progress Bar for Free Trial */}
//                     {currentPlan === 'free' && isActive && (
//                         <Box>
//                             <HStack justify="space-between" mb={2}>
//                                 <Text fontSize="sm" fontWeight="semibold">
//                                     Trial Progress
//                                 </Text>
//                                 <Text fontSize="sm" color="gray.600">
//                                     {daysRemaining} days remaining
//                                 </Text>
//                             </HStack>
//                             <Progress 
//                                 value={percentage} 
//                                 colorScheme={percentage > 30 ? 'green' : 'orange'}
//                                 size="sm"
//                                 borderRadius="full"
//                             />
//                         </Box>
//                     )}

//                     {/* Plan Features */}
//                     <Box>
//                         <Text fontSize="sm" fontWeight="semibold" mb={2}>
//                             Plan Features:
//                         </Text>
//                         <VStack spacing={1} align="start">
//                             {currentPlan === 'free' && (
//                                 <>
//                                     <Text fontSize="xs" color="gray.600">• All Pro features</Text>
//                                     <Text fontSize="xs" color="gray.600">• 1 month duration</Text>
//                                     <Text fontSize="xs" color="gray.600">• Full access</Text>
//                                 </>
//                             )}
//                             {currentPlan === 'starter' && (
//                                 <>
//                                     <Text fontSize="xs" color="gray.600">• 1 Store</Text>
//                                     <Text fontSize="xs" color="gray.600">• Multiple Vendors</Text>
//                                     <Text fontSize="xs" color="gray.600">• 1 Staff Member</Text>
//                                     <Text fontSize="xs" color="gray.600">• Email Support</Text>
//                                 </>
//                             )}
//                             {currentPlan === 'pro' && (
//                                 <>
//                                     <Text fontSize="xs" color="gray.600">• Unlimited Stores</Text>
//                                     <Text fontSize="xs" color="gray.600">• Unlimited Vendors</Text>
//                                     <Text fontSize="xs" color="gray.600">• Unlimited Staff</Text>
//                                     <Text fontSize="xs" color="gray.600">• Priority Support</Text>
//                                     <Text fontSize="xs" color="gray.600">• API Access</Text>
//                                 </>
//                             )}
//                         </VStack>
//                     </Box>

//                     {/* Action Buttons */}
//                     <VStack spacing={2}>
//                         {currentPlan !== 'pro' && (
//                             <Button 
//                                 colorScheme="purple" 
//                                 size="sm"
//                                 rightIcon={<ArrowForwardIcon />}
//                                 onClick={() => router.push('/subscription')}
//                                 w="full"
//                             >
//                                 Upgrade to Pro
//                             </Button>
//                         )}
                        
//                         <Button 
//                             colorScheme="gray" 
//                             variant="outline"
//                             size="sm"
//                             onClick={() => router.push('/dashboard/settings/subscription')}
//                             w="full"
//                         >
//                             Manage Subscription
//                         </Button>
//                     </VStack>

//                     {/* Warning for Expiring Trial */}
//                     {currentPlan === 'free' && daysRemaining <= 7 && isActive && (
//                         <Flex 
//                             align="center" 
//                             p={3} 
//                             bg="orange.50" 
//                             borderRadius="md" 
//                             border="1px solid" 
//                             borderColor="orange.200"
//                         >
//                             <Icon as={WarningIcon} color="orange.500" boxSize={4} mr={2} />
//                             <Text fontSize="xs" color="orange.700">
//                                 Trial expires in {daysRemaining} days. Upgrade to continue!
//                             </Text>
//                         </Flex>
//                     )}
//                 </VStack>
//             </CardBody>
//         </Card>
//     );
// }

// export default SubscriptionStatusWidget;
