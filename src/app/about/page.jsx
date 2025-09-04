"use client";

import { TimelineContent } from "@/components/ui/timeline-animation";
import { useMediaQuery } from "@/hooks/use-media-query";
import { AlignJustify, X, Globe, Users, Lightbulb, Shield, Heart, Zap, Briefcase, Rocket, Building } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { Drawer } from "vaul";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

// Custom hook for parallax effect
const useScrollParallax = () => {
  const [offset, setOffset] = useState(0);
  const handleScroll = () => {
    setOffset(window.pageYOffset);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return offset;
};

export default function AboutPage() {
  const isMobile = useMediaQuery("(max-width: 992px)");
  const [isOpen, setIsOpen] = useState(false);
  const heroRef = useRef(null);
  const parallaxOffset = useScrollParallax();

  const revealVariants = {
    visible: (i) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { delay: i * 0.4, duration: 0.5 },
    }),
    hidden: { filter: "blur(10px)", y: -20, opacity: 0 },
  };

  const coreValues = [
    { icon: <Heart className="w-8 h-8" />, title: "Caring", description: "We care for every person deeply and equally, because without care work becomes meaningless." },
    { icon: <Shield className="w-8 h-8" />, title: "Integrity", description: "We are dedicated to acting ethically and sustainably in everything we do, as it is the basis of our existence." },
    { icon: <Globe className="w-8 h-8" />, title: "Diversity", description: "We celebrate differences in belief and ways of life, as they bring unique perspectives that encourage us to move forward." },
    { icon: <Zap className="w-8 h-8" />, title: "Innovation", description: "Innovation is at the heart of all we do, challenging us to continually improve ourselves and our service." }
  ];

  const timelineEvents = [
    { year: "2004", title: "Company Founded", description: "Lifewood is established with a mission to revolutionize data solutions.", icon: <Zap /> },
    { year: "2011", title: "Global Expansion", description: "Expanded operations by establishing 10 global delivery centers, enhancing our worldwide reach.", icon: <Globe /> },
    { year: "2020", title: "AI-Powered Growth", description: "Pivoted to a DaaS model, achieving 295% profit growth and opening a new R&D center.", icon: <Rocket /> },
    { year: "2024", title: "Leading the Future", description: "Continuing to integrate GenAI/LLM technologies and expanding our global footprint to new strategic locations.", icon: <Building /> }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f5eedb]">
      <Header/>
      <main ref={heroRef}>
        {/* === HERO SECTION === */}
        <section className="relative h-[75vh] w-full flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
            <video
              className="w-full h-full object-cover"
              autoPlay loop muted playsInline
              style={{ transform: `translateY(${parallaxOffset * 0.3}px) scale(1)` }}
            >
              <source src="/lfw_vid.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/60"></div>
          </div>
          
          <div className="relative z-10 w-fit max-w-4xl mx-auto text-center space-y-6 px-4">
            <TimelineContent as="div" animationNum={1} timelineRef={heroRef} customVariants={revealVariants}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FFC370] via-[#FFB347] to-[#FFD78A]">
                Bridging Worlds, Powering the Future.
              </h1>
              <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto mt-4">
                Discover the story, mission, and values that define Lifewood's journey in shaping the future of AI data solutions.
              </p>
            </TimelineContent>
          </div>
        </section>

        {/* === OUR MISSION & VISION SECTION === */}
        <section className="py-24 px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <TimelineContent as="div" animationNum={2} timelineRef={heroRef} customVariants={revealVariants}>
              <Image src="/lfw_malaysia.jpg" alt="Global data network" width={600} height={400} className="rounded-2xl shadow-2xl object-cover"/>
            </TimelineContent>
            <div className="space-y-8">
              <TimelineContent as="div" animationNum={2.5} timelineRef={heroRef} customVariants={revealVariants}>
                <h2 className="text-3xl font-bold text-[#133020] mb-3">Our Vision</h2>
                <p className="text-lg text-[#133020]/80 leading-relaxed">
                  To be the global champion in AI data solutions, igniting a culture of innovation and sustainability that enriches lives and transforms communities worldwide.
                </p>
              </TimelineContent>
              <TimelineContent as="div" animationNum={3} timelineRef={heroRef} customVariants={revealVariants}>
                <h2 className="text-3xl font-bold text-[#133020] mb-3">Our Mission</h2>
                <p className="text-lg text-[#133020]/80 leading-relaxed">
                  To develop and deploy cutting-edge AI technologies that solve real-world problems, empower communities, and make a meaningful impact on society and the environment.
                </p>
              </TimelineContent>
            </div>
          </div>
        </section>

        {/* === TIMELINE SECTION === */}
        <section className="py-24 px-4">
          <TimelineContent as="h2" animationNum={4} timelineRef={heroRef} customVariants={revealVariants} className="text-4xl font-bold text-center text-[#133020] mb-16">
            Our Journey
          </TimelineContent>
          <div className="max-w-3xl mx-auto relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-0.5 bg-[#133020]/10"></div>
            {timelineEvents.map((event, index) => (
              <TimelineContent key={index} as="div" animationNum={5 + index} timelineRef={heroRef} customVariants={revealVariants} className="mb-12">
                <div className={`flex items-center ${index % 2 === 0 ? 'flex-row-reverse' : ''} w-full`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pl-8' : 'pr-8 text-right'}`}>
                    <p className="text-lg font-semibold text-[#046241]">{event.year}</p>
                    <h3 className="text-2xl font-bold text-[#133020] mt-1">{event.title}</h3>
                    <p className="text-md text-[#133020]/70 mt-2">{event.description}</p>
                  </div>
                  <div className="w-1/2 flex justify-center">
                    <div className="relative">
                      <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-[#046241]">
                        {event.icon}
                      </div>
                    </div>
                  </div>
                </div>
              </TimelineContent>
            ))}
          </div>
        </section>

        {/* === WHAT DRIVES US (CORE VALUES) SECTION === */}
        <section className="bg-[#133020] py-24 px-4">
          <TimelineContent as="h2" animationNum={10} timelineRef={heroRef} customVariants={revealVariants} className="text-4xl font-bold text-center text-white mb-12">
            What Drives Us
          </TimelineContent>
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <TimelineContent key={value.title} as="div" animationNum={11 + index} timelineRef={heroRef} customVariants={revealVariants} className="text-center p-8 bg-[#f5eedb]/5 rounded-2xl transition-all duration-300 group relative">
                <div className="w-16 h-16 mx-auto mb-6 bg-[#f5eedb]/10 rounded-full flex items-center justify-center text-[#FFC370] group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">{value.title}</h3>
                <p className="text-white/70 leading-relaxed">{value.description}</p>
              </TimelineContent>
            ))}
          </div>
        </section>

        {/* === CALL TO ACTION SECTION === */}
        <section className="py-24 px-4 text-center">
          <TimelineContent as="div" animationNum={16} timelineRef={heroRef} customVariants={revealVariants}>
            <h2 className="text-4xl font-bold text-[#133020]">Join Our Journey</h2>
            <p className="max-w-2xl mx-auto text-lg text-[#133020]/80 mt-4">
              We're always looking for passionate and innovative individuals to join our global team. Help us shape the future of technology and make a real-world impact.
            </p>
            <Link href="/apply">
              <button className="mt-8 text-xl h-14 px-8 rounded-lg text-white font-semibold flex items-center justify-center mx-auto gap-2 bg-[#046241] hover:bg-[#133020] transition-all duration-300 shadow-lg hover:shadow-xl group">
                Explore Careers
              </button>
            </Link>
          </TimelineContent>
        </section>

      </main>
      <Footer />
    </div>
  );
}