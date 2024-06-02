'use client'
import { Suspense } from 'react'
import LOADING from '../loading'

export default function Layout({children}){
    return(
        <Suspense fallback={<LOADING/>}>
            {children}
        </Suspense>
    )
};