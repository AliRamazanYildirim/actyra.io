"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import useTicketStore from "@/store/ticketStore";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Stripe public key ile bir Stripe promise oluştur
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Ödeme Formu Bileşeni
const CheckoutForm = ({ paymentData, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [orderNumber, setOrderNumber] = useState(""); // OrderNumber speichern
  
  useEffect(() => {
    // Ödeme niyeti oluştur
    const createPaymentIntent = async () => {
      try {
        const response = await fetch("/api/tickets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Ödeme başlatılamadı");
        }
        
        const data = await response.json();
        console.log('API-Antwort:', data); // Log zur Fehlerbehebung
        setClientSecret(data.clientSecret);
        
        // Bestellnummer speichern
        setOrderNumber(data.orderNumber);
        
        // Ön başarı - backend'e kayıt gerçekleşti (orderNumber übergeben)
        onSuccess({ type: "initialized", orderNumber: data.orderNumber });
        
      } catch (error) {
        onError(error.message);
      }
    };
    
    if (paymentData) {
      createPaymentIntent();
    }
  }, [paymentData, onSuccess, onError]);

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
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (paymentIntent.status === "succeeded") {
        // Die orderNumber aus dem vorherigen API-Aufruf verwenden
        onSuccess({ 
          type: "completed",
          paymentId: paymentIntent.id,
          orderNumber: orderNumber // Die gespeicherte orderNumber übergeben!
        });
      }
    } catch (error) {
      onError(error.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Kart Bilgileri</label>
        <div className="p-4 bg-gray-800 rounded border border-gray-700">
          <CardElement options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#ffffff',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#fa755a',
              },
            },
          }} />
        </div>
      </div>
      
      <button
        type="submit"
        disabled={!stripe || processing || !clientSecret}
        className={`ticket-button cursor-pointer w-full ${
          !stripe || processing || !clientSecret
            ? "bg-gray-700 cursor-not-allowed"
            : "bg-pink-600 hover:bg-pink-700"
        }`}
      >
        {processing ? "İşleniyor..." : "Ödemeyi Tamamla"}
      </button>
    </form>
  );
};

export default function CheckoutPage() {
  const router = useRouter();
  const tickets = useTicketStore(state => state.tickets);
  const resetTicketState = useTicketStore(state => state.resetTicketState);
  
  const [paymentStep, setPaymentStep] = useState("form"); // form, processing, success
  const [paymentData, setPaymentData] = useState(null);
  const [paymentResult, setPaymentResult] = useState({});
  const [error, setError] = useState(null);
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    method: "creditcard", // Stripe kullandığımız için kart ödeme seçeneği
  });

  const isValid = form.name && form.email;
  
  const totalPrice = tickets?.reduce((sum, t) => sum + t.totalPrice, 0) || 0;
  const totalDonation = tickets?.reduce((sum, t) => sum + (t.totalDonation || 0), 0) || 0;
  const total = totalPrice + totalDonation;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePreparePayment = () => {
    if (!tickets || tickets.length === 0) {
      router.push('/');
      return;
    }
    
    setPaymentData({
      name: form.name,
      email: form.email,
      tickets: tickets,
      paymentMethod: form.method,
      totalAmount: total
    });
    
    setPaymentStep("processing");
  };

  const handlePaymentSuccess = (result) => {
    console.log('Payment Success Result:', result);
    
    // Update paymentResult 
    setPaymentResult(prevResult => {
      const newResult = {...(prevResult || {}), ...result};
      console.log('Updated Payment Result:', newResult);
      return newResult;
    });
    
    if (result.type === "completed") {
      // Warenkorb zurücksetzen
      resetTicketState();
      
      // Die richtige orderNumber bestimmen
      const orderNum = result.orderNumber || paymentResult.orderNumber;
      console.log('Using order number for redirect:', orderNum);
      
      // Zur Erfolgsseite weiterleiten
      const firstTicket = tickets[0];
      const queryParams = new URLSearchParams({
        name: form.name,
        email: form.email,
        title: firstTicket.eventTitle,
        quantity: tickets.reduce((sum, t) => sum + t.quantity, 0),
        paymentMethod: form.method,
        totalAmount: total.toString(),
        orderNumber: orderNum
      }).toString();
      
      console.log(`Redirect to: /events/${firstTicket.slug}/success?${queryParams}`);
      router.push(`/events/${firstTicket.slug}/success?${queryParams}`);
    }
  };
  
  const handlePaymentError = (errorMessage) => {
    setError(errorMessage);
    setPaymentStep("form");
    setPaymentData(null);
  };

  return (
    <>
      <NavBar />
      <main className="max-w-5xl mx-auto px-6 py-24">
        <div className="bg-[#0f172a] text-white rounded-2xl shadow-2xl overflow-hidden p-8 space-y-6">
          <h1 className="text-3xl font-bold text-center">
            {paymentStep === "form" ? "Ödeme Bilgileri" : "Ödeme"}
          </h1>
          
          {error && (
            <div className="bg-red-900/30 border border-red-700 p-4 rounded-md text-white">
              <p>{error}</p>
              <button 
                onClick={() => setError(null)} 
                className="text-sm underline mt-2"
              >
                Tekrar dene
              </button>
            </div>
          )}
          
          {paymentStep === "form" ? (
            <>
              <div className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="İsim"
                  value={form.name}
                  onChange={handleChange}
                  className="ticket-input placeholder:text-gray-600"
                />
                
                <input
                  type="email"
                  name="email"
                  placeholder="E-posta"
                  value={form.email}
                  onChange={handleChange}
                  className="ticket-input placeholder:text-gray-600"
                />
              </div>

              <div className="text-right text-xl font-bold">
                Toplam: {total} €
              </div>

              <button
                disabled={!isValid}
                onClick={handlePreparePayment}
                className={`ticket-button cursor-pointer w-full ${
                  isValid ? "bg-pink-600 hover:bg-pink-700" : "bg-gray-700 cursor-not-allowed"
                }`}
              >
                Ödemeye Devam Et
              </button>
            </>
          ) : (
            <Elements stripe={stripePromise}>
              <CheckoutForm 
                paymentData={paymentData} 
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </Elements>
          )}
        </div>
      </main>
    </>
  );
}