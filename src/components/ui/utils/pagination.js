import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
const { Flex, Button, Icon } = require("@chakra-ui/react");

const PAGINATION_BODY=() => {
    return (
        <Flex bg='#E4F0FC' w="full" alignItems="center" justify={'flex-end'} p='2' borderBottomLeftRadius={'md'} borderBottomRightRadius={'md'}>
            <Flex>
                <PAGINATION_BUTTON disabled>
                    <Icon as={IoIosArrowBack} color="gray.700" boxSize={4}/>
                </PAGINATION_BUTTON>
                <PAGINATION_BUTTON active>1</PAGINATION_BUTTON>
                <PAGINATION_BUTTON>2</PAGINATION_BUTTON>
                <PAGINATION_BUTTON>3</PAGINATION_BUTTON>
                <PAGINATION_BUTTON>
                    <Icon as={IoIosArrowForward} color="gray.700" boxSize={4}/>  
                </PAGINATION_BUTTON>
            </Flex>
        </Flex>
    );
};

const PAGINATION_BUTTON = (props) => {
    const activeStyle = {
        bg: "#4E2FD7",
        color: "white",
    };
    return (
        <Button mx={1} px={4} py={2} size='sm' rounded="md" bg="white" color="gray.700" opacity={props.disabled && 0.6} _hover={!props.disabled && activeStyle} cursor={props.disabled && "not-allowed"} {...(props.active && activeStyle)}>
            {props.children}
        </Button>
    );
};

export default PAGINATION_BODY;