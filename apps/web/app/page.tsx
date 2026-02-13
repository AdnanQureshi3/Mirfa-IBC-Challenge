"use client";

import { useState } from "react";

export default function Home() {
  const [partyId, setPartyId] = useState("party_123"); // default value
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
  const [loading, setLoading] = useState(false);

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  async function handleEncrypt() {
    setError("");
    setEncrypted(null);
    setDecrypted(null);
    setLoading(true);

    try {
      if (!partyId.trim()) {
        throw new Error("Party ID cannot be empty.");
      }

      const payload = JSON.parse(payloadText);

      if (typeof payload.amount !== "number") {
        throw new Error("Amount must be a number.");
      }

      if (
        typeof payload.currency !== "string" ||
        !payload.currency.trim()
      ) {
        throw new Error("Currency must be a non-empty string.");
      }

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
    } finally {
      setLoading(false);
    }
  }

  async function handleFetch() {
    setError("");
    setLoading(true);

    try {
      if (!txId.trim()) {
        throw new Error("Transaction ID cannot be empty.");
      }

      const res = await fetch(`${API_URL}/tx/${txId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Fetch failed");

      setEncrypted(data);
      setDecrypted(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDecrypt() {
    setError("");
    setLoading(true);

    try {
      if (!txId.trim()) {
        throw new Error("Transaction ID cannot be empty.");
      }

      const res = await fetch(`${API_URL}/tx/${txId}/decrypt`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Decrypt failed");

      setDecrypted(data);
      setEncrypted(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleDownload() {
    if (!encrypted) return;

    const blob = new Blob(
      [JSON.stringify(encrypted, null, 2)],
      { type: "text/plain;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `encrypted_${encrypted.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Secure Transactions Demo
        </h1>

        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-lg text-sm">
          ⚠️ Remember your Transaction ID. You will need it to fetch or decrypt the record later.
        </div>

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
            rows={8}
            value={payloadText}
            onChange={(e) => setPayloadText(e.target.value)}
            className="mt-1 w-full border rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-4 flex-wrap">
          <button
            onClick={handleEncrypt}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Encrypt & Save"}
          </button>

          <button
            onClick={handleFetch}
            disabled={loading}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Fetch"}
          </button>

          <button
            onClick={handleDecrypt}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Decrypt"}
          </button>
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

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg">
            {error}
          </div>
        )}

        {encrypted && (
          <div>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-700">
                Encrypted Record
              </h3>
              <button
                onClick={handleDownload}
                className="text-sm border px-3 py-1 rounded hover:bg-gray-100"
              >
                Download .txt
              </button>
            </div>

            <pre className="mt-2 bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
              {JSON.stringify(encrypted, null, 2)}
            </pre>
          </div>
        )}

        {decrypted && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700">
              Decrypted Payload
            </h3>
            <pre className="mt-2 bg-gray-900 text-blue-400 p-4 rounded-lg text-sm overflow-x-auto">
              {JSON.stringify(decrypted, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
