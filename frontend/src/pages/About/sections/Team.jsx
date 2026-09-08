import { motion } from "framer-motion";
import { Users } from "lucide-react";

const teamMembers = [
  {
    name: "Mr. Parshottam Sarathe",
    role: "Founder & CEO",
    image:
      "https://horizons-cdn.hostinger.com/8d54c3b0-4875-49a6-9539-c0b315c4378f/6d779c5143f14f80ca3493adbb6f2d96.png",
  },
  {
    name: "Deepak Kumar",
    role: "Medical Advisor",
    image:
      "https://horizons-cdn.hostinger.com/8d54c3b0-4875-49a6-9539-c0b315c4378f/26c13c601313df5a48388ac5d620cef3.png",
  },
  {
    name: "Akash Mathuriya",
    role: "Social Media Head",
    image:
      "https://horizons-cdn.hostinger.com/8d54c3b0-4875-49a6-9539-c0b315c4378f/0a7bd0f6e3cf1650b79cc8708f3c0cd5.jpg",
  },
  {
    name: "Deepti Mathuriya",
    role: "Legal Advisor",
    image:
      "https://horizons-cdn.hostinger.com/8d54c3b0-4875-49a6-9539-c0b315c4378f/0932ae1dde6e2c41de3f7a24def015d5.jpg",
  },
  {
    name: "Swati Sarathe",
    role: "Finance Manager",
    image:
      "https://horizons-cdn.hostinger.com/8d54c3b0-4875-49a6-9539-c0b315c4378f/1728aca15362238aff0283bcad4a22ce.png",
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

function Team() {
  return (
    <section className="relative overflow-hidden bg-[#f7fbff] py-20 sm:py-24">
      
      {/* Background Glow */}
      <div className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-blue-200/30 blur-[150px]" />

      <div className="absolute -right-40 bottom-10 h-[550px] w-[550px] rounded-full bg-sky-200/35 blur-[160px]" />

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
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
          className="mb-16 text-center"
        >
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-4 py-2 shadow-sm backdrop-blur-xl">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600">
              <Users className="h-4 w-4 text-white" />
            </div>

            <span className="text-xs font-bold tracking-wide text-slate-700">
              OUR EXPERTS
            </span>
          </div>

          <h2 className="mb-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Meet Our Dedicated{" "}
            <span className="text-blue-600">
              Team
            </span>
          </h2>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-600">
            Driven by passion and expertise, our team works tirelessly to
            ensure your claims are settled fairly.
          </p>

          <div className="mx-auto mt-7 h-1.5 w-20 rounded-full bg-blue-600" />
        </motion.div>


        {/* ================= TEAM GRID ================= */}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.1,
          }}
          className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
        >
          {teamMembers.map((member) => (
            <motion.div
              key={member.name}
              variants={cardVariants}
              whileHover={{
                y: -8,
              }}
              className="group"
            >
              
              {/* ================= GLASS CARD ================= */}

              <div className="relative overflow-hidden rounded-[26px] border border-white/80 bg-white/60 p-3 shadow-lg shadow-blue-900/5 backdrop-blur-xl transition-shadow duration-300 hover:shadow-xl hover:shadow-blue-900/10">

                {/* Card Glow */}
                <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-blue-200/30 blur-[50px]" />


                {/* ================= IMAGE ================= */}

                <div className="relative h-72 overflow-hidden rounded-[20px] bg-slate-100 sm:h-80">

                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                </div>


                {/* ================= MEMBER INFO ================= */}

                <div className="relative px-3 pb-5 pt-5 text-center">

                  <h3 className="text-lg font-bold tracking-tight text-slate-900 transition-colors duration-300 group-hover:text-blue-600">
                    {member.name}
                  </h3>

                  <div className="mx-auto my-3 h-px w-10 bg-blue-200 transition-all duration-300 group-hover:w-16" />

                  <p className="text-sm font-medium text-slate-500">
                    {member.role}
                  </p>

                </div>


                {/* Bottom Accent */}

                <div className="absolute bottom-0 left-1/2 h-1 w-0 -translate-x-1/2 rounded-full bg-blue-600 transition-all duration-500 group-hover:w-16" />

              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

export default Team;