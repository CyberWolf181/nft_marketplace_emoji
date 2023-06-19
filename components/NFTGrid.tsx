import type { NFT as NFTType } from "@thirdweb-dev/sdk";
import { SimpleGrid, Skeleton, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { NFT_COLLECTION_ADDRESS } from "../const/addresses";
import NFT from "./NFT";


type Props = {
    isLoading: boolean;
    data: NFTType[] | undefined;
    overrideOnclickBehavior?: (nft: NFTType) => void;
    emptyText?: string;
  };
  
  export default function NFTGrid({
    isLoading,
    data,
    overrideOnclickBehavior,
    emptyText = "No NFTs found for this collection.",
  }: Props) {
    return (
        <SimpleGrid columns={4} spacing={6} w={"100%"} padding={2.5} my={5}>
            {isLoading ? (
                [...Array(20)].map((_, index) => (              
                    <Skeleton key={index} width={"100%"} height="312px" />             
                ))
            ) : data && data.length > 0 ? (
                data.map((nft) =>
                    !overrideOnclickBehavior ? (
                        <Link
                            href={`/token/${NFT_COLLECTION_ADDRESS}/${nft.metadata.id}`}
                            key={nft.metadata.id}                         
                            >
                        <NFT nft={nft} />
                        </Link>
            ) : (
                <div
                  key={nft.metadata.id}                
                  onClick={() => overrideOnclickBehavior(nft)}
                >
                  <NFT nft={nft} />
                </div>
            ))
            ) : (
                <Text>{emptyText}</Text>
            )}
        </SimpleGrid>
    )
  }