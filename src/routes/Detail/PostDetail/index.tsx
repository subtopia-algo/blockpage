import React, { useState } from "react"
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

type Props = {}

const PostDetail: React.FC<Props> = () => {
  const data = usePostQuery()
  const { activeAddress } = useWallet()
  const [isDialogOpen, setDialogOpen] = useState(false)

  if (!data) return null

  const category = (data.category && data.category?.[0]) || undefined

  const isSubscriber = (address: string | undefined) => {
    return false
  }

  const toggleWalletModal = () => {
    setDialogOpen((prev) => !prev)
  }

  // Check if the post is paid and the user is not a subscriber
  const isPaidContent = data.tier === "Paid" && !isSubscriber(activeAddress)

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
        {!isPaidContent ? (
          <div>
            <NotionRenderer recordMap={data.recordMap} />
          </div>
        ) : (
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
        )}
        {data.type[0] === "Post" && (
          <>
            <Footer />
            <CommentBox data={data} />
          </>
        )}
      </article>
      <SubscribeModal openModal={isDialogOpen} closeModal={toggleWalletModal} />
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
