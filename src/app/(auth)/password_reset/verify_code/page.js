'use client'
import { SEND_OTP_CODE_TO_USER } from '@/app/api/auth/route';
import LOGO from '@/app/lib/LOGO';
import { Button, Flex, HStack, Icon, PinInput, PinInputField, Text, useToast } from '@chakra-ui/react'
import { jwtDecode } from 'jwt-decode';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { CiWarning } from 'react-icons/ci';
import { MdDone } from 'react-icons/md';
import Cookies from 'universal-cookie';


function Page() {
    const cookies = new Cookies();
    const reset_code_token = cookies.get('reset_code_token');

    const searchParams = useSearchParams()
    const email = searchParams.get('email');
    const router = useRouter();
    const toast = useToast()


    const [timer, setTimer] = useState("01:30");
    const [timer_deadline, setTimer_deadline] = useState("");
    const [confirmation_code,set_confirmation_code]=useState('');
    const [input_error,set_input_error]=useState(false);
    const [input_error_message,set_input_error_message]=useState('');
    const [input_success_message,set_input_success_message]=useState('');
    const [isSubmitting, set_isSubmitting]=useState(false);

    const Ref = useRef(null);

    const getTimeRemaining = (e) => {
        const total =
            Date.parse(e) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor(
            (total / 1000 / 60) % 60
        );
        return {
            total,
            minutes,
            seconds,
        };
    };

    const startTimer = (e) => {
        let { total, minutes, seconds } =
            getTimeRemaining(e);
        if (total >= 0) {
            // update the timer
            // check if less than 10 then we need to
            // add '0' at the beginning of the variable
            setTimer(
                (minutes > 9
                    ? minutes
                    : "0" + minutes) +
                ":" +
                (seconds > 9 ? seconds : "0" + seconds)
            );
        }
    };

    const clearTimer = (e) => {
        setTimer("01:30");

        if (Ref.current) clearInterval(Ref.current);
        const id = setInterval(() => {
            startTimer(e);
        }, 1000);
        Ref.current = id;
    };
 
    const getDeadTime = () => {
        let deadline = new Date();
 
        // This is where you need to adjust if
        // you entend to add more time
        deadline.setSeconds(deadline.getSeconds() + 90);
        setTimer_deadline(deadline)
        return deadline;
    };

    useEffect(() => {
        clearTimer(getDeadTime());
    }, []);

    const HandleSubmit=()=>{
        set_isSubmitting(true)
        if(confirmation_code?.length !== 6){
            set_input_error(true);
            set_input_error_message('Missing code')
            setTimeout(()=>{
                set_isSubmitting(false)
            },2000)
            return;
        }
        const decoded_token = jwtDecode(reset_code_token);
        if(confirmation_code !== decoded_token?.code){
            set_input_error(true);
            set_input_error_message('Invalid code');
            setTimeout(()=>{
                set_isSubmitting(false)
            },2000)
            return;
        }
        if(confirmation_code === decoded_token?.code){
            set_input_success_message('Code passed verification')
            setTimeout(()=>{
                router.push(`/password_reset/new?email=${email}`);
            },2000)
        }
    }

    const Clear_Input_Error=()=>{
        set_input_error(false);
        set_input_error_message('');
    }

    const HandleResend = async() => {
        try {
          await SEND_OTP_CODE_TO_USER(email).then((response)=>{
                if(response?.data?.error === true){
                    return toast({ title: `Error!:${response?.data?.message}`, description: ``, status: 'warning', variant:'left-accent', position: 'top-left', isClosable: true });
                }
                toast({ title: 'Success!:Code sent successfully', description: ``, status: 'success', variant:'left-accent', position: 'top-left', isClosable: true });
                setTimeout(()=>{
                    router.replace(`/password_reset/verify_code?email=${email}`);
                },2000)
                clearTimer(getDeadTime());
                return ;
          }).catch((err)=>{
              return toast({ title: `Error occured!:`, description: ``, status: 'error', variant:'left-accent', position: 'top-left', isClosable: true });
          })
        } catch (error){
            return toast({ title: `Error occured!:`, description: ``, status: 'warning', variant:'left-accent', position: 'top-left', isClosable: true });
        }
    }

    return (
        <Flex direction='column' alignItems={'center'} justify={'center'} w='full' boxShadow={'sm'} p='4' gap='2'>
            <Flex hideFrom='md' alignItems={'center'} flexDirection={'column'}>
                <LOGO color='#4E2FD7' size='20px'/>
            </Flex>
            <Text fontSize={'xl'} my='4'>Verify your Code</Text>
            <HStack>
                <PinInput type='number' onChange={((e)=>{set_confirmation_code(e);Clear_Input_Error()})} otp={true}>
                    <PinInputField errorBorderColor={input_error? true : false}/>
                    <PinInputField errorBorderColor={input_error? true : false}/>
                    <PinInputField errorBorderColor={input_error? true : false}/>
                    <PinInputField errorBorderColor={input_error? true : false}/>
                    <PinInputField errorBorderColor={input_error? true : false}/>
                    <PinInputField errorBorderColor={input_error? true : false}/>
                </PinInput>
            </HStack>
            {input_error && 
                <HStack color='#fff' bg='red.200' borderRadius={'md'} p='2' mt='2' align={'center'}>
                    <Icon as={CiWarning} boxSize='4'/>
                    <Text>{input_error_message}</Text>
                </HStack>
            }
            {input_success_message && 
                <HStack color='green.600' bg='green.200' borderRadius={'md'} p='2' mt='2' align={'center'}>
                    <Icon as={MdDone} boxSize='4'/>
                    <Text>{input_success_message}</Text>
                </HStack>
            }
            <Flex gap='2' flexDirection={'column'} w={{base:'full',md:'md'}} mt='4'>
                {timer === '00:00'?
                    <Button bg='#05232e' color='#fff' w='full' onClick={HandleResend}>Resend Code</Button>
                    :
                    <Button bg='#05232e' color='#fff' w='full' isDisabled>{timer} Resend Code</Button>
                }
                {isSubmitting?
                    <Button isLoading loadingText='verifying code...' variant='ghost' borderRadius={'md'}/>
                    :
                    <Button type='submit' variant={'filled'} borderRadius={'md'} bg='#4E2FD7' color='#fff' onClick={HandleSubmit}>Verify Code</Button>
                }
            </Flex>
        </Flex>
    )
}

export default Page