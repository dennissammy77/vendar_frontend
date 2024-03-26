'use client';

import { Button } from "@chakra-ui/react";
import Link from "next/link";

export const BackButton=({href,label})=>{
    return(
        <Button w='full' size={'sm'} variant={'link'}>
            <Link href={href}>
                {label}
            </Link>
        </Button>
    )
}