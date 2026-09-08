import { useRef } from "react";

function OtpInput({ otp, setOtp, length = 6 }) {
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const updatedOtp = [...otp];

    // Single digit
    if (value.length <= 1) {
      updatedOtp[index] = value;
      setOtp(updatedOtp);

      if (value && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      return;
    }

    // Paste OTP
    const pastedDigits = value
      .replace(/\D/g, "")
      .slice(0, length - index)
      .split("");

    pastedDigits.forEach((digit, digitIndex) => {
      updatedOtp[index + digitIndex] = digit;
    });

    setOtp(updatedOtp);

    const nextIndex = Math.min(
      index + pastedDigits.length,
      length - 1
    );

    inputRefs.current[nextIndex]?.focus();
  };

  const handleKeyDown = (index, event) => {
    if (
      event.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (
      event.key === "ArrowRight" &&
      index < length - 1
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  return (
    <div className="flex justify-between gap-2 sm:gap-3">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            inputRefs.current[index] = element;
          }}
          type="text"
          inputMode="numeric"
          maxLength={length}
          value={digit}
          onChange={(event) =>
            handleChange(index, event.target.value)
          }
          onKeyDown={(event) =>
            handleKeyDown(index, event)
          }
          className="h-12 w-full min-w-0 rounded-xl border border-slate-200 bg-white/80 text-center text-xl font-bold text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 sm:h-14 sm:text-2xl"
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  );
}

export default OtpInput;