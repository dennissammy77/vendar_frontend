'use client';

import { Card, CardBody, CardFooter, CardHeader } from '@chakra-ui/react';
import React from 'react'
import Header from './Header';
import { Social } from './Social';
import { BackButton } from './BackButton';

const CardWrapper=({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial
})=>{
  return (
    <Card w='400px' borderRadius={10} p='2'>
      <CardHeader>
        <Header label={headerLabel}/>
      </CardHeader>
      <CardBody>
        {children}
      </CardBody>
      {showSocial && (
        <CardFooter>
          <Social/>
        </CardFooter>
      )}
      <CardFooter>
        <BackButton 
          label={backButtonLabel}
          href={backButtonHref}
        />
      </CardFooter>
    </Card>
  )
};

export default CardWrapper