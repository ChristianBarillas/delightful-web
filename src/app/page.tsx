"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import ImmersiveSlide from "./components/ImmersiveSlide";
import CinematicGrid from "./components/CinematicGrid";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 8; // 0-7

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        nextSlide();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        prevSlide();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <main className="h-screen w-screen overflow-hidden bg-black text-white relative">

      {/* Slides Container */}
      <div className="w-full h-full relative">
        <AnimatePresence mode="wait">

          {/* SLIDE 0: INTRO */}
          {currentSlide === 0 && (
            <motion.div key="slide0" className="absolute inset-0" exit={{ opacity: 0 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ImmersiveSlide videoSrc="/videos/video1.mp4" posterSrc="/images/deck.png" isActive={true}>
                <h1 className="text-7xl md:text-9xl font-extrabold tracking-tighter leading-none mb-4">
                  Delightful<br /><span className="text-[#d4af37]">Services</span>.
                </h1>
                <p className="text-xl md:text-2xl font-light tracking-widest uppercase opacity-80">Excellence in Motion.</p>
              </ImmersiveSlide>
            </motion.div>
          )}

          {/* SLIDE 1: MISSION */}
          {currentSlide === 1 && (
            <motion.div key="slide1" className="absolute inset-0" exit={{ opacity: 0 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ImmersiveSlide videoSrc="/videos/video2.mp4" posterSrc="/images/ramp.png" isActive={true}>
                <h2 className="text-6xl md:text-7xl font-bold mb-6">Seamless Accessibility.</h2>
                <p className="text-xl md:text-2xl font-light opacity-90 leading-relaxed max-w-2xl">
                  Functionality used to mean compromise. Not anymore. We integrate rigorous ADA compliance with high-end residential design.
                </p>
              </ImmersiveSlide>
            </motion.div>
          )}

          {/* SLIDE 2: RAMPS */}
          {currentSlide === 2 && (
            <motion.div key="slide2" className="absolute inset-0" exit={{ opacity: 0 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ImmersiveSlide videoSrc="/videos/video3.mp4" posterSrc="/images/ramp.png" isActive={true}>
                <h2 className="text-6xl md:text-7xl font-bold mb-6">Custom Ramps.</h2>
                <p className="text-xl md:text-2xl font-light opacity-90 leading-relaxed max-w-2xl">
                  Precision-engineered wood and metal systems that blend naturally with your architecture.
                </p>
                <div className="mt-8 space-y-2 text-lg opacity-80 font-medium">
                  <p>• ADA Compliant Gradients</p>
                  <p>• Pressure-Treated Lumber / Aluminum</p>
                  <p>• Integrated Handrail Systems</p>
                </div>
              </ImmersiveSlide>
            </motion.div>
          )}

          {/* SLIDE 3: BATHROOMS */}
          {currentSlide === 3 && (
            <motion.div key="slide3" className="absolute inset-0" exit={{ opacity: 0 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ImmersiveSlide videoSrc="/videos/video4.mp4" posterSrc="/images/bathroom.png" isActive={true}>
                <h2 className="text-6xl md:text-7xl font-bold mb-6">Luxury Sanctuaries.</h2>
                <p className="text-xl md:text-2xl font-light opacity-90 leading-relaxed max-w-2xl">
                  Walk-in tubs and barrier-free showers that feel like a spa, not a clinic.
                </p>
                <button className="mt-8 px-8 py-3 rounded-full border border-white/40 bg-white/10 backdrop-blur-md hover:bg-white hover:text-black transition-all duration-300 font-semibold uppercase tracking-widest text-sm">
                  View Gallery
                </button>
              </ImmersiveSlide>
            </motion.div>
          )}

          {/* SLIDE 4: LIFTS */}
          {currentSlide === 4 && (
            <motion.div key="slide4" className="absolute inset-0" exit={{ opacity: 0 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ImmersiveSlide videoSrc="/videos/video5.mp4" posterSrc="/images/lift.png" isActive={true}>
                <h2 className="text-6xl md:text-7xl font-bold mb-6">Vertical Mobility.</h2>
                <p className="text-xl md:text-2xl font-light opacity-90 leading-relaxed max-w-2xl">
                  State-of-the-art lift systems for challenging elevations. Smooth. Silent. Reliable.
                </p>
              </ImmersiveSlide>
            </motion.div>
          )}

          {/* SLIDE 5: DECKS */}
          {currentSlide === 5 && (
            <motion.div key="slide5" className="absolute inset-0" exit={{ opacity: 0 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ImmersiveSlide videoSrc="/videos/video6.mp4" posterSrc="/images/deck.png" isActive={true}>
                <h2 className="text-6xl md:text-7xl font-bold mb-6">Decks & Living.</h2>
                <p className="text-xl md:text-2xl font-light opacity-90 leading-relaxed max-w-2xl">
                  Expand your horizon with custom multi-level decks tailored to your lifestyle.
                </p>
              </ImmersiveSlide>
            </motion.div>
          )}

          {/* SLIDE 6: CINEMATIC SHOWCASE (GRID) */}
          {currentSlide === 6 && (
            <motion.div key="slide6" className="absolute inset-0 bg-black flex items-center justify-center" exit={{ opacity: 0 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <CinematicGrid />
            </motion.div>
          )}

          {/* SLIDE 7: CONTACT */}
          {currentSlide === 7 && (
            <motion.div key="slide7" className="absolute inset-0 bg-black flex items-center justify-center p-20 text-center" exit={{ opacity: 0 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="z-10">
                <p className="text-sm tracking-[0.4em] uppercase opacity-60 mb-8">Ready to Start?</p>
                <h1 className="text-7xl md:text-9xl font-bold text-[#d4af37] mb-8">Let's Build.</h1>
                <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mb-8"></div>
                <p className="text-xl font-light">(555) 123-4567</p>
                <p className="text-lg opacity-60 mt-2">info@delightfulservices.com</p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-10 right-10 flex gap-4 z-50">
        <button onClick={prevSlide} className="p-4 rounded-full bg-white/10 hover:bg-white hover:text-black hover:scale-110 transition-all backdrop-blur-md border border-white/20">
          <ChevronLeft size={24} />
        </button>
        <button onClick={nextSlide} className="p-4 rounded-full bg-white/10 hover:bg-white hover:text-black hover:scale-110 transition-all backdrop-blur-md border border-white/20">
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-[#d4af37] transition-all duration-500 ease-out" style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }} />

    </main>
  );
}
