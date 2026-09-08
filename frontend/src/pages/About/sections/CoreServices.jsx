import { motion } from "framer-motion";
import {
  HeartPulse,
  Car,
  Shield,
  House,
  Scale,
  SearchCheck,
} from "lucide-react";

const services = [
  {
    icon: HeartPulse,
    title: "Health Insurance",
    description: "Reimbursement & Cashless Claims",
  },
  {
    icon: Car,
    title: "Motor Insurance",
    description: "Accident, Theft & Third Party",
  },
  {
    icon: Shield,
    title: "Life Insurance",
    description: "Death Claims & Maturity Benefits",
  },
  {
    icon: House,
    title: "Property Insurance",
    description: "Fire, Burglary & Natural Calamity",
  },
  {
    icon: Scale,
    title: "Legal Consultancy",
    description: "Ombudsman & Consumer Court",
  },
  {
    icon: SearchCheck,
    title: "Claim Review",
    description: "Rejected Claim Analysis",
  },
];

function CoreServices() {
  return (
    <section className="relative overflow-hidden bg-[#f7fbff] py-20 sm:py-24">

      {/* ================= BACKGROUND ================= */}

      {/* Left Glow */}
      <div className="absolute -left-40 top-20 h-[450px] w-[450px] rounded-full bg-blue-200/30 blur-[140px]" />

      {/* Right Glow */}
      <div className="absolute -right-40 bottom-10 h-[500px] w-[500px] rounded-full bg-sky-200/35 blur-[150px]" />

      {/* Dot Pattern */}
      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.22) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ================= HEADING ================= */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
          className="mb-16 text-center"
        >

          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-4 py-2 shadow-sm backdrop-blur-xl">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600">
              <Shield className="h-4 w-4 text-white" />
            </div>

            <span className="text-xs font-bold tracking-wide text-slate-700">
              OUR EXPERTISE
            </span>
          </div>

          <h2 className="mb-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Our Core{" "}
            <span className="text-blue-600">
              Services
            </span>
          </h2>

          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Comprehensive support across all insurance domains.
          </p>

          {/* Accent */}
          <div className="mx-auto mt-7 h-1.5 w-20 rounded-full bg-blue-600" />

        </motion.div>


        {/* ================= SERVICES GRID ================= */}

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.1,
          }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.12,
              },
            },
          }}
          className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3"
        >

          {services.map((service) => {
            const Icon = service.icon;

            return (
              <motion.div
                key={service.title}

                variants={{
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
                }}

                whileHover={{
                  y: -7,
                }}

                className="group relative overflow-hidden rounded-[26px] border border-white/80 bg-white/60 p-8 shadow-lg shadow-blue-900/5 backdrop-blur-xl transition-shadow duration-300 hover:shadow-xl hover:shadow-blue-900/10"
              >

                {/* Card Glow */}
                <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-blue-200/20 blur-[60px]" />


                {/* Icon */}

                <div className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
                  <Icon className="h-7 w-7" />
                </div>


                {/* Title */}

                <h3 className="relative text-xl font-bold tracking-tight text-slate-900">
                  {service.title}
                </h3>


                {/* Accent */}

                <div className="relative my-4 h-px w-12 bg-blue-200 transition-all duration-300 group-hover:w-20" />


                {/* Description */}

                <p className="relative leading-relaxed text-slate-600">
                  {service.description}
                </p>


                {/* Bottom Hover Accent */}

                <div className="absolute bottom-0 left-1/2 h-1 w-0 -translate-x-1/2 rounded-full bg-blue-600 transition-all duration-500 group-hover:w-20" />

              </motion.div>
            );
          })}

        </motion.div>

      </div>
    </section>
  );
}

export default CoreServices;