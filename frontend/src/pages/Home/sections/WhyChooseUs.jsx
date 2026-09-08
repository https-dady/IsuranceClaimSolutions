import { motion } from "framer-motion";
import {
  FileText,
  Zap,
  Headphones,
  ShieldCheck,
  Trophy,
  Clock3,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Easy Documentation",
    description:
      "Streamlined document submission process with digital uploads and automated verification.",
  },
  {
    icon: Zap,
    title: "Quick Processing",
    description:
      "Fast-track your claims with our efficient processing system and real-time status updates.",
  },
  {
    icon: Headphones,
    title: "Expert Support",
    description:
      "Dedicated claims specialists available to guide you through every step of the process.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Compliant",
    description:
      "Industry-leading security measures to protect your sensitive information and data.",
  },
  {
    icon: Trophy,
    title: "High Success Rate",
    description:
      "Proven track record of successful claim settlements with maximum compensation.",
  },
  {
    icon: Clock3,
    title: "24/7 Assistance",
    description:
      "Round-the-clock customer support to address your queries and concerns anytime.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: "easeOut",
    },
  },
};

function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-[#f7fbff] py-24">
      {/* Soft Background Glows - Hero Design Language */}
      <div className="absolute -left-32 top-10 h-[450px] w-[450px] rounded-full bg-blue-200/30 blur-[130px]" />

      <div className="absolute -right-32 bottom-0 h-[500px] w-[500px] rounded-full bg-sky-200/40 blur-[140px]" />

      <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-100/30 blur-[120px]" />

      {/* Subtle Dot Background */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.25) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-16 text-center"
        >
          {/* Small Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-4 py-2 shadow-sm backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-blue-600" />

            <span className="text-xs font-semibold tracking-wide text-slate-700">
              WHY PEOPLE TRUST US
            </span>
          </div>

          <h2 className="mb-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Why Choose{" "}
            <span className="text-blue-600">
              Us?
            </span>
          </h2>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-600">
            We provide comprehensive insurance claim solutions designed to
            make your experience smooth and stress-free.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                whileHover={{
                  y: -6,
                  transition: {
                    duration: 0.25,
                    ease: "easeOut",
                  },
                }}
                className="group"
              >
                <div className="relative h-full overflow-hidden rounded-3xl border border-white/80 bg-white/65 p-8 shadow-lg shadow-blue-900/5 backdrop-blur-xl transition-all duration-300 hover:border-blue-200 hover:bg-white/80 hover:shadow-xl hover:shadow-blue-900/10">
                  
                  {/* Very subtle card glow */}
                  <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-300/10 blur-3xl transition-opacity duration-500 group-hover:bg-blue-300/20" />

                  {/* Icon */}
                  <div className="relative mb-7 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600 shadow-sm transition-transform duration-300 group-hover:scale-105">
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* Title */}
                  <h3 className="relative mb-3 text-xl font-bold text-slate-900">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="relative text-[15px] leading-relaxed text-slate-600">
                    {feature.description}
                  </p>

                  {/* Bottom Accent */}
                  <div className="relative mt-7 h-[3px] w-10 rounded-full bg-blue-600 transition-all duration-300 group-hover:w-16" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

export default WhyChooseUs;