import { motion } from "framer-motion";
import {
  FileText,
  Upload,
  SearchCheck,
  BadgeCheck,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: FileText,
    title: "Submit Your Claim",
    description:
      "Fill out our simple online form with your claim details and policy information.",
  },
  {
    number: "02",
    icon: Upload,
    title: "Upload Documents",
    description:
      "Securely upload all required documents and supporting evidence for your claim.",
  },
  {
    number: "03",
    icon: SearchCheck,
    title: "Review & Processing",
    description:
      "Our expert team reviews your claim and coordinates with insurance providers.",
  },
  {
    number: "04",
    icon: BadgeCheck,
    title: "Get Settled",
    description:
      "Receive your settlement quickly with full transparency throughout the process.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.16,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 45,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: "easeOut",
    },
  },
};

function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-100 via-blue-50 to-slate-100 py-24">
      
      {/* Background Decorative Blurs */}
      <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-blue-400/15 blur-3xl" />

      <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-indigo-400/10 blur-3xl" />

      {/* Decorative Lines */}
      <div className="absolute -left-32 top-10 h-80 w-80 rounded-full border border-blue-300/30" />

      <div className="absolute right-0 top-0 h-96 w-96 rounded-full border border-blue-200/30" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-16 text-center"
        >
          {/* Top Badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/50 px-4 py-2 text-xs font-bold tracking-wide text-blue-700 shadow-sm backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            SIMPLE & TRANSPARENT PROCESS
          </div>

          <h2 className="mb-4 text-4xl font-bold text-slate-900 sm:text-5xl">
            How It Works
          </h2>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-600">
            Our streamlined process makes filing and managing your insurance
            claims simple and efficient.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
                variants={cardVariants}
                whileHover={{
                  y: -10,
                  transition: { duration: 0.25 },
                }}
                className="relative"
              >
                {/* Desktop Connector */}
                {index < steps.length - 1 && (
                  <div className="absolute left-[calc(100%+0px)] top-1/2 z-0 hidden w-6 -translate-y-1/2 lg:block">
                    <div className="border-t-2 border-dashed border-blue-400/70" />

                    <div className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full border-2 border-blue-500 bg-slate-100" />
                  </div>
                )}

                {/* Card */}
                <div className="group relative z-10 h-full overflow-hidden rounded-3xl border border-white/80 bg-white/55 p-7 shadow-lg shadow-blue-900/5 backdrop-blur-xl transition-all duration-300 hover:border-blue-200 hover:bg-white/70 hover:shadow-xl hover:shadow-blue-900/10">
                  
                  {/* Soft Glow */}
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-400/10 blur-3xl transition-all duration-500 group-hover:bg-blue-400/20" />

                  {/* Number */}
                  <div className="relative mb-6 text-2xl font-bold tracking-wide text-slate-400">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-200/70 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20">
                    <Icon className="h-7 w-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="relative mb-3 text-xl font-bold text-slate-900">
                    {step.title}
                  </h3>

                  <p className="relative text-sm leading-relaxed text-slate-600">
                    {step.description}
                  </p>

                  {/* Bottom Accent */}
                  <div className="relative mt-7 h-1 w-16 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-purple-500 transition-all duration-300 group-hover:w-24" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

export default HowItWorks;