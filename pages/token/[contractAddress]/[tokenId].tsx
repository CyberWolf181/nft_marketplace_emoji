import {
    MediaRenderer,
    ThirdwebNftMedia,
    useContract,
    Web3Button,
    useContractEvents,
    useValidDirectListings,
    useValidEnglishAuctions,
    useMinimumNextBid    
  } from "@thirdweb-dev/react";
  import { Avatar, Box, Container, Flex, Input, SimpleGrid, Skeleton, Stack, Text} from "@chakra-ui/react";
  import React, { useState } from "react";  
  import { GetStaticProps, GetStaticPaths } from "next";
  import { NFT, ThirdwebSDK } from "@thirdweb-dev/sdk";
  import {
    ETHERSCAN_URL,
    MARKETPLACE_ADDRESS,
    NETWORK,
    NFT_COLLECTION_ADDRESS,
  } from "../../../const/addresses";
  import Link from "next/link";

  type Props = {
    nft: NFT;
    contractMetadata: any;
  };

  export default function TokenPage({ nft, contractMetadata }: Props) {
    const [bidValue, setBidValue] = useState<string>();
  
    // Connect to marketplace smart contract
    const { contract: marketplace, isLoading: loadingMarketplace } = useContract(
      MARKETPLACE_ADDRESS,
      "marketplace-v3"
    );
    // Connect to NFT Collection smart contract
    const { contract: nftCollection } = useContract(NFT_COLLECTION_ADDRESS);

    // 2. Load if the NFT is for direct listing
    const { data: directListing, isLoading: loadingDirectListing } =
        useValidDirectListings(marketplace, {
            tokenContract: NFT_COLLECTION_ADDRESS,
            tokenId: nft.metadata.id,
        });

    const { data: auctionListing, isLoading: loadingAuction } =
        useValidEnglishAuctions(marketplace, {
          tokenContract: NFT_COLLECTION_ADDRESS,
          tokenId: nft.metadata.id,
        });
    
        async function buyListing() {
            let txResult;
        
            if (auctionListing?.[0]) {
                txResult = await marketplace?.englishAuctions.buyoutAuction(
                  auctionListing[0].id,                 
                );
              } else if (directListing?.[0]) {
                txResult = await marketplace?.directListings.buyFromListing(
                 directListing[0].id,
                 1
                );
              } else {
                throw new Error("No valid listing found for this NFT");
              }
            return txResult;
          } 

          async function createBidOrOffer() {
            let txResult;
            if (!bidValue || 0){
                return;
              };
            if (auctionListing?.[0]) {
                txResult = await marketplace?.englishAuctions.makeBid(
                    auctionListing[0].id,
                    bidValue
                );
            } else {
                throw new Error("No valid listing found for this NFT");
            }
            return txResult;
        }
    

    return(
        <Container maxW={"1200px"} p={5} my={5} backgroundColor={"#E8AA42"}>
            <SimpleGrid columns={2} spacing={6}>
                <Stack spacing={"20px"}>
                    <Box borderRadius={"6px"} overflow={"hidden"}>
                        <Skeleton isLoaded={!loadingMarketplace && !loadingDirectListing}>
                           <ThirdwebNftMedia
                                metadata={nft.metadata}
                                width="100%"
                                height="100%"                           
                           />
                        </Skeleton>
                    </Box>
                    <Box>
                        <Text fontWeight={"bold"}>Description:</Text>
                        <Text>{nft.metadata.description}</Text>
                    </Box>
                    <Box>
                        <Text fontWeight={"bold"}>Traits:</Text>
                        <SimpleGrid columns={2} spacing={4}>
                        {Object.entries(nft?.metadata?.attributes || {}).map(
                        ([key, value]) => (
                            <Flex key={key} direction={"column"} alignItems={"center"} justifyContent={"center"} borderWidth={1}>
                                <Text fontSize={"small"} >{(value as { trait_type: string }).trait_type}</Text>
                                <Text fontSize={"small"} fontWeight={"bold"} >{(value as { value: string }).value} </Text>

                            </Flex>
                        )
                        )}    
                        </SimpleGrid>                        
                    </Box>

                </Stack>
                <Stack spacing={"20px"}>
                        {contractMetadata && (
                            <Flex alignItems={"center"}>
                                <Box borderRadius={"4px"} overflow={"hidden"} mr={"10px"}>
                                    <MediaRenderer
                                        src={contractMetadata.image}
                                        height="32px"
                                        width="32px"                                    
                                    />
                                </Box>
                                <Text fontWeight={"bold"}>{contractMetadata.name}</Text>

                            </Flex>
                        )}
                        <Box mx={2.5}>
                            <Text fontSize={"4xl"} fontWeight={"bold"}>{nft.metadata.name}</Text>
                            <Link
                                href={`/profile/${nft.owner}`}
                            >
                                <Flex direction={"row"} alignItems={"center"}>
                                    <Avatar src="https://bit.ly/broken-link" h={"24px"} w={"24px"} mr={"10px"}></Avatar>
                                    <Text fontSize={"small"}> {nft.owner.slice(0,6)}...{nft.owner.slice(-4)}</Text>

                                </Flex>
                            </Link>

                        </Box>
                        <Stack backgroundColor={"#EEE"} p={2.5} borderRadius={"6px"}>
                            <Text color={"darkgray"}>Price:</Text>
                            <Skeleton isLoaded={!loadingMarketplace && !loadingDirectListing}>
                                {directListing && directListing[0] ? (
                                    <Text fontSize={"3xl"} fontWeight={"bold"}>
                                        {directListing[0]?.currencyValuePerToken.displayValue}
                                        {" " + directListing[0]?.currencyValuePerToken.symbol}

                                    </Text>
                                ) : auctionListing && auctionListing[0] ? (
                                    <Text fontSize={"3xl"} fontWeight={"bold"}>
                                        {auctionListing[0]?.buyoutCurrencyValue.displayValue}
                                        {" " + auctionListing[0]?.buyoutCurrencyValue.symbol}

                                    </Text>
                                ) : (
                                    <Text fontSize={"3xl"} fontWeight={"bold"}>Not for sale</Text>
                                )}

                            </Skeleton>
                            <Skeleton isLoaded={!loadingAuction}>
                                {auctionListing && auctionListing[0] && (
                                    <Flex direction={"column"}>
                                        <Text color={"darkgray"}>Bids starting from</Text>
                                    <Text fontSize={"3xl"} fontWeight={"bold"}>
                                        {auctionListing[0]?.minimumBidCurrencyValue.displayValue}
                                        {" " + auctionListing[0]?.minimumBidCurrencyValue.symbol}
                                    </Text>
                                    </Flex>                                 
                                                              
                                )}

                            </Skeleton>
                        </Stack>
                        <Skeleton isLoaded={!loadingMarketplace && !loadingDirectListing || !auctionListing}>
                                    <Web3Button
                                        contractAddress={MARKETPLACE_ADDRESS}
                                        action={async () => buyListing()}
                                        isDisabled={(!auctionListing || !auctionListing[0]) && (!directListing || !directListing[0])}
                                        >Buy now </Web3Button>
                                        <Text textAlign={"center"}>or</Text>
                                        <Flex direction={"column"}>
                                            <Input
                                                mb={5}
                                                defaultValue={
                                                    auctionListing?.[0].minimumBidCurrencyValue?.displayValue || 0
                                                }
                                                type={"number"}
                                                onChange={(e) => setBidValue(e.target.value)}                                           
                                            
                                            />
                                            <Web3Button
                                                contractAddress={MARKETPLACE_ADDRESS}
                                                action={async () => await createBidOrOffer()}
                                                isDisabled={!auctionListing || !auctionListing[0]}
                                            
                                            
                                            >Place Bid

                                            </Web3Button>

                                        </Flex>
                        </Skeleton>
                </Stack>

            </SimpleGrid>

        </Container>
    )
  }
  export const getStaticProps: GetStaticProps = async (context) => {
    const tokenId = context.params?.tokenId as string;
  
    const sdk = new ThirdwebSDK(NETWORK);
  
    const contract = await sdk.getContract(NFT_COLLECTION_ADDRESS);
  
    const nft = await contract.erc721.get(tokenId);
  
    let contractMetadata;
  
    try {
      contractMetadata = await contract.metadata.get();
    } catch (e) {}
  
    return {
      props: {
        nft,
        contractMetadata: contractMetadata || null,
      },
      revalidate: 1, 
    };
  };
  
  export const getStaticPaths: GetStaticPaths = async () => {
    const sdk = new ThirdwebSDK(NETWORK);
  
    const contract = await sdk.getContract(NFT_COLLECTION_ADDRESS);
  
    const nfts = await contract.erc721.getAll();
  
    const paths = nfts.map((nft) => {
      return {
        params: {
          contractAddress: NFT_COLLECTION_ADDRESS,
          tokenId: nft.metadata.id,
        },
      };
    });
  
    return {
      paths,
      fallback: "blocking", 
    };
  };
