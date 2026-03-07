import React, { useState } from "react";

interface LoginProps {
  onLogin?: () => void;   // 👈 make optional
}


const Login = ({ onLogin }: LoginProps) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const DEFAULT_USERNAME = "123";
  const DEFAULT_PASSWORD = "123";

  const handleLogin = () => {
    if (!isRegister) {
      if (email === DEFAULT_USERNAME && password === DEFAULT_PASSWORD) {
        onLogin(); // <-- NOW GOES TO DEVICE LINK PAGE
      } else {
        alert("Invalid username or password!");
      }
    } else {
      alert(`Registered as ${username} (${email})! You can now login.`);
      setIsRegister(false);
      setUsername("");
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Video */}
     <video
  autoPlay
  loop
  muted
  playsInline
  preload="auto"
  className="absolute top-0 left-0 w-full h-full object-cover z-0"
>
  <source src="/videos/ai-vaccum-bg.mp4" type="video/mp4" />
</video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60 z-10" />

      {/* Login/Register Box */}
      <div className="relative z-20 flex items-center justify-center h-full">
        <div className="bg-gray-900 bg-opacity-80 p-10 rounded-3xl shadow-2xl w-full max-w-md backdrop-blur-lg border border-gray-700">
          <h1 className="text-4xl font-bold mb-4 text-center text-blue-400">
            SterilySense
          </h1>

          <p className="text-center text-gray-300 mb-6">
            {isRegister ? "Create your account" : "Login to your account"}
          </p>

          {isRegister && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 mb-4 rounded-lg 
bg-gray-800 
border border-gray-700 
text-white 
placeholder-gray-400 
focus:ring-2 focus:ring-blue-400 
focus:outline-none"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 rounded-lg 
bg-gray-800 
border border-gray-700 
text-white 
placeholder-gray-400 
focus:ring-2 focus:ring-blue-400 
focus:outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-6 rounded-lg 
bg-gray-800 
border border-gray-700 
text-white 
placeholder-gray-400 
focus:ring-2 focus:ring-blue-400 
focus:outline-none"
          />

          <button
            onClick={handleLogin}
            className="w-full py-3 mb-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold shadow-lg transition-all duration-300"
          >
            {isRegister ? "Register" : "Login"}
          </button>

          <p
            className="text-center text-gray-400 cursor-pointer hover:text-blue-400 transition"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
