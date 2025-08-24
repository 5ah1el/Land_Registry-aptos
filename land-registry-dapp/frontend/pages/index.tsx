import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState } from "react";
import { registerProperty, viewGetInfo } from "../lib/aptos";

export default function Home() {
  const { connect, disconnect, account, connected, wallets, signAndSubmitTransaction } = useWallet();

  const [propId, setPropId] = useState("1");
  const [meta, setMeta] = useState("Plot 42, DocumentHash=Qm123");
  const [lookupId, setLookupId] = useState("1");

  const handleRegister = async () => {
    if (!connected || !account) return;
    try {
      const tx = await registerProperty({ account, signAndSubmitTransaction }, BigInt(propId), account.address.toString(), meta);
      alert("Registered property! Tx hash: " + tx.hash);
    } catch (err) {
      console.error(err);
      alert("Error registering property");
    }
  };

  const handleLookup = async () => {
    try {
      const res = await viewGetInfo(BigInt(lookupId));
      alert("Lookup result: " + JSON.stringify(res));
    } catch (err) {
      console.error(err);
      alert("Error fetching property");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Aptos Land Registry (Hackathon)</h1>

      {!connected ? (
        <button onClick={() => connect(wallets[0].name)}>Connect Petra Wallet</button>
      ) : (
        <div>
          <p>Connected: {account?.address.toString()}</p>
          <button onClick={() => disconnect()}>Disconnect</button>
        </div>
      )}

      <hr />

      <h2>Register Property</h2>
      <input value={propId} onChange={e => setPropId(e.target.value)} placeholder="Property ID" />
      <input value={meta} onChange={e => setMeta(e.target.value)} placeholder="Metadata" />
      <button disabled={!connected} onClick={handleRegister}>Register</button>

      <h2>Lookup Property</h2>
      <input value={lookupId} onChange={e => setLookupId(e.target.value)} placeholder="Property ID" />
      <button onClick={handleLookup}>Lookup</button>
    </div>
  );
}
