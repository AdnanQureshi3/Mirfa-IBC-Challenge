"use client";

import { useState } from "react";

export default function Home() {
  const [partyId, setPartyId] = useState("");
  const [payloadText, setPayloadText] = useState(
    `{
  "amount": 100,
  "currency": "AED"
}`
  );
  const [txId, setTxId] = useState("");
  const [encrypted, setEncrypted] = useState<any>(null);
  const [decrypted, setDecrypted] = useState<any>(null);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:3001";

  async function handleEncrypt() {
    setError("");
    setDecrypted(null);

    try {
      const payload = JSON.parse(payloadText);

      const res = await fetch(`${API_URL}/tx/encrypt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partyId, payload })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Encryption failed");

      setEncrypted(data);
      setTxId(data.id);
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleFetch() {
    setError("");
    try {
      const res = await fetch(`${API_URL}/tx/${txId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Fetch failed");
      setEncrypted(data);
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleDecrypt() {
    setError("");
    try {
      const res = await fetch(`${API_URL}/tx/${txId}/decrypt`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Decrypt failed");
      setDecrypted(data);
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Secure Transaction Demo
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">

        {/* LEFT SIDE */}
        <div className="bg-white shadow-lg rounded-xl p-6 space-y-6">

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Party ID
            </label>
            <input
              value={partyId}
              onChange={(e) => setPartyId(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Payload (JSON)
            </label>
            <textarea
              rows={10}
              value={payloadText}
              onChange={(e) => setPayloadText(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Transaction ID
            </label>
            <input
              value={txId}
              onChange={(e) => setTxId(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleEncrypt}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Encrypt & Save
            </button>

            <button
              onClick={handleFetch}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Fetch
            </button>

            <button
              onClick={handleDecrypt}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Decrypt
            </button>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">

          {encrypted && (
            <div className="bg-white shadow-lg rounded-xl p-6">
              <h3 className="font-semibold mb-2">Encrypted Record</h3>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto max-h-[300px] overflow-y-auto">
                {JSON.stringify(encrypted, null, 2)}
              </pre>
            </div>
          )}

          {decrypted && (
            <div className="bg-white shadow-lg rounded-xl p-6">
              <h3 className="font-semibold mb-2">Decrypted Payload</h3>
              <pre className="bg-gray-900 text-blue-400 p-4 rounded-lg text-sm overflow-x-auto">
                {JSON.stringify(decrypted, null, 2)}
              </pre>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
