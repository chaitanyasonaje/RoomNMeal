import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import BackgroundEffects from "./BackgroundEffects";

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="relative">
        {/* Background Effects */}
        <BackgroundEffects />

        <div className="relative z-10">
          {/* Main Footer Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Company Info */}
              <motion.div variants={itemVariants}>
                <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  RoomNMeal
                </h3>
                <p className="text-gray-400 mb-6">
                  Making student life easier with comfortable accommodations and
                  delicious meals.
                </p>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="p-2 rounded-full bg-gray-800 hover:bg-emerald-500 transition-colors"
                  >
                    <Facebook size={20} />
                  </a>
                  <a
                    href="#"
                    className="p-2 rounded-full bg-gray-800 hover:bg-emerald-500 transition-colors"
                  >
                    <Twitter size={20} />
                  </a>
                  <a
                    href="#"
                    className="p-2 rounded-full bg-gray-800 hover:bg-emerald-500 transition-colors"
                  >
                    <Instagram size={20} />
                  </a>
                  <a
                    href="#"
                    className="p-2 rounded-full bg-gray-800 hover:bg-emerald-500 transition-colors"
                  >
                    <Linkedin size={20} />
                  </a>
                </div>
              </motion.div>

              {/* Quick Links */}
              <motion.div variants={itemVariants}>
                <h4 className="text-lg font-semibold mb-6 text-emerald-400">
                  Quick Links
                </h4>
                <ul className="space-y-4">
                  <li>
                    <Link
                      to="/"
                      className="text-gray-400 hover:text-emerald-400 transition-colors"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about"
                      className="text-gray-400 hover:text-emerald-400 transition-colors"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/rooms"
                      className="text-gray-400 hover:text-emerald-400 transition-colors"
                    >
                      Rooms
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/mess"
                      className="text-gray-400 hover:text-emerald-400 transition-colors"
                    >
                      Mess Services
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      className="text-gray-400 hover:text-emerald-400 transition-colors"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </motion.div>

              {/* Services */}
              <motion.div variants={itemVariants}>
                <h4 className="text-lg font-semibold mb-6 text-emerald-400">
                  Services
                </h4>
                <ul className="space-y-4">
                  <li className="text-gray-400 hover:text-emerald-400 transition-colors">
                    Room Booking
                  </li>
                  <li className="text-gray-400 hover:text-emerald-400 transition-colors">
                    Meal Plans
                  </li>
                  <li className="text-gray-400 hover:text-emerald-400 transition-colors">
                    Laundry Service
                  </li>
                  <li className="text-gray-400 hover:text-emerald-400 transition-colors">
                    Study Support
                  </li>
                  <li className="text-gray-400 hover:text-emerald-400 transition-colors">
                    Student Community
                  </li>
                </ul>
              </motion.div>

              {/* Contact Us */}
              <motion.div variants={itemVariants}>
                <h4 className="text-lg font-semibold mb-6 text-emerald-400">
                  Contact Us
                </h4>
                <ul className="space-y-4">
                  <li className="flex items-center text-gray-400 hover:text-emerald-400 transition-colors">
                    <Mail size={18} className="mr-2" /> support@roomnmeal.com
                  </li>
                  <li className="flex items-center text-gray-400 hover:text-emerald-400 transition-colors">
                    <Phone size={18} className="mr-2" /> +91 98765 43210
                  </li>
                  <li className="flex items-center text-gray-400 hover:text-emerald-400 transition-colors">
                    <MapPin size={18} className="mr-2" /> Shirpur, Maharashtra
                  </li>
                </ul>
              </motion.div>
            </div>
          </motion.div>

          {/* Bottom Footer Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="border-t border-gray-700/50 py-8"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-400 text-sm">
                  © {new Date().getFullYear()} RoomNMeal. All rights reserved.
                </p>
                <div className="flex space-x-6">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-emerald-400 text-sm transition-colors"
                  >
                    Privacy Policy
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-emerald-400 text-sm transition-colors"
                  >
                    Terms of Service
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-emerald-400 text-sm transition-colors"
                  >
                    Cookie Policy
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
