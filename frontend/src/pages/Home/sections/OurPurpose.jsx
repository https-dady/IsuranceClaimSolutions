import { motion } from "framer-motion";
import { Quote, ShieldCheck } from "lucide-react";

function OurPurpose() {
  return (
    <section className="relative overflow-hidden bg-[#f7fbff] py-24">
      {/* Soft Background Glows */}
      <div className="absolute -left-32 top-0 h-[450px] w-[450px] rounded-full bg-blue-200/30 blur-[130px]" />

      <div className="absolute -right-32 bottom-0 h-[450px] w-[450px] rounded-full bg-sky-200/40 blur-[140px]" />

      {/* Subtle Dot Background */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.25) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          className="relative overflow-hidden rounded-[32px] border border-white/80 bg-white/65 px-6 py-14 text-center shadow-xl shadow-blue-900/5 backdrop-blur-xl sm:px-12 lg:px-20"
        >
          {/* Card Glow */}
          <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-blue-300/15 blur-[100px]" />

          <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-sky-300/15 blur-[100px]" />

          {/* Top Icon */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.5,
              delay: 0.2,
            }}
            className="relative mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600 shadow-sm"
          >
            <ShieldCheck className="h-8 w-8" />
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.5,
              delay: 0.25,
            }}
            className="relative mb-7 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-4 py-2 shadow-sm backdrop-blur-xl"
          >
            <span className="h-2 w-2 rounded-full bg-blue-600" />

            <span className="text-xs font-semibold tracking-wide text-slate-700">
              OUR PURPOSE
            </span>
          </motion.div>

          {/* Quote */}
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.7,
              delay: 0.35,
            }}
            className="relative"
          >
            {/* Quote Icon */}
            <Quote className="absolute -left-2 -top-4 h-10 w-10 text-blue-100 sm:left-4" />

            <p className="relative mx-auto max-w-4xl text-xl leading-relaxed text-slate-700 sm:text-2xl lg:text-3xl">
              At Insurance Claim Solutions, we specialize in assisting
              individuals and businesses with disputed, rejected or delayed
              insurance claims through a strong legal process. Our mission is
              simple – to provide reliable, professional, and result-oriented
              services to society with the help of our devoted and experienced
              experts.
            </p>
          </motion.div>

          {/* Bottom Accent */}
          <motion.div
            initial={{
              opacity: 0,
              width: 0,
            }}
            whileInView={{
              opacity: 1,
              width: 96,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.6,
              delay: 0.6,
            }}
            className="relative mx-auto mt-10 h-1 rounded-full bg-blue-600"
          />
        </motion.div>
      </div>
    </section>
  );
}

export default OurPurpose;