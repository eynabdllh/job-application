"use client";

import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faYoutube, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
  return (
    <footer className="bg-paper text-castleton-green pt-10 mt-20" style={{ backgroundColor: '#f5eedb', color: '#046241' }}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <Link href="/">
              <Image
                src="/lifewood_logo2.png"
                alt="Lifewood Logo"
                width={150}
                height={50}
                className="mb-4"
              />
            </Link>
            <p className="text-castleton-green/80 leading-relaxed mb-4 hover:text-castleton-green transition-colors duration-300" style={{ color: 'rgba(4, 98, 65, 0.8)' }}>
              Lifewood is a global champion in AI data solutions, igniting a culture of innovation and sustainability. 
              We develop cutting-edge AI technologies that solve real-world problems.
            </p>
            <div className="flex items-center gap-4 text-castleton-green text-lg font-medium transition-colors duration-300" style={{ color: '#046241' }}>
              <span className="hover:text-[#133020] transition-colors duration-300">#Always on</span>
              <span>|</span>
              <span className="hover:text-[#133020] transition-colors duration-300">#Never off</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 hover:text-[#133020] transition-colors duration-300" style={{ color: '#046241' }}>Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-castleton-green/80 hover:text-[#133020] hover:translate-x-1 transition-all duration-300 inline-block" style={{ color: 'rgba(4, 98, 65, 0.8)' }}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-castleton-green/80 hover:text-[#133020] hover:translate-x-1 transition-all duration-300 inline-block" style={{ color: 'rgba(4, 98, 65, 0.8)' }}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-castleton-green/80 hover:text-[#133020] hover:translate-x-1 transition-all duration-300 inline-block" style={{ color: 'rgba(4, 98, 65, 0.8)' }}>
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/apply" className="text-castleton-green/80 hover:text-[#133020] hover:translate-x-1 transition-all duration-300 inline-block" style={{ color: 'rgba(4, 98, 65, 0.8)' }}>
                  Apply Now
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4 hover:text-[#133020] transition-colors duration-300" style={{ color: '#046241' }}>Get in Touch</h3>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/LifewoodPH" target="_blank" rel="noopener noreferrer" className="p-3 bg-[#133020] hover:bg-[#046241] hover:scale-110 text-white rounded-full transition-all duration-300 group">
                <FontAwesomeIcon icon={faFacebookF} className="w-4 h-4" />
              </a>
              <a href="https://www.youtube.com/@LifewoodDataTechnology" target="_blank" rel="noopener noreferrer" className="p-3 bg-[#133020] hover:bg-[#046241] hover:scale-110 text-white rounded-full transition-all duration-300 group">
                <FontAwesomeIcon icon={faYoutube} className="w-4 h-4" />
              </a>
              <a href="https://www.linkedin.com/company/lifewood-data-technology-ltd./" target="_blank" rel="noopener noreferrer" className="p-3 bg-[#133020] hover:bg-[#046241] hover:scale-110 text-white rounded-full transition-all duration-300 group">
                <FontAwesomeIcon icon={faLinkedinIn} className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="bg-dark-serpent text-white py-6 mt-8" style={{ backgroundColor: '#133020' }}>
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-white/80 hover:text-white transition-colors duration-300" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            &copy; 2024 Lifewood Data Technology. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
