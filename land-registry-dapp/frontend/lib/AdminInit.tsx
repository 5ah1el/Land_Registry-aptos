/* import { useWallet } from "@aptos-labs/wallet-adapter-react";

export default function AdminInit() {
  const { signAndSubmitTransaction } = useWallet();

  const run = async () => {
    const payload = {
      type: "entry_function_payload",
      function: `${import.meta.env.VITE_MODULE_ADDRESS}::property_registry::initialize_registry`,
      type_arguments: [],
      arguments: [],
    };
    await signAndSubmitTransaction(payload);
    alert("Registry initialized");
  };

  return (
    <button onClick={run} className="px-4 py-2 bg-blue-600 text-white rounded">
      Initialize Registry
    </button>
  );
}
 */