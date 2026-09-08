import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Target,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

import CoreServices from "./sections/CoreServices";
import Team from "./sections/Team";

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

function About() {
  return (
    <>
      {/* =====================================================
          ABOUT HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#f7fbff] py-24 sm:py-28">
        {/* Soft Background Glows */}
        <div className="absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-blue-200/40 blur-[140px]" />

        <div className="absolute -right-32 -top-20 h-[550px] w-[550px] rounded-full bg-sky-200/40 blur-[150px]" />

        {/* Dot Background */}
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.25) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
            className="mx-auto max-w-4xl text-center"
          >
            {/* Badge */}

            <motion.div variants={fadeUp}>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-4 py-2 shadow-sm backdrop-blur-xl">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600">
                  <ShieldCheck className="h-4 w-4 text-white" />
                </div>

                <span className="text-xs font-semibold tracking-wide text-slate-700">
                  WHO WE ARE
                </span>
              </div>
            </motion.div>

            {/* Heading */}

            <motion.h1
              variants={fadeUp}
              className="mb-7 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
            >
              About{" "}
              <span className="text-blue-600">
                Insurance Claim Solution
              </span>
            </motion.h1>

            {/* Description */}

            <motion.p
              variants={fadeUp}
              className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-600 sm:text-xl"
            >
              Your trusted legal consultants for seamless insurance claim
              settlements. We fight for your rights to ensure you get what you
              deserve.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          OUR MISSION
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#f7fbff] py-24">
        {/* Background Glow */}

        <div className="absolute -left-40 bottom-0 h-[500px] w-[500px] rounded-full bg-blue-200/25 blur-[140px]" />

        <div className="absolute -right-32 top-20 h-[450px] w-[450px] rounded-full bg-sky-200/30 blur-[140px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            
            {/* ================= LEFT CONTENT ================= */}

            <motion.div
              initial={{
                opacity: 0,
                x: -40,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.75,
                ease: "easeOut",
              }}
              className="relative"
            >
              {/* Glass Content Panel */}

              <div className="relative overflow-hidden rounded-[32px] border border-white/80 bg-white/65 p-8 shadow-xl shadow-blue-900/5 backdrop-blur-xl sm:p-12">
                
                {/* Soft Glow Inside */}

                <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-blue-300/15 blur-[100px]" />

                {/* Mission Badge */}

                <div className="relative mb-7 inline-flex items-center gap-3 rounded-full border border-blue-200 bg-white/70 px-4 py-2 shadow-sm backdrop-blur-xl">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Target className="h-5 w-5" />
                  </div>

                  <span className="text-xs font-bold tracking-wide text-slate-700">
                    OUR MISSION
                  </span>
                </div>

                {/* Heading */}

                <h2 className="relative mb-6 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
                  Bridging the Gap Between{" "}
                  <span className="text-blue-600">
                    Policyholders & Insurers
                  </span>
                </h2>

                {/* Description */}

                <p className="relative mb-5 text-lg leading-relaxed text-slate-600">
                  Our mission is to empower policyholders with expert legal
                  guidance and claim assistance. We strive to simplify the
                  complex insurance landscape, ensuring that no legitimate claim
                  is unjustly rejected or under-settled.
                </p>

                <p className="relative mb-8 text-lg leading-relaxed text-slate-600">
                  We are dedicated to providing transparent, efficient, and
                  result-oriented solutions, acting as your unwavering advocates
                  in times of need.
                </p>

                {/* CTA */}

                <Link
                  to="/claims"
                  className="relative group inline-flex h-14 items-center justify-center rounded-xl bg-blue-600 px-8 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-xl"
                >
                  Start Your Claim

                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>

            {/* ================= RIGHT IMAGE ================= */}

            <motion.div
              initial={{
                opacity: 0,
                x: 40,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.75,
                ease: "easeOut",
                delay: 0.1,
              }}
              className="relative min-h-[500px]"
            >
              {/* Glass Image Frame */}

              <div className="absolute inset-0 rounded-[32px] border border-white/80 bg-white/55 p-3 shadow-2xl shadow-blue-900/10 backdrop-blur-xl">
                <div className="relative h-full overflow-hidden rounded-[25px]">
                  <img
                    src="https://images.unsplash.com/photo-1636110642723-c996f04765b3"
                    alt="Approved insurance claim document"
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent" />
                </div>
              </div>

              {/* Success Rate Glass Card */}

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
                  duration: 0.6,
                  delay: 0.4,
                }}
                className="absolute -bottom-5 -left-4 z-20 rounded-2xl border border-white/80 bg-white/85 p-6 shadow-xl shadow-blue-900/10 backdrop-blur-2xl sm:-left-6"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>

                  <div>
                    <p className="text-3xl font-bold text-slate-900">
                      98%
                    </p>

                    <p className="text-sm text-slate-500">
                      Success Rate
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Existing Components */}
      <CoreServices />
      <Team />
    </>
  );
}

export default About;