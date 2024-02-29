import { Provider, useWallet } from "@txnlab/use-wallet"

interface SubscribeModalInterface {
  openModal: boolean
  closeModal: () => void
}

const SubscribeModal = ({ openModal, closeModal }: SubscribeModalInterface) => {
  const { providers, activeAddress } = useWallet()

  const handleSubscribe = () => {}

  return (
    <dialog
      id="connect_wallet_modal"
      className={`modal ${openModal ? "modal-open" : ""}`}
    >
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-2xl">Subscribe to BlockPost</h3>

        <p className="py-4">
          Thank you for your interest in BlockPost. This platform serves as a
          demonstration of content monetization through Subtopia.io and Notion,
          utilizing the Algorand MainNet for transactions. Please note, while
          subscription access is complimentary for demonstration purposes, a
          nominal transaction fee is required for blockchain submission.
        </p>

        <div className="modal-action ">
          <button
            data-test-id="close-wallet-modal"
            className="btn"
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
            >
              Subscribe
            </button>
          )}
        </div>
      </form>
    </dialog>
  )
}
export default SubscribeModal
