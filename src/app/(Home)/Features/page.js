import { Box, Flex, Icon, Stack, Text } from '@chakra-ui/react';
import React from 'react'

export default function Features() {
  return (
    <Box py={12} bg="white" rounded="xl" >
      <Box maxW="7xl" mx="auto" px={{ base: 4, lg: 8, }} >
        <Box textAlign={{ lg: "center"}} >
          <Text mt={2} fontSize={{ base: "3xl", sm: "4xl", }} lineHeight="8" fontWeight="extrabold" letterSpacing="tight" textAlign={'center'}>
            Features
          </Text>
          <Text mt={4} maxW="2xl" fontSize="xl" mx={{ lg: "auto", }} color="gray.500" textAlign={'center'}>
          Welcome to our feature-rich management software SAAS, designed to empower businesses with seamless control over users, roles, and product management.
          </Text>
        </Box>
        <Box mt={10}>
          <Stack spacing={{ base: 10, md: 0, }} display={{ md: "grid", }} gridTemplateColumns={{ md: "repeat(2,1fr)", }} gridColumnGap={{ md: 8, }} gridRowGap={{ md: 10, }} >
            <Feature
              title="Competitive features"
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              }
            >
Vendar as a SAAS offers an advanced data analytics feature that gives you unparalleled insights into your business operations. With this feature, you can harness the power of your data to make informed decisions and stay ahead
            </Feature>

            <Feature
              title=" No hidden fees"
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                />
              }
            >
              Our management software SAAS is committed to transparency and fairness, which is why we offer a "No Hidden Fees" feature. With this feature, you can trust that the price you see is the price you pay, with no unexpected charges or additional costs.
            </Feature>

            <Feature
              title="Users, Roles, Products Management"
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              }
            >
Vendar as a SAAS offers comprehensive functionality for managing your team, vendors, roles, sales and products within your organization, providing you with robust control and customization options to effectively organize and optimize your business operations.


            </Feature>

            <Feature
              title="Email notifications"
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              }
            >
Vendar as a SAAS includes robust email notification capabilities to keep you informed and up-to-date with important events and activities related to your business operations.
            </Feature>
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}

const Feature = (props) => {
  return (
    <Flex my='6'>
      <Flex shrink={0}>
        <Flex
          alignItems="center"
          justifyContent="center"
          h={12}
          w={12}
          rounded="md"
          color="white"
        >
          <Icon
            boxSize={6}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            {props.icon}
          </Icon>
        </Flex>
      </Flex>
      <Box ml={4}>
        <Text
          fontSize="lg"
          fontWeight="medium"
          lineHeight="6"
          _light={{
            color: "gray.900",
          }}
        >
          {props.title}
        </Text>
        <Text
          mt={2}
          color="gray.500"
        >
          {props.children}
        </Text>
      </Box>
    </Flex>
  );
};