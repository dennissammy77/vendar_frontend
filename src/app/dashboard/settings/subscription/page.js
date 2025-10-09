'use client'

import React, { useContext } from 'react';
import { 
    Box, 
    Container, 
    Heading, 
    Text, 
    Breadcrumb, 
    BreadcrumbItem, 
    BreadcrumbLink,
    Flex,
    Spinner
} from '@chakra-ui/react';
import { UserContext } from '@/components/providers/user.context';
import { useSearchParams } from 'next/navigation';
import { MdChevronRight } from 'react-icons/md';
import SUBSCRIPTION_MANAGER from '@/components/ui/subscription/SUBSCRIPTION_MANAGER';

function SubscriptionSettingsPage() {
    const { user } = useContext(UserContext);
    const searchParams = useSearchParams();
    const USER_ID = searchParams.get('uid');

    if (!user) {
        return (
            <Flex flexDirection={'column'} justifyContent={'center'} align='center' h='60vh'>
                <Spinner />
                <Text>Loading subscription settings...</Text>
            </Flex>
        );
    }

    return (
        <Container maxW="4xl" py={8}>
            <Box mb={8}>
                <Heading size="xl" color="gray.800" mb={2}>
                    Subscription Management
                </Heading>
                <Text color="gray.600" mb={4}>
                    Manage your subscription plan, billing, and account settings
                </Text>
                
                <Breadcrumb spacing='8px' separator={<MdChevronRight color='gray.500' />}>
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/dashboard/home/?uid=${USER_ID}`}>
                            Home
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/dashboard/settings/?uid=${USER_ID}`}>
                            Settings
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem isCurrentPage>
                        <BreadcrumbLink>Subscription</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
            </Box>

            <SUBSCRIPTION_MANAGER />
        </Container>
    );
}

export default SubscriptionSettingsPage;
