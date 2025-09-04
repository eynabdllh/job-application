"use client";

import { TimelineContent } from "@/components/ui/timeline-animation";
import { useMediaQuery } from "@/hooks/use-media-query";
import { AlignJustify, X, Brain, Database, Users, MessageSquare, Eye, Car } from "lucide-react";
import { useRef, useState } from "react";
import { Drawer } from "vaul";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function ProjectsPage() {
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


  const projects = [
    {
      icon: <Database className="w-8 h-8" />,
      title: "AI Data Extraction",
      description: "Develop intelligent systems that automatically extract, process, and analyze data from various sources to drive informed decision-making.",
      skills: ["Python", "Machine Learning", "Data Processing", "API Integration"]
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Machine Learning Enablement",
      description: "Build and deploy machine learning models that enable businesses to leverage predictive analytics and automation.",
      skills: ["TensorFlow", "PyTorch", "Scikit-learn", "Model Deployment"]
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Genealogy",
      description: "Create AI-powered tools for tracing family histories and building comprehensive genealogical databases.",
      skills: ["Data Mining", "Pattern Recognition", "Database Design", "Web Development"]
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Natural Language Processing",
      description: "Develop advanced NLP systems for text analysis, sentiment detection, and automated language processing.",
      skills: ["NLP", "BERT", "Transformers", "Text Analytics"]
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "AI-Enabled Customer Service",
      description: "Build intelligent chatbots and customer service automation systems that enhance user experience.",
      skills: ["Chatbot Development", "Dialog Systems", "Customer Analytics", "Integration"]
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Computer Vision",
      description: "Create computer vision systems for image recognition, object detection, and visual data analysis.",
      skills: ["OpenCV", "Deep Learning", "Image Processing", "Object Detection"]
    },
    {
      icon: <Car className="w-8 h-8" />,
      title: "Autonomous Driving Technology",
      description: "Develop cutting-edge autonomous vehicle systems using AI and sensor fusion technologies.",
      skills: ["Sensor Fusion", "Path Planning", "Real-time Systems", "Safety Protocols"]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <section className="bg-[#f5eedb] relative flex-grow" ref={heroRef}>

      <Header/>

      {/* Hero Section with Dark Green Background */}
      {/* MODIFICATION: Added pb-48 for bottom padding to make space for the overlapping cards */}
      <article className="pt-32 sm:pt-32 w-full flex items-center justify-center relative z-10 pb-48" style={{ backgroundColor: '#133020' }}>
        <div className="w-fit max-w-4xl mx-auto text-center space-y-6 px-4">
          <TimelineContent
            as="div"
            animationNum={1}
            timelineRef={heroRef}
            customVariants={revealVariants}
            className="space-y-4"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[120%] text-white">
              Join Our Projects
            </h1>
            
            <div className="flex justify-center items-center gap-4 text-2xl font-medium text-[#FFC370]">
              <span>#Always on</span>
              <span>|</span>
              <span>#Never off</span>
            </div>
            
            <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
              Join our innovative team and work on cutting-edge technology projects that are shaping the future. 
              Each project offers unique challenges and opportunities to make a real impact.
            </p>
          </TimelineContent>
        </div>
      </article>

      {/* Projects Grid */}
      {/* MODIFICATION: Added -mt-40 to pull the grid up and z-20 to ensure it overlaps correctly */}
      <section className="max-w-7xl mx-auto px-4 py-16 relative z-20 -mt-40">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <TimelineContent
              key={project.title}
              as="div"
              animationNum={2}
              timelineRef={heroRef}
              customVariants={revealVariants}
              // MODIFICATION: Added shadow-lg for default depth and hover:shadow-2xl for a stronger hover effect
              className={`bg-white rounded-2xl border border-[#133020]/10 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group h-full flex flex-col`}
            >
              <div className="w-16 h-16 mb-6 bg-[#046241]/10 rounded-xl flex items-center justify-center text-[#046241] group-hover:bg-[#046241] group-hover:text-white transition-all duration-300">
                {project.icon}
              </div>
              
              <h3 className="text-2xl font-semibold text-[#133020] mb-4 group-hover:text-[#046241] transition-colors">
                {project.title}
              </h3>
              
              <p className="text-[#133020]/70 leading-relaxed mb-6 flex-grow">
                {project.description}
              </p>
              
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-[#133020] mb-3">Key Skills:</h4>
                <div className="flex flex-wrap gap-2">
                  {project.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-[#FFB347]/10 text-[#133020] text-xs font-medium rounded-full border border-[#FFB347]/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-auto pt-4">
                <Link href={`/apply?project=${encodeURIComponent(project.title)}`}>
                  <button className="w-full text-base h-12 px-6 rounded-xl text-[#133020] font-semibold flex items-center justify-center gap-2 bg-[#FFB347] hover:bg-[#FFC370] transition-all duration-300 shadow-lg hover:shadow-xl group">
                    Apply for This Project
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </Link>
              </div>
            </TimelineContent>
          ))}
        </div>
      </section>
      </section>
      <Footer />
    </div>
  );
}