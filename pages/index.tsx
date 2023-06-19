
import type { NextPage } from "next";
import NextLink from 'next/link';

import { Button, Container, Flex, Heading, Stack, Image, Text } from "@chakra-ui/react";

const Home: NextPage = () => {
  return (
   <Container maxW={"1200px"} backgroundColor={"#E8AA42"}>
      <Flex h={"80vh"} alignItems={"center"} justifyContent={"center"}>
        <Stack spacing={4} align={"center"}>
          <Image
              src="/preview.gif"
              width={400}
              height={400}
              alt="Hero asset, NFT marketplace" 
              borderRadius={"8px"}             
          />
          <Heading color={"#025464"}>Emoji Faces Marketplace</Heading>
          <Text color={"#025464"}>Join the NFT revolution</Text>
          <Button
            backgroundColor={"#025464"}
            colorScheme={"white"}
            as={NextLink} href='/buy'
            >Shop NFTs</Button>

        </Stack>

      </Flex>
     
   </Container>
  );
};

export default Home;
