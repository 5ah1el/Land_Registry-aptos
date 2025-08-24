import { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

// Internal Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { WalletDetails } from "@/components/WalletDetails";
import { NetworkInfo } from "@/components/NetworkInfo";
import { AccountInfo } from "@/components/AccountInfo";
import { TransferAPT } from "@/components/TransferAPT";
import { MessageBoard } from "@/components/MessageBoard";
import { TopBanner } from "@/components/TopBanner";

// Aptos helpers
import { registerProperty, transferProperty, setVerified, viewGetInfo } from "@/lib/aptos";

function App() {
  const { connected, account, signAndSubmitTransaction } = useWallet();

  const [propId, setPropId] = useState("1");
  const [meta, setMeta] = useState("Plot 42, DocHash=Qm...");
  const [newOwner, setNewOwner] = useState("");
  const [lookupId, setLookupId] = useState("1");

  const handleRegister = async () => {
  if (!account?.address) {
    alert("Wallet not connected");
    return;
  }

  try {
    const tx = await registerProperty(
      { account, signAndSubmitTransaction },
      BigInt(propId),
      account.address.toString(),
      meta
    );
    alert("Property registered! Tx hash: " + tx.hash);
  } catch (err) {
    console.error(err);
    alert("Error registering property");
  }
};


  const handleTransfer = async () => {
    try {
      const tx = await transferProperty({ account, signAndSubmitTransaction }, BigInt(propId), newOwner);
      alert("Transferred! Tx hash: " + tx.hash);
    } catch (err) {
      console.error(err);
      alert("Error transferring property");
    }
  };

  const handleVerify = async () => {
    try {
      const tx = await setVerified({ account, signAndSubmitTransaction }, BigInt(propId), true);
      alert("Verified! Tx hash: " + tx.hash);
    } catch (err) {
      console.error(err);
      alert("Error verifying property");
    }
  };

  const handleLookup = async () => {
    try {
      const res = await viewGetInfo(BigInt(lookupId));
      alert("Lookup result: " + JSON.stringify(res));
    } catch (err) {
      console.error(err);
      alert("Error looking up property");
    }
  };

  return (
    <>
      <TopBanner />
      <Header />
      <div className="flex items-center justify-center flex-col">
        {connected ? (
          <Card className="p-6">
            <CardContent className="flex flex-col gap-10 pt-6">
              {/* Existing Components */}
              <WalletDetails />
              <NetworkInfo />
              <AccountInfo />
              <TransferAPT />
              <MessageBoard />

              {/* 🚀 Land Registry Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Land Registry</h2>

                {/* Register */}
                <div className="flex flex-col gap-2">
                  <input
                    value={propId}
                    onChange={(e) => setPropId(e.target.value)}
                    placeholder="Property ID"
                    className="border rounded p-2"
                  />
                  <input
                    value={meta}
                    onChange={(e) => setMeta(e.target.value)}
                    placeholder="Metadata (e.g. Plot info)"
                    className="border rounded p-2"
                  />
                  <button
                    onClick={handleRegister}
                    className="bg-blue-600 text-white rounded p-2"
                  >
                    Register Property
                  </button>
                </div>

                {/* Transfer */}
                <div className="flex flex-col gap-2">
                  <input
                    value={newOwner}
                    onChange={(e) => setNewOwner(e.target.value)}
                    placeholder="New Owner Address (0x...)"
                    className="border rounded p-2"
                  />
                  <button
                    onClick={handleTransfer}
                    className="bg-green-600 text-white rounded p-2"
                  >
                    Transfer Property
                  </button>
                </div>

                {/* Verify */}
                <button
                  onClick={handleVerify}
                  className="bg-purple-600 text-white rounded p-2"
                >
                  Verify Property (Admin only)
                </button>

                {/* Lookup */}
                <div className="flex flex-col gap-2">
                  <input
                    value={lookupId}
                    onChange={(e) => setLookupId(e.target.value)}
                    placeholder="Property ID to lookup"
                    className="border rounded p-2"
                  />
                  <button
                    onClick={handleLookup}
                    className="bg-gray-800 text-white rounded p-2"
                  >
                    Lookup Property
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <CardHeader>
            <CardTitle>To get started Connect a wallet</CardTitle>
          </CardHeader>
        )}
      </div>
    </>
  );
}

export default App;
