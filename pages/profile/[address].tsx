import {
    useContract,
    useOwnedNFTs,
    useValidDirectListings,    
  } from "@thirdweb-dev/react";
  import { Container, Heading, Text, Button} from "@chakra-ui/react";
  import { useRouter } from "next/router";
  import React, { useState } from "react";

  import NFTGrid from "../../components/NFTGrid";
  import {
    MARKETPLACE_ADDRESS,
    NFT_COLLECTION_ADDRESS,
  } from "../../const/addresses";


  export default function ProfilePage() {
    const router = useRouter();   
    const { address } = router.query; 
  
    const { contract: nftCollection } = useContract(NFT_COLLECTION_ADDRESS);
  
    const { contract: marketplace } = useContract(
      MARKETPLACE_ADDRESS,
      "marketplace-v3"
    );
  
    const { data: ownedNfts, isLoading: loadingOwnedNfts } = useOwnedNFTs(
      nftCollection,
      address as string
    );
 
  
    return (
        <Container maxW={"1200px"} p={5} backgroundColor={"#E8AA42"}>
            <Heading color={"#025464"}>{"Owned NFT(s)"}</Heading>
            <Button
                colorScheme="teal"
                variant="outline"
                border={"0.5px"}
                py={2}
                px={4}
                my={2}
            >
            Wallet Address: {address?.slice(0, 6) + "..." + address?.slice(-4)}
            </Button>
            <Text color={"#025464"}>Browse and manage your NFTs from this collection.</Text>
            <NFTGrid
                data={ownedNfts}
                isLoading={loadingOwnedNfts}
                emptyText={"You don't own any NFTs yet from this collection"}
            />

        </Container>
    )
    }