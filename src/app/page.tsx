"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  Github,
  Linkedin,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Send,
  CheckCircle,
  ArrowDown,
  RotateCw,
} from "lucide-react";
import SwingText from "@/components/ui/SwingText";
import ParticleContainer from "@/components/ui/ParticleContainer";
import ParticleBackground from "@/components/ui/ParticleBackground";

// Dynamic import for Three.js scene to avoid SSR issues
const Scene = dynamic(() => import("@/components/three/Scene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900" />
  ),
});

const DiamondImage = dynamic(() => import("@/components/three/DiamondImage"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-square bg-slate-800/50 rounded-lg animate-pulse" />
  ),
});

const ImageCube = dynamic(() => import("@/components/three/ImageCube"), {
  ssr: false,
  loading: () => (
    <div className="w-[280px] h-[280px] bg-slate-800/50 rounded-lg animate-pulse" />
  ),
});

const socialLinks = [
  { icon: Github, href: "https://github.com/Cnoyy", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/ꜱʜɪɴᴏʏ-ꜱ-0a4129333", label: "LinkedIn" },
  { icon: Instagram, href: "https://www.instagram.com/c.noy_?igsh=emZwYXVsOXBmZG1p", label: "Instagram" },
  { icon: Mail, href: "https://mail.google.com/mail/?view=cm&fs=1&to=shinoysivadasan2312@gmail.com", label: "Email" },
];

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "shinoysivadasan2312@gmail.com",
    href: "mailto:shinoysivadasan2312@gmail.com",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+91 8592987848",
    href: "tel:+918592987848",
  },
  {
    icon: MapPin,
    title: "Location",
    value: "Calicut, Kerala",
    href: null,
  },
];

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors?.[0] || "Failed to send message");
      }

      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-800 text-gray-300 overflow-x-hidden">
      {/* Global Particle Background */}
      <ParticleBackground />
      
      {/* Hero Section with 3D Background */}
      <section id="home" className="relative min-h-screen flex items-center justify-center">
        <Scene />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-center lg:text-left">
              <h1 className="mt-10 md:mt-12 lg:mt-0 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 whitespace-nowrap">
                {/* Gradient "Hi, I'm" with soft light outline */}
                <SwingText
                  text="Hi, I'm "
                  className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 via-gray-500 to-slate-400 lilita-one-regular"
                  style={{ WebkitTextStroke: '1px rgba(255,255,255,0.4)' }}
                />
                {/* Solid white "Shinoy" with subtle gray stroke */}
                <SwingText
                  text="SHINOY"
                  className="text-white titan-one-regular"
                  style={{
                    WebkitTextStroke: '1px rgba(148,163,184,0.5)',
                  }}
                />
              </h1>

              <p className="text-xl sm:text-2xl md:text-3xl text-white mb-4">
                <SwingText text="Frontend Developer & UI Designer" className="lilita-one-regular" />
              </p>

              <p className="text-lg text-gray-300 max-w-xl mx-auto lg:mx-0 mb-8">
                <SwingText
                  text="Blending artistic creativity with technical precision to craft visually stunning interfaces. I transform ideas into pixel-perfect designs with an eye for aesthetics and a passion for intuitive user experiences."
                  className="averia-gruesa-libre-regular"
                />
              </p>

              {/* Social links row + secondary row for contact/availability on mobile */}
              <div className="flex flex-col items-center gap-4 mt-8 lg:flex-row lg:items-center lg:justify-start lg:gap-6">
                {/* Row 1: Social icons */}
                <div className="flex items-center gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-full bg-slate-800/60 border border-slate-700/80 hover:border-slate-500 hover:bg-slate-700 transition-all duration-300 text-slate-400 hover:text-white hover:scale-110"
                      aria-label={social.label}
                    >
                      <social.icon size={20} strokeWidth={1.5} />
                    </a>
                  ))}
                </div>

                {/* Row 2 on mobile, inline on desktop: Contact + Available for work */}
                <div className="flex items-center gap-6">
                  <div className="h-6 w-px bg-slate-700" />

                  <a 
                    href="#contact"
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-all duration-300 text-sm group"
                  >
                    <Phone size={16} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                    <span>Contact</span>
                  </a>

                  <div className="h-6 w-px bg-slate-700" />

                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50" />
                    <span>Available for work</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Image - 3D Cube with reactive particles on hover */}
            <div className="relative flex justify-center lg:justify-end">
              <ParticleContainer
                className="relative flex items-center justify-center"
                particleCount={10}
                particleSize={{ min: 5, max: 12 }}
                maxParticles={90}
                shapeMode="mixed"
                intensifyOnHover
                useViewportCoords
              >
                <div className="relative flex items-center justify-center" style={{ width: 320, height: 320 }}>
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-gray-600 rounded-full blur-3xl opacity-20 scale-110" />
                  
                  {/* 3D Image Cube */}
                  <ImageCube 
                    // Pass empty array so ImageCube uses its own /s*.jpg defaults
                    images={[]}
                    className="relative z-10 scale-75 sm:scale-75 md:scale-90 lg:scale-100" 
                  />
                  
                  {/* Instruction text */}
                  <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-slate-500 text-xs whitespace-nowrap flex items-center gap-2">
                    <RotateCw className="w-3 h-3 animate-spin" />
                    Drag to rotate
                  </p>
                </div>
              </ParticleContainer>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <a href="#contact" className="text-slate-600 hover:text-slate-400 transition-colors">
            <ArrowDown size={32} />
          </a>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 md:py-28 bg-slate-900/50 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-800/10 to-transparent" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <SwingText text="Get In Touch" className="lilita-one-regular" />
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              <SwingText
                text="Have a project in mind or want to collaborate? I'd love to hear from you!"
                className="averia-gruesa-libre-regular"
              />
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-4">
                  <SwingText text="Let's work together" className="lilita-one-regular" />
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  <SwingText
                    text="I'm always open to discussing new projects, creative ideas, and meaningful collaborations that push design boundaries. Whether it's a portfolio website, a product interface, or a full brand experience, I'm excited to explore how we can bring your vision to life together."
                    className="averia-gruesa-libre-regular"
                  />
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((item) => (
                  <ParticleContainer
                    key={item.title}
                    particleCount={5}
                    particleSize={{ min: 4, max: 10 }}
                    maxParticles={35}
                  >
                    <div
                      className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/60 shadow-[4px_4px_8px_rgba(0,0,0,0.25),-4px_-4px_8px_rgba(71,85,105,0.15)] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.3),-6px_-6px_12px_rgba(71,85,105,0.2)] transition-all duration-300 group cursor-pointer hover-shiver hover-swing3d"
                    >
                      <div className="p-3 rounded-xl bg-slate-700/80 text-slate-400 group-hover:text-white transition-colors shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2),inset_-2px_-2px_4px_rgba(71,85,105,0.1)]">
                        <item.icon size={22} strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">
                          {item.title}
                        </p>
                        {item.href ? (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white font-medium hover:text-slate-300 transition-colors"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-white font-medium">
                            {item.value}
                          </p>
                        )}
                      </div>
                    </div>
                  </ParticleContainer>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              {isSubmitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                    <CheckCircle size={32} className="text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-slate-400">
                    Thank you for reaching out. I&apos;ll get back to you soon!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <ParticleContainer particleCount={4} particleSize={{ min: 3, max: 8 }} maxParticles={25}>
                      <div className="group">
                        <label htmlFor="name" className="block text-sm font-medium text-white mb-2 group-focus-within:text-white transition-colors">
                          <SwingText text="Name" />
                        </label>
                        <div className="relative hover-shiver">
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3.5 rounded-xl bg-slate-800/80 text-white placeholder-slate-500 border-0 focus:outline-none focus:ring-0 transition-all shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(71,85,105,0.2)] focus:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.4),inset_-3px_-3px_6px_rgba(71,85,105,0.3)] hover:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.35),inset_-3px_-3px_6px_rgba(71,85,105,0.25)]"
                            placeholder="Enter your name"
                          />
                        </div>
                      </div>
                    </ParticleContainer>
                    <ParticleContainer particleCount={4} particleSize={{ min: 3, max: 8 }} maxParticles={25}>
                      <div className="group">
                        <label htmlFor="email" className="block text-sm font-medium text-white mb-2 group-focus-within:text-white transition-colors">
                          <SwingText text="Email" />
                        </label>
                        <div className="relative hover-shiver">
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3.5 rounded-xl bg-slate-800/80 text-white placeholder-slate-500 border-0 focus:outline-none focus:ring-0 transition-all shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(71,85,105,0.2)] focus:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.4),inset_-3px_-3px_6px_rgba(71,85,105,0.3)] hover:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.35),inset_-3px_-3px_6px_rgba(71,85,105,0.25)]"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>
                    </ParticleContainer>
                  </div>

                  <ParticleContainer particleCount={4} particleSize={{ min: 3, max: 8 }} maxParticles={25}>
                    <div className="group">
                      <label htmlFor="subject" className="block text-sm font-medium text-white mb-2 group-focus-within:text-white transition-colors">
                        <SwingText text="Subject" />
                      </label>
                      <div className="relative hover-shiver">
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3.5 rounded-xl bg-slate-800/80 text-white placeholder-slate-500 border-0 focus:outline-none focus:ring-0 transition-all shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(71,85,105,0.2)] focus:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.4),inset_-3px_-3px_6px_rgba(71,85,105,0.3)] hover:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.35),inset_-3px_-3px_6px_rgba(71,85,105,0.25)]"
                          placeholder="Project Inquiry"
                        />
                      </div>
                    </div>
                  </ParticleContainer>

                  <ParticleContainer particleCount={5} particleSize={{ min: 3, max: 8 }} maxParticles={30}>
                    <div className="group">
                      <label htmlFor="message" className="block text-sm font-medium text-white mb-2 group-focus-within:text-white transition-colors">
                        <SwingText text="Message" />
                      </label>
                      <div className="relative hover-shiver">
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={5}
                          className="w-full px-4 py-3.5 rounded-xl bg-slate-800/80 text-white placeholder-slate-500 border-0 focus:outline-none focus:ring-0 transition-all resize-none shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(71,85,105,0.2)] focus:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.4),inset_-3px_-3px_6px_rgba(71,85,105,0.3)] hover:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.35),inset_-3px_-3px_6px_rgba(71,85,105,0.25)]"
                          placeholder="Tell me about your project..."
                        />
                      </div>
                    </div>
                  </ParticleContainer>

                  {submitError && (
                    <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm">
                      {submitError}
                    </div>
                  )}

                  <ParticleContainer particleCount={6} particleSize={{ min: 4, max: 10 }} maxParticles={40}>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full px-8 py-4 bg-slate-700 rounded-xl font-medium text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[4px_4px_8px_rgba(0,0,0,0.3),-4px_-4px_8px_rgba(71,85,105,0.2)] hover:shadow-[2px_2px_4px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(71,85,105,0.2)] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(71,85,105,0.2)] hover-shiver hover-swing3d"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          <SwingText text="Sending..." />
                        </>
                      ) : (
                        <>
                          <Send size={20} />
                          <SwingText text="Send Message" />
                        </>
                      )}
                    </button>
                  </ParticleContainer>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} Shinoy. All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-white transition-all duration-300 hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon size={18} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
