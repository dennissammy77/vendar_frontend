'use client'

import React, { useContext, useState } from 'react';
import { 
    Box, 
    Card, 
    CardBody, 
    CardHeader, 
    Heading, 
    Text, 
    VStack, 
    HStack, 
    Button, 
    Badge, 
    Divider, 
    useToast, 
    Progress, 
    Flex, 
    Icon,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription
} from '@chakra-ui/react';
import { UserContext } from '@/components/providers/user.context';
import { useRouter } from 'next/navigation';
// import { 
//     CheckIcon, 
//     WarningIcon, 
//     CalendarIcon, 
//     CreditCardIcon,
//     StarIcon,
//     ArrowForwardIcon
// } from '@chakra-ui/icons';
import { FaCheck } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";

const SUBSCRIPTION_PLANS = {
    free: {
        name: 'Free Trial',
        price: 0,
        features: ['All Pro features', '1 month duration', 'Full access'],
        color: 'green'
    },
    starter: {
        name: 'Starter',
        price: 1500,
        features: ['1 Store', 'Multiple Vendors', '1 Staff Member', 'Email Support'],
        color: 'blue'
    },
    pro: {
        name: 'Pro',
        price: 3500,
        features: ['Unlimited Stores', 'Unlimited Vendors', 'Unlimited Staff', 'Priority Support', 'API Access'],
        color: 'purple'
    }
};

function SubscriptionManager() {
    const { user } = useContext(UserContext);
    const router = useRouter();
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [loading, setLoading] = useState(false);

    const subscription = user?.data?.data?.subscription_ref;
    const currentPlan = subscription?.plan || 'free';
    const isActive = subscription?.status || false;
    const expiryDate = subscription?.expiry_date;
    const renewalDate = subscription?.renewal_date;

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES'
        }).format(price);
    };

    const calculateDaysRemaining = () => {
        if (!expiryDate) return 0;
        const today = new Date();
        const expiry = new Date(expiryDate);
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(0, diffDays);
    };

    const getDaysRemainingPercentage = () => {
        const daysRemaining = calculateDaysRemaining();
        if (currentPlan === 'free') {
            // Free trial is 30 days
            return (daysRemaining / 30) * 100;
        } else {
            // Monthly subscription
            return (daysRemaining / 30) * 100;
        }
    };

    const handleUpgrade = (plan) => {
        if (plan === 'free') {
            toast({
                title: 'Free Trial Activated!',
                description: 'You now have access to all Pro features for 1 month.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } else {
            // Redirect to subscription page for paid plans
            router.push('/subscription');
        }
    };

    const handleManageSubscription = () => {
        router.push('/subscription');
    };

    const handleCancelSubscription = async () => {
        setLoading(true);
        // Implement cancel subscription logic
        toast({
            title: 'Subscription Cancelled',
            description: 'Your subscription has been cancelled. You can reactivate anytime.',
            status: 'warning',
            duration: 5000,
            isClosable: true,
        });
        setLoading(false);
        onClose();
    };

    const getStatusBadge = () => {
        if (!isActive) {
            return <Badge colorScheme="red">Inactive</Badge>;
        }
        
        if (currentPlan === 'free') {
            const daysRemaining = calculateDaysRemaining();
            if (daysRemaining <= 7) {
                return <Badge colorScheme="orange">Expiring Soon</Badge>;
            }
            return <Badge colorScheme="green">Active</Badge>;
        }
        
        return <Badge colorScheme="green">Active</Badge>;
    };

    const getStatusColor = () => {
        if (!isActive) return 'red';
        if (currentPlan === 'free' && calculateDaysRemaining() <= 7) return 'orange';
        return 'green';
    };

    return (
        <Box>
            {/* Current Subscription Status */}
            <Card mb={6} borderLeft="4px solid" borderLeftColor={`${getStatusColor()}.400`}>
                <CardHeader>
                    <HStack justify="space-between" align="center">
                        <VStack align="start" spacing={1}>
                            <Heading size="md" color="gray.800">
                                Current Subscription
                            </Heading>
                            <Text color="gray.600" fontSize="sm">
                                {SUBSCRIPTION_PLANS[currentPlan]?.name || 'Unknown Plan'}
                            </Text>
                        </VStack>
                        {getStatusBadge()}
                    </HStack>
                </CardHeader>
                
                <CardBody pt={0}>
                    <VStack spacing={4} align="stretch">
                        {/* Subscription Details */}
                        <HStack justify="space-between">
                            <Text fontWeight="semibold">Plan:</Text>
                            <Text>{SUBSCRIPTION_PLANS[currentPlan]?.name}</Text>
                        </HStack>
                        
                        <HStack justify="space-between">
                            <Text fontWeight="semibold">Price:</Text>
                            <Text>{formatPrice(SUBSCRIPTION_PLANS[currentPlan]?.price || 0)}/month</Text>
                        </HStack>
                        
                        <HStack justify="space-between">
                            <Text fontWeight="semibold">Status:</Text>
                            <Text color={`${getStatusColor()}.600`}>
                                {isActive ? 'Active' : 'Inactive'}
                            </Text>
                        </HStack>
                        
                        {expiryDate && (
                            <HStack justify="space-between">
                                <Text fontWeight="semibold">
                                    {currentPlan === 'free' ? 'Trial Expires:' : 'Renewal Date:'}
                                </Text>
                                <Text>
                                    {new Date(expiryDate).toLocaleDateString()}
                                </Text>
                            </HStack>
                        )}

                        {/* Progress Bar for Free Trial */}
                        {currentPlan === 'free' && isActive && (
                            <Box>
                                <HStack justify="space-between" mb={2}>
                                    <Text fontSize="sm" fontWeight="semibold">
                                        Trial Progress
                                    </Text>
                                    <Text fontSize="sm" color="gray.600">
                                        {calculateDaysRemaining()} days remaining
                                    </Text>
                                </HStack>
                                <Progress 
                                    value={getDaysRemainingPercentage()} 
                                    colorScheme={getDaysRemainingPercentage() > 30 ? 'green' : 'orange'}
                                    size="sm"
                                    borderRadius="full"
                                />
                            </Box>
                        )}

                        {/* Warnings */}
                        {currentPlan === 'free' && calculateDaysRemaining() <= 7 && isActive && (
                            <Alert status="warning" borderRadius="md">
                                <AlertIcon />
                                <Box>
                                    <AlertTitle fontSize="sm">Trial Expiring Soon!</AlertTitle>
                                    <AlertDescription fontSize="sm">
                                        Your free trial expires in {calculateDaysRemaining()} days. 
                                        Choose a plan to continue enjoying our services.
                                    </AlertDescription>
                                </Box>
                            </Alert>
                        )}

                        {!isActive && (
                            <Alert status="error" borderRadius="md">
                                <AlertIcon />
                                <Box>
                                    <AlertTitle fontSize="sm">Subscription Inactive</AlertTitle>
                                    <AlertDescription fontSize="sm">
                                        Your subscription is currently inactive. Reactivate to continue using our services.
                                    </AlertDescription>
                                </Box>
                            </Alert>
                        )}
                    </VStack>
                </CardBody>
            </Card>

            {/* Current Plan Features */}
            <Card mb={6}>
                <CardHeader>
                    <Heading size="md" color="gray.800">
                        Current Plan Features
                    </Heading>
                </CardHeader>
                <CardBody pt={0}>
                    <VStack spacing={2} align="start">
                        {SUBSCRIPTION_PLANS[currentPlan]?.features?.map((feature, index) => (
                            <HStack key={index} spacing={3}>
                                <FaCheck/>
                                {/* <Icon as={CheckIcon} color="green.500" boxSize={4} /> */}
                                <Text fontSize="sm" color="gray.700">
                                    {feature}
                                </Text>
                            </HStack>
                        ))}
                    </VStack>
                </CardBody>
            </Card>

            {/* Action Buttons */}
            <VStack spacing={3} align="stretch">
                {currentPlan !== 'pro' && (
                    <Button 
                        colorScheme="purple" 
                        size="lg"
                        rightIcon={<IoIosArrowForward />}
                        onClick={() => handleUpgrade('pro')}
                    >
                        Upgrade to Pro
                    </Button>
                )}
                
                {currentPlan === 'free' && (
                    <Button 
                        colorScheme="blue" 
                        variant="outline"
                        size="lg"
                        rightIcon={<IoIosArrowForward />}
                        onClick={() => handleUpgrade('starter')}
                    >
                        Upgrade to Starter
                    </Button>
                )}

                <HStack spacing={3}>
                    <Button 
                        colorScheme="gray" 
                        variant="outline"
                        flex={1}
                        onClick={handleManageSubscription}
                    >
                        Manage Subscription
                    </Button>
                    
                    {currentPlan !== 'free' && isActive && (
                        <Button 
                            colorScheme="red" 
                            variant="outline"
                            flex={1}
                            onClick={onOpen}
                        >
                            Cancel Subscription
                        </Button>
                    )}
                </HStack>
            </VStack>

            {/* Upgrade Recommendations */}
            {currentPlan !== 'pro' && (
                <Card mt={6} bg="purple.50" border="1px solid" borderColor="purple.200">
                    <CardBody>
                        <VStack spacing={3} align="start">
                            <HStack>
                                <FaStar/>
                                {/* <Icon as={StarIcon} color="purple.500" boxSize={5} /> */}
                                <Text fontWeight="semibold" color="purple.800">
                                    Recommended: Upgrade to Pro
                                </Text>
                            </HStack>
                            <Text fontSize="sm" color="purple.700">
                                Unlock unlimited stores, staff, and advanced features to scale your business.
                            </Text>
                            <Button 
                                colorScheme="purple" 
                                size="sm"
                                onClick={() => router.push('/subscription')}
                            >
                                Learn More
                            </Button>
                        </VStack>
                    </CardBody>
                </Card>
            )}

            {/* Cancel Subscription Modal */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Cancel Subscription</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <VStack spacing={4} align="stretch">
                            <Alert status="warning">
                                <AlertIcon />
                                <Box>
                                    <AlertTitle fontSize="sm">Are you sure?</AlertTitle>
                                    <AlertDescription fontSize="sm">
                                        Cancelling will end your subscription at the end of the current billing period.
                                    </AlertDescription>
                                </Box>
                            </Alert>
                            
                            <Text color="gray.600" fontSize="sm">
                                You can reactivate your subscription anytime from your account settings.
                            </Text>
                            
                            <HStack spacing={3}>
                                <Button 
                                    variant="outline" 
                                    flex={1}
                                    onClick={onClose}
                                >
                                    Keep Subscription
                                </Button>
                                <Button 
                                    colorScheme="red" 
                                    flex={1}
                                    isLoading={loading}
                                    onClick={handleCancelSubscription}
                                >
                                    Cancel Subscription
                                </Button>
                            </HStack>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
}

export default SubscriptionManager;
