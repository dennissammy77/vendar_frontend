'use client'

import React, { useContext, useState } from 'react';
import { 
    Box, 
    Container, 
    Heading, 
    Text, 
    Flex, 
    Grid, 
    GridItem, 
    Button, 
    Badge, 
    VStack, 
    HStack, 
    Icon, 
    Divider, 
    useToast,
    Card,
    CardBody,
    CardHeader,
    Stack,
    IconButton,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    Select,
    Textarea
} from '@chakra-ui/react';
import { UserContext } from '@/components/providers/user.context';
import { useRouter } from 'next/navigation';
// import { 
//     CheckIcon, 
//     StarIcon, 
//     LockIcon, 
//     ArrowForwardIcon,
//     InfoIcon,
//     ChevronDownIcon,
//     ChevronUpIcon
// } from '@chakra-ui/icons';
import { FaCheck } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { FaLock } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { FaChevronUp } from "react-icons/fa";

const SUBSCRIPTION_PLANS = [
    {
        id: 'free_trial',
        name: 'Free Trial',
        price: 0,
        period: '1 month',
        description: 'Try all Pro features for free',
        badge: 'Most Popular',
        badgeColor: 'green',
        isPopular: true,
        features: [
            'All Pro features',
            'Full access to dashboard',
            'Complete feature set',
            'No limitations',
            'Perfect for testing'
        ],
        limitations: [],
        buttonText: 'Start Free Trial',
        buttonColor: 'green'
    },
    {
        id: 'starter',
        name: 'Starter',
        price: 2500,
        period: 'monthly',
        description: 'Perfect for small businesses',
        badge: 'Recommended',
        badgeColor: 'blue',
        isPopular: false,
        features: [
            'One store management',
            'Multiple vendors support',
            'Multiple product listings',
            '1 staff member management',
            'Basic analytics',
            'Email support'
        ],
        limitations: [
            'Limited to 1 store',
            'Only 1 staff member',
            'Basic support only'
        ],
        buttonText: 'Choose Starter',
        buttonColor: 'blue'
    },
    {
        id: 'pro',
        name: 'Pro',
        price: 5000,
        period: 'monthly',
        description: 'Advanced features for growing businesses',
        badge: 'Best Value',
        badgeColor: 'purple',
        isPopular: false,
        features: [
            'Unlimited store management',
            'Unlimited vendors',
            'Unlimited product listings',
            'Unlimited staff management',
            'Advanced analytics',
            'Priority support',
            'Vendor shelf subscription management (coming soon)',
            'API access',
            'Custom integrations'
        ],
        limitations: [],
        buttonText: 'Choose Pro',
        buttonColor: 'purple'
    }
];

const PRICING_FEATURES = [
    'Store Management',
    'Vendor Management', 
    'Product Listings',
    'Staff Management',
    'Analytics & Reports',
    'Support Level',
    'API Access',
    'Custom Integrations'
];

const FEATURE_COMPARISON = {
    'free_trial': ['Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Advanced', 'Priority', 'Yes', 'Yes'],
    'starter': ['1 Store', 'Unlimited', 'Unlimited', '1 Staff', 'Basic', 'Email', 'No', 'No'],
    'pro': ['Unlimited', 'Unlimited', 'Unlimited', 'Unlimited', 'Advanced', 'Priority', 'Yes', 'Yes']
};

function SubscriptionPage() {
    const { user } = useContext(UserContext);
    const router = useRouter();
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showComparison, setShowComparison] = useState(true);
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: ''
    });

    const currentUserPlan = user?.data?.data?.subscription_ref?.plan || 'free';
    const currentUserStatus = user?.data?.data?.subscription_ref?.status || false;

    const handleSelectPlan = (plan) => {
        if (plan.id === 'free_trial') {
            // Handle free trial signup
            toast({
                title: 'Free Trial Started!',
                description: 'You now have access to all Pro features for 1 month.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            // Redirect to dashboard
            router.push('/dashboard');
        } else {
            // Send plan details to WhatsApp
            sendPlanDetailsToWhatsApp(plan);
            setSelectedPlan(plan);
            onOpen();
        }
    };

    const sendPlanDetailsToWhatsApp = (plan) => {
        // Your WhatsApp number (replace with your actual number)
        const whatsappNumber = "254700000000"; // Replace with your actual WhatsApp number
        
        // Create the message with plan details
        const message = `🎉 *New Plan Selection Request*

📋 *Plan Details:*
• Plan: ${plan.name}
• Price: ${formatPrice(plan.price)}/${plan.period}
• Description: ${plan.description}

✨ *Key Features:*
${plan.features.map(feature => `• ${feature}`).join('\n')}

${plan.limitations.length > 0 ? `⚠️ *Limitations:*\n${plan.limitations.map(limitation => `• ${limitation}`).join('\n')}\n\n` : ''}

👤 *Customer Info:*
• Name: ${user?.data?.data?.name || 'Not provided'}
• Email: ${user?.data?.data?.email || 'Not provided'}
• Phone: ${user?.data?.data?.phone || 'Not provided'}

🕒 *Request Time:* ${new Date().toLocaleString()}

Please contact this customer to complete their subscription setup!`;

        // Encode the message for URL
        const encodedMessage = encodeURIComponent(message);
        
        // Create WhatsApp URL
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        
        // Open WhatsApp in a new tab
        window.open(whatsappUrl, '_blank');
        
        // Show success toast
        toast({
            title: 'Plan Details Sent to WhatsApp!',
            description: 'The plan details have been sent to our WhatsApp for processing.',
            status: 'success',
            duration: 5000,
            isClosable: true,
        });
    };

    const handleContactSubmit = async () => {
        // Handle contact form submission for paid plans
        toast({
            title: 'Contact Request Sent!',
            description: 'Our team will contact you within 24 hours to set up your subscription.',
            status: 'success',
            duration: 5000,
            isClosable: true,
        });
        onClose();
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES'
        }).format(price);
    };

    return (
        <Box bg="gray.50" minH="100vh">
            {/* Header Section */}
            <Box bg="white" shadow="sm" py={8}>
                <Container maxW="7xl">
                    <VStack spacing={6} textAlign="center">
                        <Heading size="2xl" color="gray.800">
                            Choose Your Perfect Plan
                        </Heading>
                        <Text fontSize="xl" color="gray.600" maxW="2xl">
                            Scale your business with our flexible subscription plans. 
                            Start with a free trial or jump right into our powerful features.
                        </Text>
                        <HStack spacing={4}>
                            <Badge colorScheme="green" px={3} py={1} borderRadius="full">
                                No Setup Fees
                            </Badge>
                            <Badge colorScheme="blue" px={3} py={1} borderRadius="full">
                                Cancel Anytime
                            </Badge>
                            <Badge colorScheme="purple" px={3} py={1} borderRadius="full">
                                24/7 Support
                            </Badge>
                        </HStack>
                    </VStack>
                </Container>
            </Box>

            <Container maxW="7xl" py={16}>
                {/* Current Plan Status */}
                {user && (
                    <Box mb={8} p={6} bg="white" borderRadius="lg" shadow="sm">
                        <HStack justify="space-between" align="center">
                            <VStack align="start" spacing={1}>
                                <Text fontSize="lg" fontWeight="semibold">
                                    Current Plan: {currentUserPlan.charAt(0).toUpperCase() + currentUserPlan.slice(1)}
                                </Text>
                                <Text color="gray.600">
                                    Status: {currentUserStatus ? 'Active' : 'Inactive'}
                                </Text>
                            </VStack>
                            <Button 
                                colorScheme="blue" 
                                variant="outline"
                                onClick={() => router.push('/dashboard/settings')}
                            >
                                Manage Subscription
                            </Button>
                        </HStack>
                    </Box>
                )}

                {/* Pricing Cards */}
                <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={8} mb={16}>
                    {SUBSCRIPTION_PLANS.map((plan) => (
                        <GridItem key={plan.id}>
                            <Card 
                                h="full" 
                                shadow={plan.isPopular ? "xl" : "md"}
                                border={plan.isPopular ? "2px solid" : "1px solid"}
                                borderColor={plan.isPopular ? "green.400" : "gray.200"}
                                position="relative"
                                _hover={{ transform: 'translateY(-4px)', transition: 'all 0.3s' }}
                            >
                                {plan.isPopular && (
                                    <Badge
                                        position="absolute"
                                        top="-12px"
                                        left="50%"
                                        transform="translateX(-50%)"
                                        colorScheme={plan.badgeColor}
                                        px={4}
                                        py={1}
                                        borderRadius="full"
                                        fontSize="sm"
                                        fontWeight="bold"
                                    >
                                        <Icon as={FaStar} mr={1} />
                                        {plan.badge}
                                    </Badge>
                                )}
                                
                                <CardHeader pb={2}>
                                    <VStack spacing={3} align="start">
                                        <Heading size="lg" color="gray.800">
                                            {plan.name}
                                        </Heading>
                                        <VStack spacing={1} align="start">
                                            <HStack>
                                                <Text fontSize="3xl" fontWeight="bold" color="gray.900">
                                                    {formatPrice(plan.price)}
                                                </Text>
                                                <Text color="gray.600">/ {plan.period}</Text>
                                            </HStack>
                                            <Text color="gray.600" fontSize="sm">
                                                {plan.description}
                                            </Text>
                                        </VStack>
                                    </VStack>
                                </CardHeader>

                                <CardBody pt={2}>
                                    <VStack spacing={4} align="stretch">
                                        {/* Features */}
                                        <VStack spacing={2} align="start">
                                            {plan.features.map((feature, index) => (
                                                <HStack key={index} spacing={2}>
                                                    <FaCheck />
                                                    {/* <Icon as={CheckIcon} color="green.500" boxSize={4} /> */}
                                                    <Text fontSize="sm" color="gray.700">
                                                        {feature}
                                                    </Text>
                                                </HStack>
                                            ))}
                                        </VStack>

                                        {/* Limitations */}
                                        {plan.limitations.length > 0 && (
                                            <VStack spacing={2} align="start">
                                                <Text fontSize="sm" fontWeight="semibold" color="gray.600">
                                                    Limitations:
                                                </Text>
                                                {plan.limitations.map((limitation, index) => (
                                                    <HStack key={index} spacing={2}>
                                                        <Icon as={FaLock} color="orange.500" boxSize={3} />
                                                        <Text fontSize="xs" color="gray.600">
                                                            {limitation}
                                                        </Text>
                                                    </HStack>
                                                ))}
                                            </VStack>
                                        )}

                                        {/* Action Button */}
                                        <Button
                                            colorScheme={plan.buttonColor}
                                            size="lg"
                                            rightIcon={<IoIosArrowForward />}
                                            onClick={() => handleSelectPlan(plan)}
                                            isDisabled={currentUserPlan === plan.id && currentUserStatus}
                                            _hover={{ transform: 'translateY(-1px)' }}
                                        >
                                            {currentUserPlan === plan.id && currentUserStatus 
                                                ? 'Current Plan' 
                                                : plan.buttonText
                                            }
                                        </Button>
                                    </VStack>
                                </CardBody>
                            </Card>
                        </GridItem>
                    ))}
                </Grid>

                {/* Feature Comparison Toggle */}
                <Flex justify="center" mb={8}>
                    <Button
                        variant="outline"
                        rightIcon={showComparison ? <FaChevronUp /> : <FaChevronDown />}
                        onClick={() => setShowComparison(!showComparison)}
                    >
                        {showComparison ? 'Hide' : 'Show'} Feature Comparison
                    </Button>
                </Flex>

                {/* Feature Comparison Table */}
                {showComparison && (
                    <Box bg="white" borderRadius="lg" shadow="md" overflow="hidden" mb={16}>
                        <Box p={6} bg="gray.50" borderBottom="1px solid" borderColor="gray.200">
                            <Heading size="md" textAlign="center">
                                Feature Comparison
                            </Heading>
                        </Box>
                        <Box overflowX="auto">
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f7fafc' }}>
                                        <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                                            Features
                                        </th>
                                        {SUBSCRIPTION_PLANS.map((plan) => (
                                            <th 
                                                key={plan.id} 
                                                style={{ 
                                                    padding: '16px', 
                                                    textAlign: 'center', 
                                                    borderBottom: '1px solid #e2e8f0',
                                                    backgroundColor: plan.isPopular ? '#f0fff4' : '#f7fafc'
                                                }}
                                            >
                                                {plan.name}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {PRICING_FEATURES.map((feature, index) => (
                                        <tr key={feature} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                            <td style={{ padding: '16px', fontWeight: '500' }}>
                                                {feature}
                                            </td>
                                            {SUBSCRIPTION_PLANS.map((plan) => (
                                                <td 
                                                    key={plan.id} 
                                                    style={{ 
                                                        padding: '16px', 
                                                        textAlign: 'center',
                                                        backgroundColor: plan.isPopular ? '#f0fff4' : 'white'
                                                    }}
                                                >
                                                    <Text fontSize="sm" color="gray.700">
                                                        {FEATURE_COMPARISON[plan.id][index]}
                                                    </Text>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Box>
                    </Box>
                )}

                {/* FAQ Section */}
                <Box bg="white" borderRadius="lg" shadow="md" p={8} mb={16}>
                    <Heading size="lg" mb={6} textAlign="center">
                        Frequently Asked Questions
                    </Heading>
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
                        <VStack spacing={4} align="start">
                            <Box>
                                <Text fontWeight="semibold" mb={2}>
                                    Can I switch plans anytime?
                                </Text>
                                <Text color="gray.600" fontSize="sm">
                                    Yes! You can upgrade or downgrade your plan at any time. 
                                    Changes take effect immediately.
                                </Text>
                            </Box>
                            <Box>
                                <Text fontWeight="semibold" mb={2}>
                                    Is there a setup fee?
                                </Text>
                                <Text color="gray.600" fontSize="sm">
                                    No setup fees for any of our plans. You only pay the monthly subscription fee.
                                </Text>
                            </Box>
                        </VStack>
                        <VStack spacing={4} align="start">
                            <Box>
                                <Text fontWeight="semibold" mb={2}>
                                    What happens after the free trial?
                                </Text>
                                <Text color="gray.600" fontSize="sm">
                                    After your free trial, you can choose to continue with a paid plan 
                                    or your account will be limited to basic features.
                                </Text>
                            </Box>
                            <Box>
                                <Text fontWeight="semibold" mb={2}>
                                    Do you offer refunds?
                                </Text>
                                <Text color="gray.600" fontSize="sm">
                                    We offer a 30-day money-back guarantee on all paid plans.
                                </Text>
                            </Box>
                        </VStack>
                    </Grid>
                </Box>

                {/* Contact Section */}
                <Box bg="white" borderRadius="lg" shadow="md" p={8} textAlign="center">
                    <VStack spacing={4}>
                        <Heading size="lg">
                            Need a Custom Solution?
                        </Heading>
                        <Text color="gray.600" maxW="2xl">
                            Have specific requirements or need a custom plan? 
                            Our team is here to help you find the perfect solution.
                        </Text>
                        <Button 
                            colorScheme="purple" 
                            size="lg"
                            rightIcon={<IoIosArrowForward />}
                            onClick={() => router.push('/support')}
                        >
                            Contact Sales Team
                        </Button>
                    </VStack>
                </Box>
            </Container>

            {/* Contact Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="lg">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        Contact Us for {selectedPlan?.name} Plan
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <VStack spacing={4}>
                            <Text color="gray.600">
                                Fill out the form below and our team will contact you within 24 hours 
                                to set up your {selectedPlan?.name} subscription.
                            </Text>
                            
                            <FormControl>
                                <FormLabel>Full Name</FormLabel>
                                <Input 
                                    placeholder="Enter your full name"
                                    value={contactForm.name}
                                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                                />
                            </FormControl>
                            
                            <FormControl>
                                <FormLabel>Email Address</FormLabel>
                                <Input 
                                    type="email"
                                    placeholder="Enter your email"
                                    value={contactForm.email}
                                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                                />
                            </FormControl>
                            
                            <FormControl>
                                <FormLabel>Phone Number</FormLabel>
                                <Input 
                                    placeholder="Enter your phone number"
                                    value={contactForm.phone}
                                    onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                                />
                            </FormControl>
                            
                            <FormControl>
                                <FormLabel>Company Name (Optional)</FormLabel>
                                <Input 
                                    placeholder="Enter your company name"
                                    value={contactForm.company}
                                    onChange={(e) => setContactForm({...contactForm, company: e.target.value})}
                                />
                            </FormControl>
                            
                            <FormControl>
                                <FormLabel>Additional Message</FormLabel>
                                <Textarea 
                                    placeholder="Tell us about your specific needs..."
                                    value={contactForm.message}
                                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                                />
                            </FormControl>
                            
                            <Button 
                                colorScheme={selectedPlan?.buttonColor || 'blue'} 
                                size="lg" 
                                w="full"
                                onClick={handleContactSubmit}
                            >
                                Send Contact Request
                            </Button>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
}

export default SubscriptionPage;
