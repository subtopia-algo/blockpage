import { getAlgoClient } from "@algorandfoundation/algokit-utils"
import { useWallet } from "@txnlab/use-wallet"
import { useEffect, useState } from "react"
import { getAlgodConfigFromNextEnvironment } from "src/libs/utils"
import {
  SubtopiaClient,
  ChainType,
  SUBTOPIA_REGISTRY_ID,
} from "subtopia-js-sdk"
import { useSnackbar } from "notistack"

interface SubscribeModalInterface {
  openModal: boolean
  subtopiaClient: SubtopiaClient | undefined
  closeModal: () => void
  onSubscribe: () => void
}

const SubscribeModal = ({
  openModal,
  closeModal,
  subtopiaClient,
  onSubscribe,
}: SubscribeModalInterface) => {
  const { activeAddress, signer } = useWallet()
  const [loading, setLoading] = useState(false)
  const algoConfig = getAlgodConfigFromNextEnvironment()
  const algodClient = getAlgoClient(algoConfig)

  const { enqueueSnackbar } = useSnackbar()

  const handleSubscribe = async () => {
    setLoading(true)
    if (!activeAddress || !subtopiaClient) return

    const activeAccount = { addr: activeAddress, signer: signer }

    try {
      enqueueSnackbar("Subscribing now...", { variant: "info" })
      const response = await subtopiaClient.createSubscription({
        subscriber: activeAccount,
      })
      enqueueSnackbar(`🌟 Subscribed successfully: ${response.txID}`, {
        variant: "success",
      })
      onSubscribe()
    } catch (e) {
      enqueueSnackbar("Failed to send transaction", { variant: "error" })
    }
    closeModal()
    setLoading(false)
  }

  return (
    <dialog
      id="connect_wallet_modal"
      className={`modal ${openModal ? "modal-open" : ""}`}
    >
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-2xl">Subscribe to BlockPage</h3>

        <p className="py-4">
          Thank you for your interest in BlockPage. This platform serves as a
          demonstration of content monetization through Subtopia.io and Notion,
          utilizing the Algorand TestNet for transactions. Please note, while
          subscription access is complimentary for demonstration purposes, a
          nominal transaction fee is required for submitting the transaction to
          the ledger.
        </p>

        <div className="modal-action ">
          <button
            data-test-id="close-wallet-modal"
            className="btn"
            disabled={loading}
            onClick={() => {
              closeModal()
            }}
          >
            Close
          </button>
          {activeAddress && (
            <button
              className="btn btn-info"
              data-test-id="logout"
              onClick={handleSubscribe}
              disabled={loading}
            >
              {loading && <span className="loading loading-spinner"></span>}
              Subscribe
            </button>
          )}
        </div>
      </form>
    </dialog>
  )
}
export default SubscribeModal
