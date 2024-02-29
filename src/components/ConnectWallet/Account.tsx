import { useWallet } from "@txnlab/use-wallet"
import { useMemo } from "react"
import {
  ellipseAddress,
  getAlgodConfigFromNextEnvironment,
} from "src/libs/utils"

const Account = () => {
  const { activeAddress } = useWallet()
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
    </div>
  )
}

export default Account
