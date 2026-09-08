import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Headphones,
} from "lucide-react";

const stats = [
  {
    value: "10K+",
    label: "Claims Resolved",
    icon: FileText,
  },
  {
    value: "98%",
    label: "Success Rate",
    icon: CheckCircle2,
  },
  {
    value: "24/7",
    label: "Expert Support",
    icon: Headphones,
  },
];

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

function Hero() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-[#f7fbff]">
      {/* =====================================================
          REFERENCE STYLE BACKGROUND
      ===================================================== */}

      {/* Main soft blue glow */}
      <div className="absolute -left-40 top-10 h-[520px] w-[520px] rounded-full bg-blue-300/30 blur-[130px]" />

      <div className="absolute right-[-120px] top-[-100px] h-[550px] w-[550px] rounded-full bg-sky-200/50 blur-[140px]" />

      <div className="absolute bottom-[-200px] left-1/3 h-[420px] w-[420px] rounded-full bg-indigo-100/60 blur-[130px]" />

      {/* subtle background grid */}
      <div
        className="absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.25) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid min-h-[75vh] items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          
          {/* =====================================================
              LEFT CONTENT
          ===================================================== */}

          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}

            <motion.div variants={fadeUp}>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-4 py-2 shadow-sm backdrop-blur-xl">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600">
                  <ShieldCheck className="h-4 w-4 text-white" />
                </div>

                <span className="text-xs font-semibold tracking-wide text-slate-700">
                  TRUSTED CLAIMS PARTNER
                </span>
              </div>
            </motion.div>

            {/* Heading */}

            <motion.h1
              variants={fadeUp}
              className="mb-7 text-5xl font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl"
            >
              Simplify Your
              <br />

              <span className="text-blue-600">
                Insurance Claims
              </span>

              <br />

              Process
            </motion.h1>

            {/* Description */}

            <motion.p
              variants={fadeUp}
              className="mb-9 max-w-xl text-lg leading-relaxed text-slate-600 sm:text-xl"
            >
              Expert legal assistance for hassle-free claim settlements.
              We fight for your rights with fast processing, transparent
              communication, and dedicated support every step of the way.
            </motion.p>

            {/* Buttons */}

            <motion.div
              variants={fadeUp}
              className="mb-12 flex flex-col gap-4 sm:flex-row"
            >
              <Link
                to="/claims"
                className="group inline-flex h-14 items-center justify-center rounded-xl bg-blue-600 px-8 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-xl"
              >
                File a Claim

                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                to="/services"
                className="inline-flex h-14 items-center justify-center rounded-xl border border-slate-200 bg-white/70 px-8 text-base font-semibold text-slate-700 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-lg"
              >
                Explore Services
              </Link>
            </motion.div>

            {/* Stats */}

            <motion.div
              variants={fadeUp}
              className="grid max-w-xl grid-cols-3 gap-3"
            >
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/80 bg-white/60 p-4 shadow-lg shadow-blue-900/5 backdrop-blur-xl"
                  >
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="text-xl font-bold text-slate-900">
                      {stat.value}
                    </div>

                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* =====================================================
              RIGHT VISUAL AREA
          ===================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: 50,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.9,
              ease: "easeOut",
              delay: 0.2,
            }}
            className="relative hidden min-h-[600px] lg:block"
          >
            {/* Large Glass Image Card */}

            <div className="absolute inset-y-10 right-0 left-10 overflow-hidden rounded-[32px] border border-white/80 bg-white/40 p-3 shadow-2xl shadow-blue-900/10 backdrop-blur-xl">
              <div className="relative h-full overflow-hidden rounded-[25px]">
                <img
                  src="https://images.unsplash.com/photo-1686771416282-3888ddaf249b"
                  alt="Insurance claim professional helping client"
                  className="h-full w-full object-cover"
                />

                {/* image overlay */}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/35 via-transparent to-transparent" />
              </div>
            </div>

            {/* Floating Top Card */}

            {/* <motion.div
  animate={{
    y: [0, -6, 0],
  }}
  transition={{
    duration: 6,
    repeat: Infinity,
    repeatType: "mirror",
    ease: "easeInOut",
  }}
  className="absolute -right-4 top--3 z-20 w-56 -translate-y-1/2 rounded-2xl border border-white/80 bg-white/85 p-5 shadow-xl shadow-blue-900/10 backdrop-blur-2xl will-change-transform"
>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600">
                  <ShieldCheck className="h-5 w-5 text-white" />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Secure Claims
                  </p>

                  <p className="text-xs text-slate-500">
                    Your data is protected
                  </p>
                </div>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-blue-100">
                <div className="h-full w-[85%] rounded-full bg-blue-600" />
              </div>
            </motion.div> */}

            {/* Floating Bottom Card */}

            <motion.div
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute bottom-4 left-0 w-64 rounded-2xl border border-white/80 bg-white/75 p-5 shadow-xl shadow-blue-900/10 backdrop-blur-2xl"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Claim Processing
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Fast • Secure • Transparent
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;