/* eslint-disable max-len */
import React, { ReactNode, useState } from "react";
import { Box, Center, Flex, Heading, Stack, Text } from "@chakra-ui/layout";
import { useColorModeValue } from "@chakra-ui/color-mode";
import { Skeleton } from "@chakra-ui/skeleton";
import { Tag, TagCloseButton, TagLabel } from "@chakra-ui/tag";
import { Image } from "@chakra-ui/image";
import router from "next/router";
import { IUser } from "../../context/Auth/Auth";
import { INFT } from "../../utils/Firestore/nft/addNfts";
import { CARD_IMAGE_HEIGHT } from "../../data/imageDimensions";
import { CardFooter, CustomIconButton, CustomMenu } from "..";
import { INftOptions } from "../../constants/nftOptions";
import { INftBtns } from "../../constants/nftCardLikeAndComment";
import { capitalizeString } from "../../utils/capitalizeString";
import { generatePinataLink } from "../../utils/generatePinataLink";
import { getIpfsLink } from "../../utils/getIPFSLink";

// interface NftCardProps extends INFT {
//   className?: string;
//   containerClass?: string;
//   isFullWidth?: boolean;
//   imgChild?: ReactNode;
//   menuOptions?: INftOptions[];
//   leftSideBtns?: INftBtns[];
//   rightSideEllipses?: INftOptions[];
//   footerText?: string;
//   headerText?: string;
// }

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function NftCard({
  className,
  containerClass,
  isFullWidth,
  name,
  assetUrl,
  owner,
  tokenAddress,
  tokenId,
  imgChild,
  uid,
  leftSideBtns,
  menuOptions,
  rightSideEllipses,
  footerText,
  headerText,
  footerHref,
}: any): JSX.Element {
  // eslint-disable-next-line no-param-reassign
  owner = owner as IUser;
  const [isImgLoaded, setIsImgLoaded] = useState(false);
  const imgBg = useColorModeValue("gray.300", "gray.600");
  const color = "twitter";
  const imageUrl = getIpfsLink(generatePinataLink(assetUrl));
  return (
    <Center
      py={6}
      className={containerClass || ""}
      transition="all 0.2s ease"
      pos="relative"
      _hover={{
        transform: "translateY(-5px)",
        boxShadow: "md",
        zIndex: 2,
      }}
    >
      <Box
        maxW={!isFullWidth ? "360px" : "none"}
        minW="300px"
        w="full"
        bg={useColorModeValue("white", "gray.900")}
        boxShadow="2xl"
        rounded="md"
        p={6}
        overflow="hidden"
        className={className || ""}
      >
        <Box
          className="nft-card-image"
          height={{
            base: "240px",
            sm: isFullWidth ? "500px" : CARD_IMAGE_HEIGHT,
            md: CARD_IMAGE_HEIGHT,
          }}
          bg={useColorModeValue("gray.100", "gray.800")}
          mt={-6}
          mx={-6}
          mb={6}
          pos="relative"
          overflow="hidden"
        >
          {assetUrl && !imgChild && (
            <Image
              src={imageUrl}
              objectFit="cover"
              objectPosition="center"
              w="full"
              h="full"
              bg={imgBg}
              onLoad={() => setIsImgLoaded(true)}
              alt="nft image"
              loading="lazy"
            />
          )}
          {imgChild}
          <Skeleton
            height="100%"
            width="100%"
            d={isImgLoaded || imgChild ? "none" : "block"}
          />
        </Box>
        {headerText && (
          <Text fontWeight="normal" color="gray.500" fontSize="0.9rem">
            {headerText}
          </Text>
        )}
        <Stack>
          <Flex w="full" justify="space-between" align="center" pb={1}>
            <Heading
              color={useColorModeValue("gray.700", "white")}
              fontSize="lg"
              fontWeight={600}
            >
              {name}
            </Heading>
            <Flex zIndex={2}>
              {rightSideEllipses && (
                <CustomMenu options={rightSideEllipses || []} uid={uid || ""} />
              )}
            </Flex>
          </Flex>

          <Flex w="full" justify="space-between" align="flex-end" pb={1}>
            {leftSideBtns && (
              <Stack align="center" mb={1} isInline spacing={1}>
                {leftSideBtns?.map((btnItem: INftBtns) => (
                  <CustomIconButton
                    key={`icon-btn-${btnItem?.["aria-label"]}-${uid}`}
                    nftId={uid || ""}
                    {...btnItem}
                  />
                ))}
              </Stack>
            )}

            {menuOptions && (
              <CustomMenu options={menuOptions || []} uid={uid || ""} />
            )}
          </Flex>
        </Stack>
        <CardFooter
          avatar={owner?.photoURL || ""}
          name={capitalizeString(owner?.displayName) || owner?.username}
          username={owner?.username || ""}
          btnText="View"
          title={footerText || "Owned by"}
          key={`card-footer-${uid}`}
          btnCallback={() => {
            if (router.pathname !== footerHref) {
              router.push(footerHref);
            }
          }}
        />
      </Box>
    </Center>
  );
}
