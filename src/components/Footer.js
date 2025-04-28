import { FaFacebookF, FaTwitter, FaSkype, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  const galleryImages = [
    "/event.jpg",
    "/event1.avif",
    "/event2.avif",
    "/event3.jpg",
    "/event4.avif",
    "/event5.jpg",
  ];

  return (
    <footer className="relative overflow-hidden bg-[#0D0E25] text-white pt-10">
      {/* ✨ Stars */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => {
          const top = Math.random() * 100;
          const left = Math.random() * 100;
          const delay = Math.random() * 5;
          return (
            <div
              key={i}
              className="star"
              style={{
                top: `${top}%`,
                left: `${left}%`,
                animationDelay: `${delay}s`,
              }}
            >
              ✦
            </div>
          );
        })}
      </div>

      {/* Footer content */}
      <div className="relative z-10">
        {/* Animated Logo Bar */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-4">
          <div className="animate-marquee gap-16">
            {Array(10).fill(0).map((_, i) => (
              <span key={i} className="text-white text-2xl font-bold px-8">
                Actyra
              </span>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Branding */}
          <div className="flex flex-col items-center text-center gap-4 mb-8 md:items-start md:text-left">
            <img
              src="/logo-actyra.png"
              alt="Actyra Logo"
              className="w-24 h-24 object-contain transition-transform duration-500 hover:scale-110 hover:-translate-y-1 animate-pulseGlow"
            />
            <span className="text-3xl font-extrabold tracking-wide">Actyra</span>
            <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
              Discover, create and join amazing events with Actyra – your social event universe.
            </p>
            <div className="flex gap-4 mt-4">
              <FaFacebookF className="bg-gray-700 p-2 rounded-full w-8 h-8 cursor-pointer hover:bg-pink-500 transition" />
              <FaTwitter className="bg-gray-700 p-2 rounded-full w-8 h-8 cursor-pointer hover:bg-pink-500 transition" />
              <FaSkype className="bg-gray-700 p-2 rounded-full w-8 h-8 cursor-pointer hover:bg-pink-500 transition" />
              <FaLinkedinIn className="bg-gray-700 p-2 rounded-full w-8 h-8 cursor-pointer hover:bg-pink-500 transition" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 underline underline-offset-4 text-white">QUICK LINKS :</h3>
            <ul className="space-y-2 text-gray-300">
              {[
                "Privacy & policy",
                "Terms & conditions",
                "FAQ",
                "Customer support",
                "Contact us",
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="hover:text-pink-500 transition duration-200 cursor-pointer block"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4 underline underline-offset-4 text-white">SUBSCRIP NEWSLETTER :</h3>
            <input
              type="email"
              placeholder="Enter your email:"
              className="w-full p-3 rounded bg-white text-white placeholder-black mb-4"
            />
            <button className="w-full py-3 rounded bg-gradient-to-r from-indigo-600 to-pink-500 font-bold hover:opacity-90 transition duration-200">
              SUBSCRIBE NOW
            </button>
          </div>

          {/* Gallery */}
          <div>
            <h3 className="font-semibold mb-4 underline underline-offset-4 text-white">OUR GALLERY:</h3>
            <div className="grid grid-cols-3 gap-2">
              {galleryImages.map((src, i) => (
                <a
                  key={i}
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-20 h-20 rounded-lg relative group overflow-hidden block"
                >
                  <img
                    src={src}
                    alt={`gallery-${i}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-90 flex items-center justify-center transition duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-10 10m0-10h10v10" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-4 px-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>Copyright © 2025 Actyra. All Rights Reserved</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-pink-400 cursor-pointer">Privacy & Policy</a>
            <span className="hidden md:inline">||</span>
            <a href="#" className="hover:text-pink-400 cursor-pointer">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
