import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { USER_TOKEN_KEY } from "../lib/api";
import useApiAction from "../hooks/useApiAction";
import PageIntro, { FormMessage } from "../components/experience/PageIntro";
export default function Login() {
  const [step, setStep] = useState(1),
    [phone, setPhone] = useState(""),
    [otp, setOtp] = useState(""),
    [demoOtp, setDemoOtp] = useState("");
  const action = useApiAction(),
    navigate = useNavigate();
  const send = async (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(phone)) return;
    const data = await action.submit("/auth/send-otp", { phone });
    if (data) {
      setDemoOtp(data.demo_otp || "");
      setStep(2);
    }
  };
  const verify = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp)) return;
    const data = await action.submit("/auth/verify-otp", { phone, otp });
    if (data?.token) {
      localStorage.setItem(USER_TOKEN_KEY, data.token);
      localStorage.setItem("autoai_phone", data.phone || phone);
      navigate("/my-bookings");
    }
  };
  return (
    <div
      className="aai-service-page aai-container aai-section"
      data-testid="login-page"
    >
      <div className="aai-login-layout">
        <PageIntro
          eyebrow="My AutoAI"
          title={
            <>
              Your next chapter.
              <br />
              All in one place.
            </>
          }
          description="Sign in to follow your bookings and pick up where you left off."
          image="/media/editorial-sedan.jpg"
        />
        <section className="aai-workbench">
          <span className="aai-kicker">
            {step === 1 ? "Welcome to My AutoAI" : "Verify your number"}
          </span>
          <h2>
            {step === 1 ? "Let’s get you started." : "A small step closer."}
          </h2>
          <p>
            {step === 1
              ? "We’ll send a one-time code to your phone."
              : `Enter the six-digit code sent to +91 ${phone}.`}
          </p>
          {step === 1 ? (
            <form
              className="aai-form"
              onSubmit={send}
              data-testid="otp-phone-form"
            >
              <label>
                Mobile number
                <span className="aai-phone-input">
                  <span>+91</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    required
                    pattern="[0-9]{10}"
                    maxLength={10}
                    autoComplete="tel-national"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/[^0-9]/g, ""))
                    }
                    data-testid="login-phone-input"
                  />
                </span>
              </label>
              <button
                className="aai-button"
                disabled={action.pending || phone.length !== 10}
                data-testid="login-send-otp-btn"
              >
                {action.pending ? "Sending code…" : "Send verification code"}
              </button>
            </form>
          ) : (
            <form
              className="aai-form"
              onSubmit={verify}
              data-testid="otp-verify-form"
            >
              <label>
                Verification code
                <input
                  className="aai-otp-input"
                  required
                  autoFocus
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  data-testid="login-otp-input"
                />
              </label>
              {demoOtp && (
                <p className="aai-caption">Development mode code: {demoOtp}</p>
              )}
              <button
                className="aai-button"
                disabled={action.pending || otp.length !== 6}
                data-testid="login-verify-btn"
              >
                {action.pending ? "Verifying…" : "Verify and continue"}
              </button>
              <button
                className="aai-text-button"
                type="button"
                disabled={action.pending}
                onClick={() => {
                  setStep(1);
                  setOtp("");
                }}
              >
                Use a different number
              </button>
            </form>
          )}
          <FormMessage
            error={action.error}
            pending={action.pending}
            pendingText={
              step === 1 ? "Requesting your code…" : "Verifying your code…"
            }
          />
          <Link
            className="aai-text-link"
            to="/dealer"
            data-testid="dealer-login-link"
          >
            Dealer portal →
          </Link>
        </section>
      </div>
    </div>
  );
}
