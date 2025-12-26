"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, ChevronLeft, Volume2, VolumeX, Play } from "lucide-react";

// --- SUB-COMPONENT FOR AUDIO CONTROL ---
// This handles the "Mute on Exit" logic via useEffect cleanup
const SlideItem = ({ data, hasStarted, isMuted }: { data: any, hasStarted: boolean, isMuted: boolean }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // When this component UNMOUNTS (starts animating out), strictly MUTE the video.
    // This prevents audio overlap during the 0.5s transition.
    return () => {
      if (videoRef.current) {
        videoRef.current.muted = true;
      }
    };
  }, []);

  // Also sync mute state while mounted
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = !hasStarted || isMuted;
    }
  }, [hasStarted, isMuted]);

  return (
    <div className="relative w-full h-full">
      {/* Video with Ken Burns Effect */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        animate={{ scale: 1.1 }}
        transition={{ duration: 20, ease: "linear" }}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src={data.video}
          poster={data.poster}
          autoPlay
          loop
          muted={!hasStarted || isMuted}
          playsInline
        />
      </motion.div>

      {/* Cinematic Scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/50" />

      {/* Text Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10 pointer-events-none pb-32">
        <motion.div
          className="pointer-events-auto"
          initial={{ y: 80, opacity: 0, filter: "blur(20px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {data.id === 0 ? (
            <>
              <p className="text-xl md:text-2xl font-light uppercase tracking-[0.4em] mb-6 opacity-80 text-[#d4af37]">Portfolio 2024</p>
              <h1 className="text-7xl md:text-[10rem] font-extrabold tracking-tighter leading-[0.85] mb-6 drop-shadow-2xl">
                Delightful<br /><span className="text-transparent bg-clip-text bg-gradient-to-b from-[#d4af37] to-[#8a6e15]">{data.highlight}</span>.
              </h1>
              <p className="text-lg opacity-60 tracking-widest uppercase">Excellence in Motion.</p>
            </>
          ) : (
            <>
              <div className="w-[1px] bg-[#d4af37] h-20 mx-auto mb-10 hidden md:block opacity-50" />
              <h2 className="text-5xl md:text-8xl font-bold mb-8 max-w-5xl drop-shadow-lg leading-tight">
                {data.title}
              </h2>
              <p className="text-lg md:text-2xl font-light opacity-80 max-w-3xl leading-relaxed mx-auto text-shadow-sm font-serif italic">
                "{data.desc}"
              </p>
            </>
          )}

          {/* Final Contact Button */}
          {data.isLast && (
            <motion.div
              className="mt-12"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a
                href="https://delightfulservices.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-12 py-5 bg-[#d4af37] text-black font-bold tracking-widest uppercase text-sm rounded-full hover:bg-white transition-all shadow-[0_0_40px_rgba(212,175,55,0.4)]"
              >
                Visit Website
              </a>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default function Home() {
  const [[slide, direction], setSlide] = useState([0, 0]);
  const [hasStarted, setHasStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const totalSlides = 7;

  // Content Data
  const slides = [
    {
      id: 0,
      video: "/videos/v1.mp4",
      poster: "/images/deck.png",
      title: "Delightful",
      highlight: "Services",
      desc: "Excellence in Motion."
    },
    {
      id: 1,
      video: "/videos/v2.mp4",
      poster: "/images/ramp.png",
      title: "Seamless Accessibility.",
      desc: "We integrate rigorous ADA compliance with high-end residential design."
    },
    {
      id: 2,
      video: "/videos/v3.mp4",
      poster: "/images/ramp.png",
      title: "Custom Ramps.",
      desc: "Precision-engineered wood and metal systems that blend naturally with your architecture."
    },
    {
      id: 3,
      video: "/videos/v4.mp4",
      poster: "/images/bathroom.png",
      title: "Luxury Sanctuaries.",
      desc: "Walk-in tubs and barrier-free showers that feel like a spa, not a clinic."
    },
    {
      id: 4,
      video: "/videos/v5.mp4",
      poster: "/images/lift.png",
      title: "Vertical Mobility.",
      desc: "State-of-the-art stair lifts and VPL systems for challenging elevations."
    },
    {
      id: 5,
      video: "/videos/v6.mp4",
      poster: "/images/deck.png",
      title: "Decks & Living.",
      desc: "Expand your horizon with custom multi-level decks tailored to your lifestyle."
    },
    {
      id: 6,
      video: "/videos/v7.mp4",
      poster: "/images/deck.png",
      title: "Let's Build.",
      desc: "+1 470-888-2724 • lopezjc@delightfulservices.com",
      isLast: true
    },
  ];

  const getNextIndex = (current: number) => (current + 1) % totalSlides;
  const getPrevIndex = (current: number) => (current - 1 + totalSlides) % totalSlides;
  const preloadIndices = [getNextIndex(slide), getPrevIndex(slide)];

  // --- LUXURY ANIMATION VARIANTS (Deep Push) ---
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-20%",
      opacity: 0,
      scale: 1.1,
      zIndex: 1,
      filter: "brightness(0.5) blur(10px)"
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      zIndex: 2,
      filter: "brightness(1) blur(0px)",
      transition: {
        x: { type: "spring", stiffness: 400, damping: 40 },
        opacity: { duration: 0.5 },
        scale: { duration: 0.8, ease: "easeOut" },
        filter: { duration: 0.5 }
      } as const
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-20%",
      opacity: 0,
      scale: 0.95,
      zIndex: 0,
      filter: "brightness(0.3) blur(5px)",
      transition: {
        x: { type: "spring", stiffness: 400, damping: 40 },
        opacity: { duration: 0.6 },
        filter: { duration: 0.4 }
      } as const
    })
  };

  const paginate = useCallback((newDirection: number) => {
    setSlide(([prev, currentDir]) => {
      let next = prev + newDirection;
      if (next < 0) next = totalSlides - 1;
      if (next >= totalSlides) next = 0;
      return [next, newDirection];
    });
  }, [totalSlides]);

  const startExperience = () => setHasStarted(true);
  const toggleMute = () => setIsMuted(!isMuted);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") paginate(1);
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") paginate(-1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [paginate]);

  useEffect(() => {
    let lastCall = 0;
    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastCall < 600) return;
      if (Math.abs(e.deltaY) > 20) {
        lastCall = now;
        if (e.deltaY > 0) paginate(1);
        else paginate(-1);
      }
    };
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [paginate]);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const dist = touchStart - e.changedTouches[0].clientX;
    if (dist > 50) paginate(1);
    if (dist < -50) paginate(-1);
  };

  return (
    <main
      className="h-[100dvh] w-screen overflow-hidden bg-black text-white relative flex items-center justify-center font-sans selection:bg-[#d4af37] selection:text-black"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >

      {/* High Performance Preloader */}
      <div className="hidden">
        {preloadIndices.map(idx => (
          <video
            key={`preload-${idx}`}
            src={slides[idx].video}
            preload="auto"
            muted
            playsInline
          />
        ))}
      </div>

      {/* START OVERLAY */}
      {!hasStarted && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl transition-opacity duration-1000">
          <button
            onClick={startExperience}
            className="group relative flex flex-col items-center gap-8 px-12 py-12 rounded-3xl"
          >
            <div className="absolute inset-0 rounded-full bg-[#d4af37]/20 blur-3xl animate-pulse" />
            <div className="relative w-32 h-32 rounded-full border-2 border-[#d4af37]/50 flex items-center justify-center group-hover:bg-[#d4af37] group-hover:scale-110 transition-all duration-500 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
              <Play size={48} className="ml-2 text-[#d4af37] group-hover:text-black transition-colors" />
            </div>
            <span className="tracking-[0.6em] text-lg font-light text-[#d4af37] group-hover:text-white transition-colors uppercase">PORTAFOLIO</span>
          </button>
        </div>
      )}

      {/* BACKGROUND & SLIDES */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={slide}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 w-full h-full shadow-2xl will-change-transform"
        >
          {/* Use Sub-Component to manage per-slide lifecycle (Mute on Exit) */}
          <SlideItem
            data={slides[slide]}
            hasStarted={hasStarted}
            isMuted={isMuted}
          />
        </motion.div>
      </AnimatePresence>

      {/* GLASS ISLAND HUD */}
      {hasStarted && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, type: "spring" }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
        >
          <div className="flex items-center gap-1 p-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl">
            <button onClick={() => paginate(-1)} className="p-4 hover:bg-white/20 rounded-full transition-colors text-white/80 hover:text-white">
              <ChevronLeft size={24} />
            </button>
            <div className="w-[1px] h-6 bg-white/10 mx-2" />
            <button onClick={toggleMute} className="w-14 h-14 flex items-center justify-center rounded-full hover:bg-white/20 transition-all">
              {isMuted ? <VolumeX size={20} className="text-white/50" /> : <Volume2 size={20} className="text-[#d4af37]" />}
            </button>
            <div className="w-[1px] h-6 bg-white/10 mx-2" />
            <button onClick={() => paginate(1)} className="p-4 hover:bg-white/20 rounded-full transition-colors text-white/80 hover:text-white">
              <ChevronRight size={24} />
            </button>
          </div>
        </motion.div>
      )}

      {/* Progress */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/5 z-50">
        <motion.div
          className="h-full bg-[#d4af37] shadow-[0_0_20px_#d4af37]"
          initial={{ width: "0%" }}
          animate={{ width: `${((slide + 1) / totalSlides) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

    </main>
  );
}
