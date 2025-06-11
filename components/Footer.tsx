import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#161e2c] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          {/* Logo */}
          <div className="mb-8 md:mb-0">
            <Link href="/">
              <div className="relative w-36 h-14 md:w-48 md:h-20 mb-4">
                <Image
                  src="/images/OceanLux_logo2.png"
                  alt="OceanLux Croisières"
                  fill
                  style={{ objectFit: "contain" }}
                  priority  
                />
              </div>
              <p className="text-xs uppercase tracking-wider text-center opacity-70">Croisières privées à Bonifacio</p>
            </Link>
          </div>

          {/* Menu */}
          <div className="mb-8 md:mb-0">
            <h3 className="text-xl font-light text-[#c8b273] border-b border-[#c8b273] inline-block mb-6">Menu</h3>
            <div className="grid grid-cols-2 gap-x-12 gap-y-2">
              <Link href="/" className="hover:text-[#c8b273] transition-colors">
                ACCUEIL
              </Link>
              <Link href="/moments-forts" className="hover:text-[#c8b273] transition-colors">
                MOMENTS FORTS
              </Link>
              <Link href="/yacht" className="hover:text-[#c8b273] transition-colors">
                YACHT
              </Link>
              <Link href="/catamaran" className="hover:text-[#c8b273] transition-colors">
                CATAMARAN
              </Link>
              <Link href="/privatisation" className="hover:text-[#c8b273] transition-colors">
                PRIVATISATION
              </Link>
              <Link href="/region" className="hover:text-[#c8b273] transition-colors">
                RÉGION
              </Link>
              <Link href="/galerie" className="hover:text-[#c8b273] transition-colors">
                GALERIE
              </Link>
              <Link href="/contact" className="hover:text-[#c8b273] transition-colors">
                CONTACT
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="mb-8 md:mb-0">
            <h3 className="text-xl font-light text-[#c8b273] border-b border-[#c8b273] inline-block mb-6">Contact</h3>
            <div className="flex flex-col space-y-2">
              <p>PORT, 20169 - BONIFACIO</p>
              <p>luxocean243@gmail.com</p>
            </div>
          </div>

          {/* Création */}
          <div>
            <h3 className="text-xl font-light text-[#c8b273] border-b border-[#c8b273] inline-block mb-6">Création</h3>
            <div className="flex mb-4">
              <a 
                href="https://www.facebook.com/oceanluxcroisieres" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#c8b273] flex items-center justify-center mr-2 hover:opacity-80 transition-opacity"
              >
                <FaFacebookF className="text-[#161e2c]" />
              </a>
              <a 
                href="https://www.instagram.com/oceanlux_croisieres" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#c8b273] flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <FaInstagram className="text-[#161e2c]" />
              </a>
            </div>

            <div className="flex items-center mb-4">
              <span className="text-[#c8b273] font-light">Éditions<span className="text-white">Corses</span></span>
            </div>

            <Link href="/mentions-legales" className="uppercase text-sm hover:text-[#c8b273] transition-colors">
              MENTIONS LÉGALES
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 