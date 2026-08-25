"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import useTicketStore from "@/store/ticketStore";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { CreditCard, ShieldCheck, Lock, ChevronLeft, ArrowRight, Heart } from "lucide-react";
import Link from "next/link";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ clientSecret, orderNumber, paymentData, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements || !clientSecret) return;
    setProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: paymentData.name,
            email: paymentData.email,
          },
        },
      });

      if (error) throw new Error(error.message);

      if (paymentIntent.status === "succeeded") {
        onSuccess({ type: "completed", paymentId: paymentIntent.id, orderNumber });
      }
    } catch (err) {
      onError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
          Kreditkarten-Informationen
        </label>
        <div className="p-4 bg-white dark:bg-[#141738] rounded-xl border border-slate-300 dark:border-slate-700 shadow-sm">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "15px",
                  color: "#1e293b",
                  "::placeholder": { color: "#94a3b8" },
                },
                invalid: { color: "#ef4444" },
              },
            }}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || processing || !clientSecret}
        className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:opacity-95 disabled:opacity-50 text-white font-bold text-base shadow-lg shadow-pink-500/25 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
      >
        <Lock className="w-4 h-4" />
        <span>{processing ? "Zahlung wird autorisiert..." : "Zahlung jetzt abschließen"}</span>
      </button>
    </form>
  );
};

export default function CheckoutPage() {
  const router = useRouter();
  const cartTickets = useTicketStore((state) => state.cartTickets);
  const resetTicketState = useTicketStore((state) => state.resetTicketState);

  const [paymentStep, setPaymentStep] = useState("form");
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [orderNumber, setOrderNumber] = useState("");

  const [form, setForm] = useState({ name: "", email: "", method: "creditcard" });
  const isValid = form.name.trim().length > 1 && form.email.includes("@");

  const totalPrice = cartTickets?.reduce((sum, t) => sum + (t.price * t.quantity), 0) || 0;
  const totalDonation = cartTickets?.reduce((sum, t) => sum + ((t.donation || 0) * t.quantity), 0) || 0;
  const total = totalPrice + totalDonation;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePreparePayment = async () => {
    if (!cartTickets || cartTickets.length === 0) return router.push("/");

    const dataToSend = {
      name: form.name,
      email: form.email,
      cartTickets,
      paymentMethod: form.method,
      totalAmount: total,
    };

    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) throw new Error("Die Zahlung konnte nicht gestartet werden.");

      const data = await response.json();
      setClientSecret(data.clientSecret);
      setOrderNumber(data.orderNumber);
      setPaymentData(dataToSend);
      setPaymentStep("processing");
    } catch (err) {
      setError(err.message);
      setPaymentStep("form");
    }
  };

  const handlePaymentSuccess = (result) => {
    if (result.type === "completed") {
      resetTicketState();
      const firstTicket = cartTickets[0];
      const queryParams = new URLSearchParams({
        name: form.name,
        email: form.email,
        title: firstTicket.eventTitle,
        quantity: cartTickets.reduce((sum, t) => sum + t.quantity, 0),
        paymentMethod: form.method,
        totalAmount: total.toString(),
        orderNumber: result.orderNumber,
      }).toString();
      router.push(`/events/${firstTicket.slug}/success?${queryParams}`);
    }
  };

  const handlePaymentError = (message) => {
    setError(message);
    setPaymentStep("form");
    setPaymentData(null);
    setClientSecret("");
    setOrderNumber("");
  };

  return (
    <div className="min-h-screen py-24 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8">
      {/* Back to Cart */}
      <Link
        href="/warenkorb"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-pink-500"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Zurück zum Warenkorb</span>
      </Link>

      <div className="bg-white dark:bg-[#0d0f26] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-6 sm:p-10 space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white mx-auto shadow-md shadow-pink-500/20">
            <CreditCard className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {paymentStep === "form" ? "Kontaktdaten & Zahlung" : "Kreditkarten-Zahlung"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Deine Daten werden verschlüsselt und sicher verarbeitet.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
            <p className="font-semibold">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-xs underline mt-1 cursor-pointer"
            >
              Erneut versuchen
            </button>
          </div>
        )}

        {paymentStep === "form" ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Vollständiger Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Max Mustermann"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#141738] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  E-Mail-Adresse für Ticketzustellung
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="max@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#141738] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>

            {/* Total Badge */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#141738] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Zu zahlender Gesamtbetrag:
              </span>
              <span className="text-2xl font-extrabold text-pink-600 dark:text-pink-400">
                {total} €
              </span>
            </div>

            <button
              disabled={!isValid}
              onClick={handlePreparePayment}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:opacity-95 disabled:opacity-50 text-white font-bold text-base shadow-lg shadow-pink-500/25 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Weiter zur Karteneingabe</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : clientSecret ? (
          <Elements stripe={stripePromise}>
            <CheckoutForm
              clientSecret={clientSecret}
              orderNumber={orderNumber}
              paymentData={paymentData}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </Elements>
        ) : (
          <div className="text-center py-8 text-slate-400">Zahlungsmodul wird initialisiert...</div>
        )}

        <div className="flex items-center justify-center gap-6 text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-6">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Stripe Security</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-pink-500" />
            <span>Geprüfter Spendenanteil</span>
          </div>
        </div>
      </div>
    </div>
  );
}
