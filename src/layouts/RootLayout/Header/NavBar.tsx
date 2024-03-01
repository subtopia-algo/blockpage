import styled from "@emotion/styled"
import { useWallet } from "@txnlab/use-wallet"
import Link from "next/link"
import { useState } from "react"
import ConnectWallet from "src/components/ConnectWallet"

interface DialogProps {
  onClose: () => void
  children: React.ReactNode // Explicitly declare the children prop
}

const Dialog: React.FC<DialogProps> = ({ children, onClose }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "8px",
        zIndex: 100,
      }}
    >
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  )
}

const NavBar: React.FC = () => {
  const { activeAddress } = useWallet()
  const [isDialogOpen, setDialogOpen] = useState(false)

  const toggleWalletModal = () => {
    setDialogOpen((prev) => !prev)
  }

  return (
    <StyledWrapper>
      <ul>
        <li>
          {activeAddress ? (
            <button className="button" onClick={toggleWalletModal}>
              Account
            </button>
          ) : (
            <button onClick={toggleWalletModal}>Login</button>
          )}
        </li>
      </ul>

      <ConnectWallet openModal={isDialogOpen} closeModal={toggleWalletModal} />
    </StyledWrapper>
  )
}

export default NavBar

const StyledWrapper = styled.div`
  flex-shrink: 0;
  ul {
    display: flex;
    flex-direction: row;
    li {
      display: block;
      margin-left: 1rem;
      color: ${({ theme }) => theme.colors.gray11};
    }
  }
`
