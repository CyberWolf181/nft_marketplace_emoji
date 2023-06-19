import { NFT as NFTType } from "@thirdweb-dev/sdk";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import {
    MARKETPLACE_ADDRESS,
    NFT_COLLECTION_ADDRESS,
  } from "../const/addresses";
import { Box, Input, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text} from "@chakra-ui/react";
import {
  useContract,
  useCreateAuctionListing,
  useCreateDirectListing,
  Web3Button,
} from "@thirdweb-dev/react";


type Props = {
    nft: NFTType;
  };
  
type DirectFormData = {
    nftContractAddress: string;
    tokenId: string;
    price: string;
    startDate: Date;
    endDate: Date;
};

type AuctionFormData = {
    nftContractAddress: string;
    tokenId: string;
    startDate: Date;
    endDate: Date;
    floorPrice: string;
    buyoutPrice: string;
  };

export default function SaleInfo({ nft }: Props) {
    const router = useRouter();
    const { contract: marketplace } = useContract(
        MARKETPLACE_ADDRESS,
        "marketplace-v3"
      );
    const { contract: nftCollection } = useContract(NFT_COLLECTION_ADDRESS);

    // Hook provides an async function to create a new auction listing
    const { mutateAsync: createDirectListing } = useCreateDirectListing(marketplace);

    const { mutateAsync: createAuctionListing } = useCreateAuctionListing(marketplace);

    // User requires to set marketplace approval before listing
  async function checkAndProvideApproval() {
    // Check if approval is required
    const hasApproval = await nftCollection?.call("isApprovedForAll", [
      nft.owner,
      MARKETPLACE_ADDRESS,
    ]);

    // If it is, provide approval
    if (!hasApproval) {
      const txResult = await nftCollection?.call("setApprovalForAll", [
        MARKETPLACE_ADDRESS,
        true,
      ]);

      if (txResult) {
        console.log("Approval provided")
      }
    }

    return true;
    }

        // Manage form values using react-hook-form library: Direct form
    const { register: registerDirect, handleSubmit: handleSubmitDirect } =
    useForm<DirectFormData>({
        defaultValues: {
        nftContractAddress: NFT_COLLECTION_ADDRESS,
        tokenId: nft.metadata.id,
        startDate: new Date(),
        endDate: new Date(),
        price: "0",
        },
    });

    async function handleSubmissionDirect(data: DirectFormData) {
        await checkAndProvideApproval();
        const txResult = await createDirectListing({
          assetContractAddress: data.nftContractAddress,
          tokenId: data.tokenId,
          pricePerToken: data.price,
          startTimestamp: new Date(data.startDate),
          endTimestamp: new Date(data.endDate),
        });
    
        return txResult;
    }

    const { register: registerAuction, handleSubmit: handleSubmitAuction } =
    useForm<AuctionFormData>({
      defaultValues: {
        nftContractAddress: NFT_COLLECTION_ADDRESS,
        tokenId: nft.metadata.id,
        startDate: new Date(),
        endDate: new Date(),
        floorPrice: "0",
        buyoutPrice: "0",
      },
    });

    async function handleSubmissionAuction(data: AuctionFormData) {
        await checkAndProvideApproval();
        const txResult = await createAuctionListing({
          assetContractAddress: data.nftContractAddress,
          tokenId: data.tokenId,
          buyoutBidAmount: data.buyoutPrice,
          minimumBidAmount: data.floorPrice,
          startTimestamp: new Date(data.startDate),
          endTimestamp: new Date(data.endDate),
        });
    
        return txResult;
      }


    return(
        <Tabs>
            <TabList>
                <Tab>Direct</Tab>
                <Tab>Auction</Tab>
            </TabList>

            <TabPanels>
                <TabPanel>
                    <Stack spacing={8}>
                    <Box>                       
                        <Text>Listing starts on:</Text>
                        <Input
                            placeholder="Select Date and Time"
                            size="md"
                            type="datetime-local"
                            {...registerDirect("startDate")}
                        />
                        <Text mt={2}>Listing ends on:</Text>
                        <Input
                            placeholder="Select Date and Time"
                            size="md"
                            type="datetime-local"
                            {...registerDirect("endDate")}
                        />
                    </Box>
                    <Box>
                        <Text fontWeight={"bold"}>Price:</Text>               
                        <Input
                            placeholder="0"
                            size="md"
                            type="datetime-local"
                            {...registerDirect("price")}
                        />

                    </Box>
                    <Web3Button
                        contractAddress={MARKETPLACE_ADDRESS}
                        action={async () => {
                        await handleSubmitDirect(handleSubmissionDirect)();
                        }}                
                        onSuccess={(txResult) => {                
                        router.push(
                            `/token/${NFT_COLLECTION_ADDRESS}/${nft.metadata.id}`
                        );
                        }}
                    >Create Direct Listing</Web3Button>
                    </Stack>
                </TabPanel>
                <TabPanel>
                    <Stack spacing={8}>
                        <Box>                       
                            <Text>Listing starts on:</Text>
                            <Input
                                placeholder="Select Date and Time"
                                size="md"
                                type="datetime-local"
                                {...registerDirect("startDate")}
                            />
                            <Text mt={2}>Listing ends on:</Text>
                            <Input
                                placeholder="Select Date and Time"
                                size="md"
                                type="datetime-local"
                                {...registerDirect("endDate")}
                            />
                        </Box>
                        <Box>
                            <Text fontWeight={"bold"}>Starting bid from:</Text>
                            <Input
                                placeholder="0"
                                size="md"
                                type="number"
                                {...registerAuction("floorPrice")}
                            />

                        </Box>
                        <Box>
                            <Text fontWeight={"bold"}>Buyout price:</Text>
                            <Input
                                placeholder="0"
                                size="md"
                                type="number"
                                {...registerAuction("buyoutPrice")}
                            />

                        </Box>
                        <Web3Button
                            contractAddress={MARKETPLACE_ADDRESS}
                            action={async () => {
                                return await handleSubmitAuction(handleSubmissionAuction)();
                            }}                
                            onSuccess={(txResult) => {                
                            router.push(
                                `/token/${NFT_COLLECTION_ADDRESS}/${nft.metadata.id}`
                            );
                            }}
                        >Create Auction Listing</Web3Button>
                    </Stack>
                </TabPanel>

            </TabPanels>

        </Tabs>
      
    )
}