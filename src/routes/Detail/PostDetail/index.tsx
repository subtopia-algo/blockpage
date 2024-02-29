import React, { useEffect, useState } from "react"
import PostHeader from "./PostHeader"
import Footer from "./PostFooter"
import CommentBox from "./CommentBox"
import Category from "src/components/Category"
import styled from "@emotion/styled"
import NotionRenderer from "../components/NotionRenderer"
import usePostQuery from "src/hooks/usePostQuery"
import { useWallet } from "@txnlab/use-wallet"
import ConnectWallet from "src/components/ConnectWallet"
import SubscribeModal from "src/components/SubscribeModal"
import { getAlgoClient } from "@algorandfoundation/algokit-utils"
import { getAlgodConfigFromNextEnvironment } from "src/libs/utils"
import {
  SubtopiaClient,
  ChainType,
  SUBTOPIA_REGISTRY_ID,
} from "subtopia-js-sdk"

type Props = {}

const PostDetail: React.FC<Props> = () => {
  const data = usePostQuery()
  const { activeAddress, signer } = useWallet()
  const [isDialogOpen, setDialogOpen] = useState(false)
  const algoConfig = getAlgodConfigFromNextEnvironment()
  const algodClient = getAlgoClient(algoConfig)
  const [subtopiaClient, setSubtopiaClient] = useState<
    SubtopiaClient | undefined
  >(undefined)
  const [isSubscriber, setIsSubscriber] = useState(false)

  useEffect(() => {
    const initSubtopiaClient = async () => {
      try {
        // Assume activeAccount and other necessary variables are defined
        const activeAccount = { addr: activeAddress!, signer: signer }
        const client = await SubtopiaClient.init({
          algodClient: algodClient,
          chainType: ChainType.TESTNET,
          productID: 602942271,
          registryID: SUBTOPIA_REGISTRY_ID(ChainType.TESTNET),
          creator: activeAccount,
        })
        setSubtopiaClient(client)

        setIsSubscriber(
          await client.isSubscriber({ subscriberAddress: activeAddress! })
        )
      } catch (e) {
        console.error(e)
      }
    }

    if (activeAddress && !subtopiaClient) {
      initSubtopiaClient()
    }
  }, [activeAddress, algodClient, subtopiaClient, signer])

  if (!data) return null

  const category = (data.category && data.category?.[0]) || undefined

  const reloadSubscriptionStatus = async (address: string | undefined) => {
    if (!subtopiaClient || !address) {
      setIsSubscriber(false)
      return
    }

    setIsSubscriber(
      await subtopiaClient.isSubscriber({ subscriberAddress: address })
    )
  }

  const toggleWalletModal = () => {
    setDialogOpen((prev) => !prev)
  }

  // Check if the post is paid and the user is not a subscriber
  const isPaidContent = data.tier === "Paid"

  return (
    <StyledWrapper>
      <article>
        {category && (
          <div css={{ marginBottom: "0.5rem" }}>
            <Category readOnly={data.status?.[0] === "PublicOnDetail"}>
              {category}
            </Category>
          </div>
        )}
        {data.type[0] === "Post" && <PostHeader data={data} />}
        {subtopiaClient ? (
          isPaidContent && !isSubscriber ? (
            <StyledSubscriptionNotice>
              <p>
                👋 Hello, this post is available to BlockPost subscribers. Click
                subscribe to get started.
              </p>
              <button
                className="btn glass btn-wide text-lg"
                onClick={toggleWalletModal}
              >
                Subscribe
              </button>
            </StyledSubscriptionNotice>
          ) : (
            <div>
              <NotionRenderer recordMap={data.recordMap} />
            </div>
          )
        ) : (
          <div className="flex justify-center">
            <button className="btn glass text-lg btn-loading btn-wide">
              Loading...
            </button>
          </div>
        )}
        {data.type[0] === "Post" && (
          <>
            <Footer />
            <CommentBox data={data} />
          </>
        )}
      </article>
      <SubscribeModal
        subtopiaClient={subtopiaClient}
        openModal={isDialogOpen}
        closeModal={toggleWalletModal}
        onSubscribe={async () => {
          await reloadSubscriptionStatus(activeAddress)
        }}
      />
    </StyledWrapper>
  )
}

export default PostDetail

const StyledWrapper = styled.div`
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-top: 3rem;
  padding-bottom: 3rem;
  border-radius: 1.5rem;
  max-width: 56rem;
  background-color: ${({ theme }) =>
    theme.scheme === "light" ? "white" : theme.colors.gray4};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  margin: 0 auto;
  > article {
    margin: 0 auto;
    max-width: 42rem;
  }
`

const StyledSubscriptionNotice = styled.div`
  text-align: center;
  margin-top: 2rem;
  p {
    margin-bottom: 1rem;
  }
  button {
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    &:hover {
      background-color: #0056b3;
    }
  }
`
