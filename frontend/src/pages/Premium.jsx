import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import PageIntro from "../components/experience/PageIntro";
import { api, USER_TOKEN_KEY, createIdempotencyKey } from "../lib/api";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    tag: "Always free",
    features: [
      "AI comparisons",
      "Car recommendations",
      "EMI planning tools",
      "AI support",
    ],
    disabled: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: 199,
    tag: "Most popular",
    featured: true,
    features: [
      "Unlimited AI comparisons",
      "Vehicle showroom access where assets are available",
      "Supported model configuration options",
      "Priority 24×7 AI expert chat",
      "Price-drop & waiting-period alerts",
      "Dealer enquiry tools",
      "Finance and insurance enquiries",
    ],
  },
  {
    id: "dealer",
    name: "Dealer / Business",
    price: 999,
    tag: "For dealerships",
    features: [
      "Everything in Premium",
      "Leads dashboard + CRM export",
      "Multi-user accounts (5 seats)",
      "Branded customer reports",
      "API access",
    ],
  },
];

function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(true);
    const existing = document.querySelector('script[data-razorpay="checkout"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(true), { once: true });
      existing.addEventListener("error", reject, { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.dataset.razorpay = "checkout";
    script.onload = () => resolve(true);
    script.onerror = () =>
      reject(new Error("Razorpay Checkout could not be loaded"));
    document.body.appendChild(script);
  });
}

export default function Premium() {
  const [checkoutIdempotencyKey] = useState(() => createIdempotencyKey());
  const [buyingId, setBuyingId] = useState(null);
  const [paymentState, setPaymentState] = useState(null); // pending | paid | failed
  const [params] = useSearchParams();
  const nav = useNavigate();

  useEffect(() => {
    if (params.get("payment") === "success") setPaymentState("returned");
    if (params.get("payment") === "failed") setPaymentState("failed");
  }, [params]);

  const subscribe = async (planId) => {
    if (!localStorage.getItem(USER_TOKEN_KEY)) {
      nav("/login");
      return;
    }
    setBuyingId(planId);
    setPaymentState(null);

    try {
      await loadRazorpayScript();
      const { data: order } = await api.post("/checkout/order", {
        plan_id: planId,
        idempotency_key: checkoutIdempotencyKey,
      });

      const options = {
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: "Auto-AI India",
        description: `${order.plan_name} — one-time access`,
        order_id: order.order_id,
        prefill: {
          contact: order.customer_phone || "",
        },
        theme: { color: "#17191c" },
        modal: {
          ondismiss: () => setBuyingId(null),
        },
        handler: async (response) => {
          setPaymentState("pending");
          try {
            await api.post("/checkout/verify", {
              plan_id: planId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            setPaymentState("paid");
          } catch (error) {
            console.error("Razorpay verification failed", error);
            setPaymentState("failed");
          } finally {
            setBuyingId(null);
          }
        },
      };

      const checkout = new window.Razorpay(options);
      checkout.on("payment.failed", () => {
        setPaymentState("failed");
        setBuyingId(null);
      });
      checkout.open();
    } catch (error) {
      console.error("Could not start Razorpay checkout", error);
      setPaymentState("failed");
      setBuyingId(null);
    }
  };

  return (
    <div
      className="aai-service-page aai-container aai-section"
      data-testid="premium-page"
    >
      <PageIntro
        eyebrow="AutoAI membership"
        title={
          <>
            A little more insight.
            <br />
            For the road ahead.
          </>
        }
        description="Explore the available access plans. Final pricing and eligibility are confirmed through secure checkout."
        image="/media/editorial-hero.jpg"
      />
      {paymentState && (
        <div
          className="aai-workbench"
          role="status"
          data-testid={
            paymentState === "paid"
              ? "payment-success-banner"
              : paymentState === "failed"
                ? "payment-failed-banner"
                : "payment-pending-banner"
          }
        >
          {paymentState === "paid"
            ? "Your payment was verified by the service."
            : paymentState === "failed"
              ? "Payment could not be completed or verified. Please try again."
              : paymentState === "returned"
                ? "You returned from checkout. A URL parameter does not confirm payment or active access."
                : "Verifying your payment…"}
        </div>
      )}
      <div className="aai-membership-plans">
        {PLANS.map((p) => (
          <article
            key={p.id}
            className={`aai-membership-plan ${p.featured ? "featured" : ""}`}
            data-testid={`plan-${p.id}`}
          >
            <span className="aai-kicker">
              {p.id === "free"
                ? "Start exploring"
                : p.id === "dealer"
                  ? "For your business"
                  : "For your next chapter"}
            </span>
            <h2>{p.name}</h2>
            <div className="aai-plan-price">₹{p.price}</div>
            <small>
              {p.price
                ? "Listed one-time price · confirm at checkout"
                : "Explore free tools"}
            </small>
            <ul>
              {p.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            {p.disabled ? (
              <Link
                className="aai-button"
                to="/cars"
                data-testid={`plan-cta-${p.id}`}
              >
                Explore the collection
              </Link>
            ) : (
              <button
                className={`aai-button ${p.featured ? "light" : ""}`}
                disabled={Boolean(buyingId)}
                onClick={() => subscribe(p.id)}
                data-testid={`plan-cta-${p.id}`}
              >
                {buyingId === p.id
                  ? "Opening checkout…"
                  : "Continue to secure checkout"}
              </button>
            )}
          </article>
        ))}
      </div>
      <div className="aai-membership-note">
        <span className="aai-kicker">Before you choose</span>
        <p>
          3D viewing and vehicle interactions depend on verified, model-specific
          assets. A membership does not make unavailable assets available.
          Confirm included services and the final total before paying.
        </p>
        <p>
          Checkout uses the existing payment service. Vehicle enquiries and any
          remaining vehicle payment are separate.
        </p>
        <Link
          className="aai-text-link"
          to="/cars"
          data-testid="premium-cta-trial"
        >
          Explore the collection →
        </Link>
      </div>
    </div>
  );
}
