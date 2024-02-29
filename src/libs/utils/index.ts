import { AlgoNextClientConfig, AlgoNextKMDConfig } from "src/interfaces"

export function formatDate(date: any, local: any) {
  const d = new Date(date)
  const options: any = { year: "numeric", month: "short", day: "numeric" }
  const res = d.toLocaleDateString(local, options)
  return res
}

export function ellipseAddress(address = ``, width = 6): string {
  return address
    ? `${address.slice(0, width)}...${address.slice(-width)}`
    : address
}

export function getAlgodConfigFromNextEnvironment(): AlgoNextClientConfig {
  if (!process.env.NEXT_PUBLIC_ALGOD_SERVER) {
    throw new Error(
      "Attempt to get default algod configuration without specifying VITE_ALGOD_SERVER in the environment variables"
    )
  }

  return {
    server: process.env.NEXT_PUBLIC_ALGOD_SERVER,
    port: process.env.NEXT_PUBLIC_ALGOD_PORT!,
    token: process.env.NEXT_PUBLIC_ALGOD_TOKEN!,
    network: process.env.NEXT_PUBLIC_ALGOD_NETWORK!,
  }
}

export function getKmdConfigFromNextEnvironment(): AlgoNextKMDConfig {
  if (!process.env.NEXT_PUBLIC_KMD_SERVER) {
    throw new Error(
      "Attempt to get default kmd configuration without specifying VITE_KMD_SERVER in the environment variables"
    )
  }

  return {
    server: process.env.NEXT_PUBLIC_KMD_SERVER,
    port: process.env.NEXT_PUBLIC_KMD_PORT!,
    token: process.env.NEXT_PUBLIC_KMD_TOKEN!,
    wallet: process.env.NEXT_PUBLIC_KMD_WALLET!,
    password: process.env.NEXT_PUBLIC_KMD_PASSWORD!,
  }
}
