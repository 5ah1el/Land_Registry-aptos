/* import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

export const MODULE_ADDRESS = import.meta.env.VITE_MODULE_ADDRESS as string;
const network = (import.meta.env.VITE_APP_NETWORK as string) || "testnet";
export const aptos = new Aptos(new AptosConfig({ network: network as Network })); */
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";

// 👇 change to your deployed Move module address
const MODULE_ADDRESS = "0xcf0f69e0a886068657624dfd8cb3be6b2736f2c5da30cdba4834baef3f970649";
const MODULE_NAME = "land_registry";

// setup Aptos client
const config = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(config);

// register a property
export async function registerProperty(
  { account, signAndSubmitTransaction }: any,
  propertyId: bigint,
  owner: string,
  metadata: string
) {
  const payload: InputTransactionData = {
    data: {
      function: `${MODULE_ADDRESS}::${MODULE_NAME}::register_property`,
      functionArguments: [propertyId.toString(), owner, metadata],
    },
  };

  return await signAndSubmitTransaction(payload);
}

// transfer a property
export async function transferProperty(
  { signAndSubmitTransaction }: any,
  propertyId: bigint,
  newOwner: string
) {
  const payload: InputTransactionData = {
    data: {
      function: `${MODULE_ADDRESS}::${MODULE_NAME}::transfer_property`,
      functionArguments: [propertyId.toString(), newOwner],
    },
  };

  return await signAndSubmitTransaction(payload);
}

// set verified (admin only)
export async function setVerified(
  { signAndSubmitTransaction }: any,
  propertyId: bigint,
  verified: boolean
) {
  const payload: InputTransactionData = {
    data: {
      function: `${MODULE_ADDRESS}::${MODULE_NAME}::set_verified`,
      functionArguments: [propertyId.toString(), verified],
    },
  };

  return await signAndSubmitTransaction(payload);
}

// view property info
export async function viewGetInfo(propertyId: bigint) {
  return await aptos.view({
    payload: {
      function: `${MODULE_ADDRESS}::${MODULE_NAME}::get_info`,
      typeArguments: [],
      functionArguments: [propertyId.toString()],
    },
  });
}
