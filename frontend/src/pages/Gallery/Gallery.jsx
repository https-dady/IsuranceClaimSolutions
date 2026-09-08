import { motion } from "framer-motion";
import { Users, ArrowUpRight } from "lucide-react";

const galleryMembers = [
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
  {
    name: "Chetan Gawhade",
    role: "Social Media Coordinator",
    image:
      "https://horizons-cdn.hostinger.com/8d54c3b0-4875-49a6-9539-c0b315c4378f/5bc97f2b6456aebd8698493b0ebe87a2.jpg",
  },
  {
    name: "Namami Chouhan",
    role: "Legal Advisor",
    image:
      "https://horizons-cdn.hostinger.com/8d54c3b0-4875-49a6-9539-c0b315c4378f/ca7b0fcb656cec0f37a889668f24a228.jpg",
  },
];

function Gallery() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#f7fbff] py-20 sm:py-24">
      
      {/* ================= BACKGROUND ================= */}

      {/* Soft Blue Glow */}
      <div className="absolute -left-40 top-20 h-[550px] w-[550px] rounded-full bg-blue-200/35 blur-[150px]" />

      {/* Right Glow */}
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
              <Users className="h-4 w-4 text-white" />
            </div>

            <span className="text-xs font-bold tracking-wide text-slate-700">
              OUR TEAM
            </span>
          </div>


          {/* Heading */}

          <h1 className="mb-5 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Team{" "}
            <span className="text-blue-600">
              Gallery
            </span>
          </h1>


          {/* Description */}

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
            Meet the dedicated professionals behind our success and discover
            the people committed to helping you through every step.
          </p>


          {/* Accent */}

          <div className="mx-auto mt-7 h-1.5 w-20 rounded-full bg-blue-600" />

        </motion.div>


        {/* ================= GALLERY GRID ================= */}

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

          {galleryMembers.map((member) => (

            <motion.div
              key={member.name}
              
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

              className="group relative overflow-hidden rounded-[28px] border border-white/80 bg-white/60 shadow-lg shadow-blue-900/5 backdrop-blur-xl transition-shadow duration-300 hover:shadow-2xl hover:shadow-blue-900/10"
            >

              {/* Card Glow */}

              <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-blue-200/20 blur-[70px]" />


              {/* ================= IMAGE ================= */}

              <div className="relative m-3 aspect-[4/5] overflow-hidden rounded-[22px] bg-slate-100">

                <img
                  src={member.image}
                  alt={member.name}
                  className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Image Overlay */}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-900/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />


                {/* Hover Icon */}

                <div className="absolute right-4 top-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white opacity-0 backdrop-blur-md transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <ArrowUpRight className="h-5 w-5" />
                </div>

              </div>


              {/* ================= MEMBER DETAILS ================= */}

              <div className="relative px-7 pb-7 pt-3 text-center">

                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  {member.name}
                </h2>

                <div className="mx-auto my-3 h-px w-12 bg-blue-200 transition-all duration-300 group-hover:w-20" />

                <p className="font-medium text-blue-600">
                  {member.role}
                </p>

              </div>


              {/* Bottom Hover Accent */}

              <div className="absolute bottom-0 left-1/2 h-1 w-0 -translate-x-1/2 rounded-full bg-blue-600 transition-all duration-500 group-hover:w-20" />

            </motion.div>

          ))}

        </motion.div>

      </div>
    </section>
  );
}

export default Gallery;