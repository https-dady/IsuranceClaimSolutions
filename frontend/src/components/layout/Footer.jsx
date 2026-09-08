import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ShieldCheck } from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const quickLinks = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "About Us", path: "/about" },
  { name: "Claims", path: "/claims" },
  { name: "Gallery", path: "/gallery" },
  { name: "Feedback", path: "/feedback" },
];

const services = [
  "Health Insurance Claims",
  "Motor Insurance Claims",
  "Property Insurance Claims",
  "Life Insurance Claims",
];

const footerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 25,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-slate-950 text-slate-300">
      
      {/* Background Blue Glow */}
      <div className="absolute -left-32 top-0 h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-[130px]" />

      <div className="absolute -right-32 bottom-0 h-[450px] w-[450px] rounded-full bg-blue-500/10 blur-[140px]" />

      {/* Subtle Grid */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.7) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        
        {/* Top Content */}
        <motion.div
          variants={footerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          
          {/* Company */}
          <motion.div variants={itemVariants}>
            
            {/* Brand Icon */}
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-400">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <h2 className="mb-4 text-xl font-bold text-white">
              Insurance Claim Solution
            </h2>

            <p className="max-w-xs text-sm leading-6 text-slate-400">
              Professional insurance claim assistance and legal consulting
              services to help you through the claim process.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="mb-5 text-lg font-semibold text-white">
              Quick Links
            </h3>

            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="group inline-flex items-center gap-2 text-sm text-slate-400 transition-colors duration-300 hover:text-blue-400"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-600 transition-all duration-300 group-hover:w-4 group-hover:bg-blue-400" />

                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div variants={itemVariants}>
            <h3 className="mb-5 text-lg font-semibold text-white">
              Our Services
            </h3>

            <ul className="space-y-3">
              {services.map((service) => (
                <li
                  key={service}
                  className="flex items-start gap-2 text-sm leading-relaxed text-slate-400"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />

                  {service}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants}>
            <h3 className="mb-5 text-lg font-semibold text-white">
              Contact Us
            </h3>

            <ul className="space-y-4 text-sm">
              
              <li className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-500/10">
                  <Phone className="h-4 w-4 text-blue-400" />
                </div>

                <span className="pt-2 text-slate-400">
                  Contact details coming soon
                </span>
              </li>

              <li className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-500/10">
                  <Mail className="h-4 w-4 text-blue-400" />
                </div>

                <span className="pt-2 text-slate-400">
                  Email details coming soon
                </span>
              </li>

              <li className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-500/10">
                  <MapPin className="h-4 w-4 text-blue-400" />
                </div>

                <span className="pt-2 text-slate-400">
                  India
                </span>
              </li>

            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom Divider */}
        <div className="my-10 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

        {/* Bottom Section */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
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
            delay: 0.2,
          }}
          className="flex flex-col items-center justify-between gap-6 md:flex-row"
        >
          
          <p className="text-center text-sm text-slate-500 md:text-left">
            © {new Date().getFullYear()} Insurance Claim Solution. All rights
            reserved.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            
            <a
              href="#"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-white/5 text-slate-400 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-400"
            >
              <FaFacebookF className="h-4 w-4" />
            </a>

            <a
              href="#"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-white/5 text-slate-400 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-400"
            >
              <FaInstagram className="h-4 w-4" />
            </a>

            <a
              href="#"
              aria-label="LinkedIn"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-white/5 text-slate-400 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-400"
            >
              <FaLinkedinIn className="h-4 w-4" />
            </a>

          </div>
        </motion.div>
      </div>
    </footer>
  );
}

export default Footer;