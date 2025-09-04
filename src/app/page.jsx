"use client";

import { TimelineContent } from "@/components/ui/timeline-animation";
import VerticalBarsNoise from "@/components/ui/vertical-bars";
import VerticalCutReveal from "@/components/ui/vertical-cut-reveal";
import { useMediaQuery } from "@/hooks/use-media-query";
import { AlignJustify, X, Globe, Cpu, Users, BrainCircuit, ShieldCheck, DatabaseZap } from "lucide-react";
import { useRef, useState } from "react";
import { Drawer } from "vaul";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";

const lifewoodContent = [
  {
    title: "A Global Bridge for a Connected World",
    description:
      "Strategically positioned between East and West, Lifewood fosters harmony, trust, and cooperation across borders. We are more than a data company; we are a super-bridge connecting diverse cultures and businesses to drive progress.",
    content: (
      <div className="flex h-full w-full items-center justify-center rounded-lg bg-[#f5eedb] text-[#133020]">
        <Globe className="h-40 w-40" strokeWidth={1.5} />
      </div>
    ),
  },
  {
    title: "Pioneering the Future with Advanced AI",
    description:
      "We leverage cutting-edge technologies like AI, GPT, and Gemini to develop transformative solutions. Our commitment to innovation allows us to tackle real-world problems and deliver unparalleled value to our global partners.",
    content: (
       <div className="flex h-full w-full items-center justify-center rounded-lg bg-[#f5eedb] text-[#133020]">
        <Cpu className="h-40 w-40" strokeWidth={1.5} />
      </div>
    ),
  },
  {
    title: "Committed to Positive, Sustainable Change",
    description:
      "Our work is guided by strong ESG principles. We actively empower communities, champion diversity and inclusion, and strive to make a meaningful, positive impact on society and the environment in every region we serve.",
    content: (
       <div className="flex h-full w-full items-center justify-center rounded-lg bg-[#f5eedb] text-[#133020]">
        <Users className="h-40 w-40" strokeWidth={1.5} />
      </div>
    ),
  },
];


export default function HomePage() {
  const isMobile = useMediaQuery("(max-width: 992px)");
  const [isOpen, setIsOpen] = useState(false);
  const heroRef = useRef(null);

  const revealVariants = {
    visible: (i) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { delay: i * 0.4, duration: 0.5 },
    }),
    hidden: { filter: "blur(10px)", y: -20, opacity: 0 },
  };

  const expertiseAreas = [
    {
      icon: <DatabaseZap className="w-8 h-8" />,
      title: "AI Data Solutions",
      description: "Providing high-quality, scalable data for training advanced AI and machine learning models."
    },
    {
      icon: <BrainCircuit className="w-8 h-8" />,
      title: "LLM & Generative AI",
      description: "Specializing in training, fine-tuning, and deploying large language models for diverse applications."
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: "Content Moderation",
      description: "Ensuring brand safety and user trust with reliable, multi-format content review services."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow" ref={heroRef}>
        
        {/* === HERO CONTAINER WITH FADE EFFECT === */}
        <div className="relative bg-[#F9F7F7]">
          <div className="absolute top-0 left-0 -inset-0 right-0 opacity-40 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_40%,#000_70%,transparent_110%)]">
            <VerticalBarsNoise />
          </div>

          <Header/>
          
          <article className="pt-24 pb-32 sm:pt-32 sm:pb-32 w-fit max-w-4xl mx-auto text-center space-y-4 relative z-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[120%] text-[#133020]">
              <VerticalCutReveal
                splitBy="words"
                staggerDuration={0.15}
                staggerFrom="first"
                containerClassName="justify-center"
                reverse={true}
                transition={{
                  type: "spring",
                  stiffness: 250,
                  damping: 40,
                  delay: 0.4,
                }}
              >
                Lifewood Data Technology
              </VerticalCutReveal>
            </h1>

            <TimelineContent as="div" animationNum={1} timelineRef={heroRef} customVariants={revealVariants} className="space-y-4">
              <div className="flex justify-center items-center gap-4 text-2xl font-semibold text-[#E89131]">
                <span>#Always on</span>
                <span>|</span>
                <span>#Never off</span>
              </div>
              <p className="max-w-2xl mx-auto text-lg sm:text-xl text-[#133020] leading-relaxed font-medium [text-shadow:0_1px_0_rgba(255,255,255,0.9)]">
                Lifewood delivers trusted AI data solutions for global businesses, empowering innovation and efficiency worldwide.
              </p>
            </TimelineContent>

            <TimelineContent as="div" animationNum={3} timelineRef={heroRef} customVariants={revealVariants} className="flex gap-4 mt-8 mx-auto w-fit">
              <Link href="/apply">
                <button className="text-xl h-14 px-8 rounded-lg text-white font-semibold flex items-center gap-2 bg-[#046241] hover:bg-[#133020] transition-all duration-300 shadow-lg hover:shadow-xl group">
                  Apply Now
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </Link>
            </TimelineContent>
          </article>
        </div>

        {/* === NEW DARK SECTION WRAPPER === */}
        {/* MODIFICATION: This section now wraps all subsequent content and sets the dark background */}
        <section className="bg-[#F9F7F7] relative z-20">
          
          {/* "What Drives Us" Section */}
          <div className="py-16">
            <TimelineContent as="div" animationNum={4} timelineRef={heroRef} customVariants={revealVariants} className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#133020]">What Drives Us</h2>
              <div className="mt-4 h-1 w-20 bg-[#133020]/30 mx-auto rounded-full" />
            </TimelineContent>
          </div>
          
          {/* Sticky Scroll Reveal Section */}
          <div>
            <StickyScroll content={lifewoodContent} />
          </div>
        
          {/* === "Our Expertise" Section === */}
        <section className="relative z-10 py-24 px-4">
          <TimelineContent as="div" animationNum={5} timelineRef={heroRef} customVariants={revealVariants} className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#133020]">
              Our Areas of Expertise
            </h2>
            <p className="mt-4 text-lg text-[#133020]/80 leading-relaxed">
              We provide comprehensive, end-to-end data services that power the world's most innovative AI technologies.
            </p>
          </TimelineContent>

          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 mt-12">
            {expertiseAreas.map((item, index) => (
              <TimelineContent key={item.title} as="div" animationNum={6 + index} timelineRef={heroRef} customVariants={revealVariants} className="bg-white/50 p-8 rounded-xl shadow-lg border border-black/5 backdrop-blur-sm text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#f5eedb] rounded-full flex items-center justify-center text-[#046241]">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-[#133020]">{item.title}</h3>
                <p className="mt-2 text-[#133020]/70">{item.description}</p>
              </TimelineContent>
            ))}
          </div>
        </section>
        </section>
      </main>
      <Footer />
    </div>
  );
}