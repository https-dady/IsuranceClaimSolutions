import { motion } from "framer-motion";
import {
  HeartPulse,
  Car,
  House,
  ShieldCheck,
  Scale,
  Handshake,
  ArrowRight,
  BriefcaseBusiness,
} from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: HeartPulse,
    title: "Health Insurance Claims",
    description:
      "Expert assistance with medical reimbursement, cashless denials, and critical illness claims to ensure you get the coverage you deserve.",
    image:
      "https://images.unsplash.com/photo-1607077792235-f95fb5505db8",
  },
  {
    icon: Car,
    title: "Motor Insurance Claims",
    description:
      "Comprehensive support for accident claims, theft, and third-party liability issues. We handle the paperwork so you can get back on the road.",
    image:
      "https://images.unsplash.com/photo-1656733020083-9a6501ee1677",
  },
  {
    icon: House,
    title: "Property & Home Insurance",
    description:
      "Guidance through fire, burglary, and natural calamity damage claims. We help maximize your settlement for property restoration.",
    image:
      "https://images.unsplash.com/photo-1561418360-5c7781a4fb35",
  },
  {
    icon: ShieldCheck,
    title: "Life Insurance Settlement",
    description:
      "Sensitive and professional handling of death claims and maturity benefits, ensuring beneficiaries receive their entitlements promptly.",
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7",
  },
  {
    icon: Scale,
    title: "Legal Consultation",
    description:
      "Professional legal advice on policy terms, claim rejections, and dispute resolution mechanisms including Ombudsman and Consumer Court.",
    image:
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73",
  },
  {
    icon: Handshake,
    title: "Dispute Resolution",
    description:
      "Representation and negotiation support for rejected or under-settled claims against insurance companies.",
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216",
  },
];

function Services() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#f7fbff] py-20 sm:py-24">
      
      {/* ================= BACKGROUND ================= */}

      {/* Left Blue Glow */}
      <div className="absolute -left-40 top-20 h-[550px] w-[550px] rounded-full bg-blue-200/35 blur-[150px]" />

      {/* Right Blue Glow */}
      <div className="absolute -right-40 bottom-20 h-[600px] w-[600px] rounded-full bg-sky-200/40 blur-[160px]" />

      {/* Dot Pattern */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.25) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ================= PAGE HEADING ================= */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-4 py-2 shadow-sm backdrop-blur-xl">
            
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600">
              <BriefcaseBusiness className="h-4 w-4 text-white" />
            </div>

            <span className="text-xs font-bold tracking-wide text-slate-700">
              OUR SERVICES
            </span>
          </div>

          {/* Heading */}
          <h1 className="mb-5 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Comprehensive Claim{" "}
            <span className="text-blue-600">
              Solutions
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg leading-relaxed text-slate-600 sm:text-xl">
            Expert guidance and professional assistance across every stage of
            your insurance claim journey.
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
          className="grid gap-7 md:grid-cols-2 lg:grid-cols-3"
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
                  y: -8,
                }}
                className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-white/80 bg-white/60 shadow-lg shadow-blue-900/5 backdrop-blur-xl transition-shadow duration-300 hover:shadow-2xl hover:shadow-blue-900/10"
              >

                {/* Card Glow */}
                <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-blue-200/20 blur-[70px]" />


                {/* ================= IMAGE ================= */}

                <div className="relative m-3 h-52 overflow-hidden rounded-[22px] bg-slate-100">

                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-900/20 to-transparent" />


                  {/* Service Icon */}

                  <div className="absolute bottom-4 left-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-blue-600 text-white shadow-xl backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-7 w-7" />
                  </div>

                </div>


                {/* ================= CONTENT ================= */}

                <div className="relative flex flex-grow flex-col px-7 pb-7 pt-3">

                  <h2 className="text-xl font-bold tracking-tight text-slate-900">
                    {service.title}
                  </h2>

                  {/* Accent Line */}

                  <div className="my-4 h-px w-12 bg-blue-200 transition-all duration-300 group-hover:w-20" />


                  <p className="flex-grow leading-relaxed text-slate-600">
                    {service.description}
                  </p>


                  {/* Button */}

                  <Link
                    to="/claims"
                    className="mt-7 inline-flex w-fit items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-2.5 font-semibold text-blue-600 transition-all duration-300 hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-500/20"
                  >
                    Get Assistance

                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>

                </div>


                {/* Bottom Accent */}

                <div className="absolute bottom-0 left-1/2 h-1 w-0 -translate-x-1/2 rounded-full bg-blue-600 transition-all duration-500 group-hover:w-20" />

              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}

export default Services;