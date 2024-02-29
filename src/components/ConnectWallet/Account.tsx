import { getAlgoClient } from "@algorandfoundation/algokit-utils"
import { useWallet } from "@txnlab/use-wallet"
import { useEffect, useMemo, useState } from "react"
import {
  ellipseAddress,
  getAlgodConfigFromNextEnvironment,
} from "src/libs/utils"
import {
  SubtopiaClient,
  ChainType,
  SUBTOPIA_REGISTRY_ID,
  SubscriptionRecord,
} from "subtopia-js-sdk"

function expiresInDays(unixTimestamp: number | null): string {
  if (!unixTimestamp) {
    return "N/A"
  }
  // Current date and time
  const now = new Date()

  // Convert Unix timestamp to milliseconds (Unix timestamp is in seconds)
  const expiryDate = new Date(unixTimestamp * 1000)

  // Calculate difference in milliseconds
  const diff = expiryDate.getTime() - now.getTime()

  // Convert milliseconds to days
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))

  // Check if the expiration date has passed
  if (days < 0) {
    return "Expired"
  } else {
    return `Expires in: ${days} day(s)`
  }
}

type AccountProps = {
  subscription: SubscriptionRecord | undefined
}

const Account = ({ subscription }: AccountProps) => {
  const { activeAddress, signer } = useWallet()
  const algoConfig = getAlgodConfigFromNextEnvironment()
  const dappFlowNetworkName = useMemo(() => {
    return algoConfig.network === ""
      ? "sandbox"
      : algoConfig.network.toLocaleLowerCase()
  }, [algoConfig.network])

  return (
    <div>
      <a
        className="text-xl"
        target="_blank"
        href={`https://app.dappflow.org/setnetwork?name=${dappFlowNetworkName}&redirect=explorer/account/${activeAddress}/`}
      >
        Address: {ellipseAddress(activeAddress)}
      </a>
      <div className="text-xl">
        Network: {algoConfig.network === "" ? "localnet" : algoConfig.network}
      </div>
      <div className="text-xl">
        Subscription: {subscription !== undefined ? "Active" : "Not subscribed"}
      </div>
      {subscription !== undefined && (
        <div className="text-xl">{expiresInDays(subscription.expiresAt)}</div>
      )}
    </div>
  )
}

export default Account
