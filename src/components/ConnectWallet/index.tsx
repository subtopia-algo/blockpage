import { Provider, useWallet } from "@txnlab/use-wallet"
import Account from "./Account"
import { useEffect, useState } from "react"
import {
  ChainType,
  SUBTOPIA_REGISTRY_ID,
  SubscriptionRecord,
  SubtopiaClient,
} from "subtopia-js-sdk"
import { getAlgoClient } from "@algorandfoundation/algokit-utils"
import { getAlgodConfigFromNextEnvironment } from "src/libs/utils"

interface ConnectWalletInterface {
  openModal: boolean
  closeModal: () => void
}

const ConnectWallet = ({ openModal, closeModal }: ConnectWalletInterface) => {
  const { providers, activeAddress, signer } = useWallet()

  const isKmd = (provider: Provider) =>
    provider.metadata.name.toLowerCase() === "kmd"

  const algoConfig = getAlgodConfigFromNextEnvironment()
  const algodClient = getAlgoClient(algoConfig)
  const [subtopiaClient, setSubtopiaClient] = useState<
    SubtopiaClient | undefined
  >(undefined)
  const [subscription, setSubscription] = useState<
    SubscriptionRecord | undefined
  >(undefined)

  useEffect(() => {
    const initSubtopiaClient = async () => {
      try {
        // Assume activeAccount and other necessary variables are defined
        const activeAccount = { addr: activeAddress!, signer: signer }
        const client = await SubtopiaClient.init({
          algodClient: algodClient,
          chainType: ChainType.TESTNET,
          productID: 603254964,
          registryID: SUBTOPIA_REGISTRY_ID(ChainType.TESTNET),
          creator: activeAccount,
        })
        setSubtopiaClient(client)

        setSubscription(
          await client.getSubscription({
            subscriberAddress: activeAddress!,
            algodClient: algodClient,
          })
        )
      } catch (e) {
        console.error(e)
      }
    }

    if (activeAddress && !subtopiaClient) {
      initSubtopiaClient()
    }
  }, [activeAddress, algodClient, signer, subtopiaClient])

  return (
    <dialog
      id="connect_wallet_modal"
      className={`modal ${openModal ? "modal-open" : ""}`}
    >
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-2xl">
          {activeAddress ? "Account settings" : "Select wallet provider"}
        </h3>

        <div className="grid m-2 pt-5">
          {activeAddress && (
            <>
              <Account subscription={subscription} />
              <div className="divider" />
            </>
          )}

          {!activeAddress &&
            providers?.map((provider) => (
              <button
                data-test-id={`${provider.metadata.id}-connect`}
                className="btn border-teal-800 border-1  m-2"
                key={`provider-${provider.metadata.id}`}
                onClick={() => {
                  return provider.connect()
                }}
              >
                {!isKmd(provider) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    alt={`wallet_icon_${provider.metadata.id}`}
                    src={provider.metadata.icon}
                    style={{
                      objectFit: "contain",
                      width: "30px",
                      height: "auto",
                    }}
                  />
                )}
                <span>
                  {isKmd(provider) ? "LocalNet Wallet" : provider.metadata.name}
                </span>
              </button>
            ))}
        </div>

        <div className="modal-action ">
          <button
            data-test-id="close-wallet-modal btn-outline"
            className="btn"
            onClick={() => {
              closeModal()
            }}
          >
            Close
          </button>
          {activeAddress && subscription && (
            <button className="btn btn-info btn-outline">
              <a
                href={`https://testnet.subtopia.io/subscription/${subtopiaClient?.appID}`}
                target="_blank"
              >
                Manage subscription
              </a>
            </button>
          )}
          {activeAddress && (
            <button
              className="btn btn-warning btn-outline"
              data-test-id="logout"
              onClick={() => {
                if (providers) {
                  const activeProvider = providers.find((p) => p.isActive)
                  if (activeProvider) {
                    activeProvider.disconnect()
                  } else {
                    // Required for logout/cleanup of inactive providers
                    // For instance, when you login to localnet wallet and switch network
                    // to testnet/mainnet or vice verse.
                    localStorage.removeItem("txnlab-use-wallet")
                    window.location.reload()
                  }
                }
              }}
            >
              Logout
            </button>
          )}
        </div>
      </form>
    </dialog>
  )
}
export default ConnectWallet
