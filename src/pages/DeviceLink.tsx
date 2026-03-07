import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Wifi,
  BatteryFull,
  Link as LinkIcon,
} from "lucide-react";

const VALID_DEVICE_ID = "S1";

interface DeviceLinkProps {
  onDeviceLinked?: () => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const DeviceLink: React.FC<DeviceLinkProps> = ({ onDeviceLinked }) => {
  const [deviceId, setDeviceId] = useState("");
  const [error, setError] = useState("");

  const handleLink = () => {
    if (deviceId.trim() !== VALID_DEVICE_ID) {
      setError(`Invalid Device ID. Example: ${VALID_DEVICE_ID}`);
      return;
    }
    setError("");
    onDeviceLinked?.();
  };

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden text-white"
      style={{ fontFamily: `"Times New Roman", Georgia, serif` }}
    >
      {/* ---------- BACKGROUND IMAGE ---------- */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url("../public/images/robot.jpeg")`,
        }}
      />

      {/* ---------- DARK OVERLAY ---------- */}
      <div className="absolute inset-0 bg-black/40" />

      {/* ---------- MAIN CONTENT ---------- */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 h-screen px-10 lg:px-24 gap-16">

        {/* ---------- LEFT CONTENT ---------- */}
        <motion.div
  variants={fadeUp}
  initial="hidden"
  animate="show"
  className="text-white max-w-xl
             flex flex-col justify-center
             min-h-[80vh]"
>
  {/* Logo */}
  <div className="flex items-center gap-4 mb-8">
    <img
      src="../public/images/logo.jpeg" // your logo
      alt="SterilySense Logo"
      className="w-14 h-14 object-contain rounded-xl shadow-md"
    />
    <span className="text-3xl font-semibold tracking-wide">
      SterilySense
    </span>
  </div>

  {/* Main Heading */}
  <h1 className="text-6xl font-bold leading-tight">
    Smart Sterilization.
    {/* <span className="block text-sky-400">
      Safer Environments.
    </span> */}
  </h1>

  {/* Description */}
  <p className="mt-8 text-lg text-white/80 leading-relaxed">
    SterilySense is an autonomous vacuum and UV-C sterilization robot
    engineered for hospitals and clinical spaces to reduce microbial
    contamination with intelligent navigation and real-time monitoring.
  </p>

  {/* Features */}
  <ul className="mt-10 space-y-4 text-white/85">
    <li className="flex items-center gap-3">
      <ShieldCheck className="text-sky-400" />
      Medical-grade UV-C safety
    </li>
    <li className="flex items-center gap-3">
      <Wifi className="text-sky-400" />
      Live remote monitoring
    </li>
    <li className="flex items-center gap-3">
      <BatteryFull className="text-sky-400" />
      Extended battery operation
    </li>
  </ul>

  {/* Buttons */}
  <div className="mt-12 flex items-center gap-5">
    <a
      href="https://your-original-site.com"
      target="_blank"
      rel="noopener noreferrer"
      className="px-6 py-3 rounded-lg
                 bg-white text-black font-semibold
                 hover:bg-slate-200 transition"
    >
      Visit Official Site
    </a>

    <button
      className="px-6 py-3 rounded-lg
                 border border-white/40
                 hover:bg-white/10 transition"
    >
      Learn More
    </button>
  </div>
</motion.div>

        {/* ---------- RIGHT FORM ---------- */}
        <motion.div
  variants={fadeUp}
  initial="hidden"
  animate="show"
  className="flex items-center justify-center lg:justify-end pr-6"
>
  <div
    className="w-full max-w-md min-h-[520px]
               bg-white/12 backdrop-blur-xl
               border border-white/25 rounded-2xl
               p-10 shadow-2xl flex flex-col justify-between"
  >
    {/* Header */}
    <div>
      <h3 className="text-2xl font-semibold mb-2 text-white">
        Link Your Robot
      </h3>

      <p className="text-white/70 mb-6">
        Connect your SterilySense unit to begin sterilization and monitoring.
      </p>

      {/* Device ID */}
      <label className="block text-sm mb-2 text-white/80">
        Device ID
      </label>

      <input
        value={deviceId}
        onChange={(e) => setDeviceId(e.target.value)}
        placeholder="Enter Device ID (S1)"
        className="w-full px-4 py-3 rounded-lg
                   bg-black/40 border border-white/30
                   text-white placeholder-white/50
                   focus:outline-none focus:ring-2
                   focus:ring-sky-500"
      />

      {error && (
        <p className="text-sm text-red-400 mt-3">{error}</p>
      )}
    </div>

    {/* Actions */}
    <div>
      <button
        onClick={handleLink}
        className="mt-8 w-full py-3 rounded-lg
                   bg-sky-600 hover:bg-sky-700
                   transition font-semibold
                   flex items-center justify-center gap-2"
      >
        <LinkIcon className="w-5 h-5" />
        Connect Device
      </button>

      {/* Scan Section */}
      <div className="mt-6 border-t border-white/20 pt-5 text-center">
        <p className="text-sm text-white/70 mb-3">
          Or quickly connect using QR scan
        </p>

        <button
          className="w-full py-3 rounded-lg
                     border border-white/30
                     hover:bg-white/10 transition
                     font-medium"
        >
          Scan & Connect
        </button>
      </div>

      {/* Footer */}
      <p className="mt-6 text-sm text-sky-300 underline cursor-pointer text-center">
        Installation & Safety Guidelines
      </p>
    </div>
  </div>
</motion.div>
      </div>
    </div>
  );
};

const Feature = ({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => (
  <div className="flex gap-4">
    <div className="text-sky-400 w-7 h-7">{icon}</div>
    <div>
      <p className="font-semibold">{title}</p>
      <p className="text-sm text-white/70">{desc}</p>
    </div>
  </div>
);

export default DeviceLink;