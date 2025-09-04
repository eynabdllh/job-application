"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Drawer } from "vaul";
import Image from "next/image";
import Link from "next/link";
import { AlignJustify, X } from "lucide-react";
import { useState } from "react";

export default function Header({ navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/projects", label: "Projects" },
] }) {
  const isMobile = useMediaQuery("(max-width: 992px)");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-md relative z-50">
    <div className="max-w-6xl mx-auto p-4 flex justify-between items-center">
      <Link href="/">
        <Image
          src="/lifewood_logo.png"
          alt="Lifewood Logo"
          width={150}
          height={50}
        />
      </Link>

      {!isMobile ? (
        <div className="flex items-center gap-6">
          <nav className="flex gap-6 font-medium text-[#133020]">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="relative hover:text-[#046241] transition-colors group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#046241] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>
          {/* Apply Now *
          <Link href="/apply">
            <button className="text-base h-10 px-5 rounded-lg text-white font-semibold flex items-center gap-2 bg-[#046241] hover:bg-[#133020] transition-all group shadow-lg hover:shadow-xl">
              Apply Now
            </button>
          </Link>
          */}
        </div>
      ) : (
        <Drawer.Root direction="right" open={isOpen} onOpenChange={setIsOpen}>
          <Drawer.Trigger className="p-2 text-[#133020] h-9 grid place-content-center bg-[#f9f7f7] w-fit rounded-lg hover:bg-[#046241]/10 transition-colors">
            <AlignJustify />
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
            <Drawer.Content className="right-0 top-0 bottom-0 mt-4 mr-4 fixed z-50 outline-none h-[96%] w-80 flex">
              <Drawer.Title className="sr-only">Mobile Navigation</Drawer.Title>
              <Drawer.Description className="sr-only">Main site links</Drawer.Description>
              <div className="bg-gradient-to-b from-white via-[#f9f7f7] to-white border border-[#133020]/10 text-[#133020] p-4 h-full w-full grow flex flex-col rounded-[20px] shadow-2xl backdrop-blur-sm">
                <div className="w-full flex justify-between items-center p-3 border-b border-[#133020]/10">
                  <Image
                    src="/lifewood_logo.png"
                    alt="Lifewood Logo"
                    width={130}
                    height={45}
                    className="object-contain"
                  />
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full bg-[#133020]/5 hover:bg-[#133020]/10 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 py-6 px-3">
                  <nav className="space-y-1">
                    {navLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="block px-4 py-3 rounded-xl text-[#133020] hover:bg-[#046241]/5 hover:text-[#046241] transition-all duration-200 font-medium"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  {/* Apply Now *
                  <div className="mt-8 pt-6 border-t border-[#133020]/10">
                    <Link href="/apply">
                      <button className="w-full text-base h-12 px-6 rounded-xl text-white font-semibold flex items-center justify-center gap-2 bg-[#046241] hover:bg-[#133020] transition-all duration-200 shadow-lg hover:shadow-xl">
                        Apply Now
                      </button>
                    </Link>
                  </div>
                  */}
                </div>
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      )}
    </div>
  </header>
  );
}