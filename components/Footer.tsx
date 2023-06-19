/* eslint-disable @next/next/no-img-element */
import { Avatar, Box, Flex, Heading, Link, Text, Image } from "@chakra-ui/react";
import NextLink from 'next/link';
import { AiFillInstagram, AiFillGithub } from "react-icons/ai";
import { FaLinkedinIn, FaTwitter } from "react-icons/fa";

export default function Footer() {
  const open = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <Box maxW={"1200px"} m={"auto"} py={"10px"} px={"40px"} backgroundColor={"#F8F1F1"}>
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <Link as={NextLink} href="https://www.ekremkurt.com">
            <Text fontSize="small" fontStyle="italic">
                Designed by{" "}
                <Text as="span" fontWeight="bold">
                Ekrem Kurt
                </Text>
            </Text>
        </Link>
        <Box>
            <Flex justifyContent={"center"} alignItems={"center"}>
          <Box p={2}>
            <FaLinkedinIn
              onClick={() => open("https://www.linkedin.com/in/ekrem-k-3a094b19a/")}
            />
          </Box>
          <Box p={2}>
            <AiFillGithub
              onClick={() => open("https://github.com/CyberWolf181")}
            />
          </Box>
          <Box p={2}>
            <FaTwitter
              onClick={() => open("https://twitter.com/ragnarwolf1907")}
            />
          </Box>
          <Box p={2}>
            <AiFillInstagram
              onClick={() => open("https://www.instagram.com/ekremkurt1907/")}
            />
          </Box>
        </Flex>
        </Box>
        <Image 
            src="/kurt.png"
            alt="Logo" 
            width={100}
            height={50}
        />
        
       
      </Flex>
    </Box>
  );
}
