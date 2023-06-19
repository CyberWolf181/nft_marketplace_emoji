import {
    ThirdwebNftMedia,
    useContract,
    useValidDirectListings,
    useValidEnglishAuctions,
  } from "@thirdweb-dev/react";
  import { NFT } from "@thirdweb-dev/sdk";
  import React from "react";
  import {
    MARKETPLACE_ADDRESS,
    NFT_COLLECTION_ADDRESS,
  } from "../const/addresses";
  import { Box, Flex, Skeleton, Text } from "@chakra-ui/react";

  type Props = {
    nft: NFT;
  };

  export default function NFTComponent({ nft }: Props){
    const { contract: marketplace, isLoading: loadingMarketplace } = useContract(
        MARKETPLACE_ADDRESS,
        "marketplace-v3"
      );
        // 1. Load if the NFT is for direct listing
    const { data: directListing, isLoading: loadingDirectListing } =
        useValidDirectListings(marketplace, {
            tokenContract: NFT_COLLECTION_ADDRESS,
            tokenId: nft.metadata.id,
        });

        // 2. Load if the NFT is for auction
    const { data: auctionListing, isLoading: loadingAuction } =
        useValidEnglishAuctions(marketplace, {
            tokenContract: NFT_COLLECTION_ADDRESS,
            tokenId: nft.metadata.id,
        });
    return(
        <Flex direction={"column"} backgroundColor={"#EEE"} justifyContent={"center"} padding={2.5}>
            <Box borderRadius={"4px"} overflow={"hidden"}>
                <ThirdwebNftMedia metadata={nft.metadata} height={"100%"} width={"100%"}/>
            </Box>
            <Text fontSize={"small"} color={"darkgray"} >Token ID #{nft.metadata.id}</Text>
            <Text fontWeight={"bold"}>{nft.metadata.name}</Text>
            <Box>
                {loadingMarketplace || loadingDirectListing || loadingAuction?  (
                    <Skeleton></Skeleton>
                ) : directListing && directListing[0] ? (
                    
                     <Box>
                        <Flex direction={"column"}>
                            <Text fontSize={"small"}>Price</Text>
                            <Text fontSize={"small"}>{`${directListing[0]?.currencyValuePerToken.displayValue} ${directListing[0]?.currencyValuePerToken.symbol}`}</Text>

                        </Flex>
                     </Box>   
                ) : auctionListing && auctionListing[0] ?(
                    <Box>
                        <Flex direction={"column"}>
                            <Text fontSize={"small"}>Minimum Bid</Text>
                            <Text fontSize={"small"}>{`${auctionListing[0]?.minimumBidCurrencyValue.displayValue} ${auctionListing[0]?.minimumBidCurrencyValue.symbol}`}</Text>

                        </Flex>
                     </Box>   
                ) : (
                    <Box>
                        <Flex direction={"column"}>
                            <Text fontSize={"small"}>Price</Text>
                            <Text fontSize={"small"}>Not Listed</Text>

                        </Flex>
                     </Box>   
                )}   
            
            </Box>

        </Flex>

    )
  }