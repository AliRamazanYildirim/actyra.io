"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import NavBar from "@/components/NavBar";
import HeroDetailComp from "@/components/HeroDetailComp";

export default function PaymentPage({ params }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState({
    name: "",
    email: "",
    method: "paypal",
  });

  const quantity = searchParams.get("quantity") || "1";
  const price = searchParams.get("price") || "0";
  const donation = searchParams.get("donation") || "3";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMethodSelect = (method) => {
    setForm({ ...form, method });
  };

  const handleSubmit = () => {
    const query = new URLSearchParams({
      quantity,
      price,
      donation,
      name: form.name,
      email: form.email,
      method: form.method,
    }).toString();

    router.push(`/events/${params.slug}/success?${query}`);
  };

  const isValid = form.name && form.email;

  return (
    <>
      <NavBar />
      <HeroDetailComp />

      <main className="max-w-5xl mx-auto px-6 py-24">
        <div className="bg-[#0f172a] text-white rounded-2xl shadow-2xl overflow-hidden p-8 space-y-6">
          <h1 className="text-3xl font-bold text-center">Zahlungsmethode wählen</h1>

          <div className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Dein Name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600"
            />
            <input
              type="email"
              name="email"
              placeholder="E-Mail-Adresse"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Zahlungsart:</h2>
            <div className="flex flex-col gap-3">
              {[
                { id: "paypal", label: "PayPal" },
                { id: "creditcard", label: "Kreditkarte" },
                { id: "bank", label: "Banküberweisung" },
              ].map((method) => (
                <label
                  key={method.id}
                  className={`cursor-pointer px-4 py-2 rounded border ${
                    form.method === method.id
                      ? "bg-pink-600 border-pink-400"
                      : "bg-gray-800 border-gray-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="method"
                    value={method.id}
                    checked={form.method === method.id}
                    onChange={() => handleMethodSelect(method.id)}
                    className="hidden"
                  />
                  {method.label}
                  {method.id === "bank" && (
                    <span className="block text-xs mt-1 text-gray-400">
                      Bitte überweisen Sie den Betrag innerhalb von 5 Werktagen…
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>

          <button
            disabled={!isValid}
            onClick={handleSubmit}
            className={`w-full mt-6 py-3 rounded-full font-bold transition ${
              isValid
                ? "bg-pink-600 hover:bg-pink-700"
                : "bg-gray-700 cursor-not-allowed"
            }`}
          >
            Jetzt kostenpflichtig bestellen
          </button>
        </div>
      </main>
    </>
  );
}
