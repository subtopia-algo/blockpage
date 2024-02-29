import React, { ReactNode, useEffect } from "react"
import { ThemeProvider } from "./ThemeProvider"
import useScheme from "src/hooks/useScheme"
import Header from "./Header"
import styled from "@emotion/styled"
import Scripts from "src/layouts/RootLayout/Scripts"
import useGtagEffect from "./useGtagEffect"
import Prism from "prismjs/prism"
import "prismjs/components/prism-markup-templating.js"
import "prismjs/components/prism-markup.js"
import "prismjs/components/prism-bash.js"
import "prismjs/components/prism-c.js"
import "prismjs/components/prism-cpp.js"
import "prismjs/components/prism-csharp.js"
import "prismjs/components/prism-docker.js"
import "prismjs/components/prism-java.js"
import "prismjs/components/prism-js-templates.js"
import "prismjs/components/prism-coffeescript.js"
import "prismjs/components/prism-diff.js"
import "prismjs/components/prism-git.js"
import "prismjs/components/prism-go.js"
import "prismjs/components/prism-kotlin.js"
import "prismjs/components/prism-graphql.js"
import "prismjs/components/prism-handlebars.js"
import "prismjs/components/prism-less.js"
import "prismjs/components/prism-makefile.js"
import "prismjs/components/prism-markdown.js"
import "prismjs/components/prism-objectivec.js"
import "prismjs/components/prism-ocaml.js"
import "prismjs/components/prism-python.js"
import "prismjs/components/prism-reason.js"
import "prismjs/components/prism-rust.js"
import "prismjs/components/prism-sass.js"
import "prismjs/components/prism-scss.js"
import "prismjs/components/prism-solidity.js"
import "prismjs/components/prism-sql.js"
import "prismjs/components/prism-stylus.js"
import "prismjs/components/prism-swift.js"
import "prismjs/components/prism-wasm.js"
import "prismjs/components/prism-yaml.js"
import "prismjs/components/prism-go.js"
import { DeflyWalletConnect } from "@blockshake/defly-connect"
import { PeraWalletConnect } from "@perawallet/connect"
import {
  ProvidersArray,
  PROVIDER_ID,
  WalletProvider,
  useInitializeProviders,
} from "@txnlab/use-wallet"
import algosdk from "algosdk"
import {
  getKmdConfigFromNextEnvironment,
  getAlgodConfigFromNextEnvironment,
} from "src/libs/utils"
import { SnackbarProvider } from "notistack"

type Props = {
  children: ReactNode
}

let providersArray: ProvidersArray
if (process.env.NEXT_PUBLIC_ALGOD_NETWORK === "") {
  const kmdConfig = getKmdConfigFromNextEnvironment()
  providersArray = [
    {
      id: PROVIDER_ID.KMD,
      clientOptions: {
        wallet: kmdConfig.wallet,
        password: kmdConfig.password,
        host: kmdConfig.server,
        token: String(kmdConfig.token),
        port: String(kmdConfig.port),
      },
    },
  ]
} else {
  providersArray = [
    { id: PROVIDER_ID.DEFLY, clientStatic: DeflyWalletConnect },
    { id: PROVIDER_ID.PERA, clientStatic: PeraWalletConnect },
    { id: PROVIDER_ID.EXODUS },
  ]
}

const RootLayout = ({ children }: Props) => {
  const [scheme] = useScheme()
  useGtagEffect()
  useEffect(() => {
    Prism.highlightAll()
  }, [])

  const algodConfig = getAlgodConfigFromNextEnvironment()

  const walletProviders = useInitializeProviders({
    providers: providersArray,
    nodeConfig: {
      network: algodConfig.network,
      nodeServer: algodConfig.server,
      nodePort: String(algodConfig.port),
      nodeToken: String(algodConfig.token),
    },
    algosdkStatic: algosdk,
  })

  return (
    <ThemeProvider scheme={scheme}>
      <SnackbarProvider maxSnack={3}>
        <WalletProvider value={walletProviders}>
          <Scripts />
          {/* // TODO: replace react query */}
          {/* {metaConfig.type !== "Paper" && <Header />} */}
          <Header fullWidth={false} />
          <StyledMain>{children}</StyledMain>
        </WalletProvider>
      </SnackbarProvider>
    </ThemeProvider>
  )
}

export default RootLayout

const StyledMain = styled.main`
  margin: 0 auto;
  width: 100%;
  max-width: 1120px;
  padding: 0 1rem;
`
