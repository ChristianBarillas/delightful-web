"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion, usePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Volume2, VolumeX, Play } from "lucide-react";

// --- HELPERS ---

const TEXT_VARIANTS = {
  hidden: { y: 100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
  }
};

const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.2 } // Faster stagger for "Robust" feel
  }
};

const AnimatedText = ({ text, className }: { text: string, className?: string }) => {
  const words = text.split(" ");
  return (
    <motion.div
      className={`flex flex-wrap gap-x-[0.2em] ${className}`}
      variants={STAGGER_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, i) => (
        <motion.span key={i} variants={TEXT_VARIANTS} className="inline-block origin-top-left">
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

// --- SLIDE ITEM WITH AUDIO CROSSFADE & 3D DEPTH ---
const SlideItem = ({ data, hasStarted, isMuted }: { data: any, hasStarted: boolean, isMuted: boolean }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPresent, safeToRemove] = usePresence(); // MAGIC HOOK for Crossfade

  // --- AUDIO CROSSFADE LOGIC ---
  useEffect(() => {
    if (!hasStarted) return;

    const video = videoRef.current;
    if (!video) return;

    if (isPresent) {
      // FADE IN
      video.volume = 0;
      if (!isMuted) {
        let vol = 0;
        const fadeIn = setInterval(() => {
          if (!video) { clearInterval(fadeIn); return; }
          vol = Math.min(vol + 0.05, 1);
          video.volume = vol;
          if (vol >= 1) clearInterval(fadeIn);
        }, 50); // 1s fade in
        return () => clearInterval(fadeIn);
      }
    } else {
      // FADE OUT (Exit)
      if (!isMuted) {
        let vol = video.volume;
        const fadeOut = setInterval(() => {
          if (!video) {
            clearInterval(fadeOut);
            safeToRemove(); // Force remove if ref lost
            return;
          }
          vol = Math.max(vol - 0.1, 0); // Fast Fade Out (0.5s approx)
          video.volume = vol;
          if (vol <= 0) {
            clearInterval(fadeOut);
            safeToRemove(); // TELLS REACT: "OK to remove me now"
          }
        }, 30);
        return () => clearInterval(fadeOut);
      } else {
        safeToRemove(); // Immediate remove if muted
      }
    }
  }, [isPresent, hasStarted, safeToRemove, isMuted]);

  // Sync Mute toggle while playing
  useEffect(() => {
    if (videoRef.current && isPresent) {
      videoRef.current.muted = !hasStarted || isMuted;
      // Reset volume to 1 if unmuting mid-playback
      if (hasStarted && !isMuted) videoRef.current.volume = 1;
    }
  }, [isMuted, hasStarted, isPresent]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* 3D Container */}
      <div className="absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
          className="w-full h-full object-cover scale-105" // Slight overscale for parallax
          src={data.video}
          poster={data.poster}
          autoPlay
          loop
          muted={!hasStarted || isMuted} // Init state
          playsInline
        />
        {/* Heavy Gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      {/* "THE MONOLITH" Layout: Left Aligned, Massive */}
      <div className="absolute inset-0 flex flex-col justify-end md:justify-center p-8 md:pl-24 pb-32 md:pb-0 z-20 pointer-events-none">
        <div className="max-w-4xl pointer-events-auto">
          {data.id === 0 ? (
            <>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 100 }}
                transition={{ duration: 0.8 }}
                className="h-1 bg-[#d4af37] mb-8"
              />
              <p className="text-[#d4af37] tracking-[0.5em] uppercase font-light mb-4">Portfolio 2024</p>
              <AnimatedText
                text={data.title}
                className="text-7xl md:text-[9rem] font-black uppercase leading-[0.8] tracking-tighter mb-4 text-white drop-shadow-2xl"
              />
              <AnimatedText
                text={data.highlight}
                className="text-7xl md:text-[9rem] font-black uppercase leading-[0.8] tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#8a6e15]"
              />
            </>
          ) : (
            <>
              <h2 className="text-5xl md:text-8xl font-black uppercase leading-[0.9] tracking-tight mb-8 drop-shadow-lg">
                <AnimatedText text={data.title} />
              </h2>
              <motion.div
                className="w-20 h-1 bg-[#d4af37] mb-8"
                initial={{ width: 0 }}
                animate={{ width: 80 }}
                transition={{ delay: 0.5 }}
              />
              <p className="text-xl md:text-2xl font-light leading-relaxed max-w-2xl opacity-90 text-gray-200">
                {data.desc}
              </p>
            </>
          )}

          {data.isLast && (
            <motion.a
              href="https://delightfulservices.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-12 px-12 py-5 bg-[#d4af37] hover:bg-white text-black font-bold tracking-widest uppercase transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(212,175,55,0.6)]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Visit Website
            </motion.a>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [[slide, direction], setSlide] = useState([0, 0]);
  const [hasStarted, setHasStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const totalSlides = 7;

  // --- DATA ---
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
      title: "Seamless",
      highlight: "",
      desc: "Integrating rigorous ADA compliance with high-end residential design aesthetics."
    },
    {
      id: 2,
      video: "/videos/v3.mp4",
      poster: "/images/ramp.png",
      title: "Custom Ramps",
      highlight: "",
      desc: "Precision-engineered wood and metal systems that blend naturally with your architecture."
    },
    {
      id: 3,
      video: "/videos/v4.mp4",
      poster: "/images/bathroom.png",
      title: "Sanctuaries",
      highlight: "",
      desc: "Walk-in tubs and barrier-free showers designed for tranquility, not just utility."
    },
    {
      id: 4,
      video: "/videos/v5.mp4",
      poster: "/images/lift.png",
      title: "Vertical Line",
      highlight: "",
      desc: "State-of-the-art stair lifts and VPL systems overcoming every elevation challenge."
    },
    {
      id: 5,
      video: "/videos/v6.mp4",
      poster: "/images/deck.png",
      title: "Decks & Living",
      highlight: "",
      desc: "Expanding your horizon with custom multi-level outdoor living spaces."
    },
    {
      id: 6,
      video: "/videos/v7.mp4",
      poster: "/images/deck.png",
      title: "Let's Build",
      highlight: "",
      desc: "+1 470-888-2724 • lopezjc@delightfulservices.com",
      isLast: true
    },
  ];

  const getNextIndex = (current: number) => (current + 1) % totalSlides;
  const getPrevIndex = (current: number) => (current - 1 + totalSlides) % totalSlides;
  const preloadIndices = [getNextIndex(slide), getPrevIndex(slide)];

  // --- 3D DOORWAY TRANSITIONS ---
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 1,
      scale: 1.1, // Start zoomed in
      rotateY: direction > 0 ? 45 : -45, // 3D entering angle
      zIndex: 1,
      filter: "brightness(0.5)",
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      zIndex: 2,
      filter: "brightness(1)",
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 },
        scale: { duration: 1, ease: "easeOut" },
        rotateY: { duration: 0.8, ease: "easeOut" }
      } as const
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0, // Fades out visually while audio fades logically
      scale: 0.9, // Recedes
      rotateY: direction < 0 ? 45 : -45, // 3D exiting angle
      zIndex: 0,
      filter: "brightness(0.2)",
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.8 }, // Slower visual fade to match audio
        scale: { duration: 0.8 },
        rotateY: { duration: 0.8 }
      } as const
    })
  };

  const paginate = useCallback((newDirection: number, index?: number) => {
    setSlide(([prev, currentDir]) => {
      let next = index !== undefined ? index : prev + newDirection;
      if (next < 0) next = totalSlides - 1;
      if (next >= totalSlides) next = 0;
      return [next, newDirection];
    });
  }, [totalSlides]);

  const startExperience = () => setHasStarted(true);
  const toggleMute = () => setIsMuted(!isMuted);

  // --- KEYBOARD & WHEEL (Throttled) ---
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
      className="h-[100dvh] w-screen overflow-hidden bg-[#0a0a0a] text-white relative flex font-sans perspective-[1000px]" // Added perspective for 3D
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >

      {/* Smart Preloader */}
      <div className="hidden">
        {preloadIndices.map(idx => (
          <video key={`preload-${idx}`} src={slides[idx].video} preload="auto" muted playsInline />
        ))}
      </div>

      {/* START GATE */}
      {!hasStarted && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl transition-opacity duration-1000">
          <button
            onClick={startExperience}
            className="group relative flex flex-col items-center gap-8"
          >
            <div className="absolute inset-0 rounded-full bg-[#d4af37]/20 blur-[50px] animate-pulse" />
            <div className="relative w-32 h-32 rounded-full border border-[#d4af37]/30 flex items-center justify-center group-hover:scale-110 transition-all duration-700 bg-black/50 backdrop-blur-md">
              <Play size={40} className="ml-2 text-[#d4af37] fill-[#d4af37]" />
            </div>
            <span className="tracking-[0.8em] text-sm font-bold text-[#d4af37] uppercase">PORTAFOLIO</span>
          </button>
        </div>
      )}

      {/* MAIN CONTENT STAGE */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={slide}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 w-full h-full shadow-2xl will-change-transform" // Hardware Acceleration
        >
          <SlideItem
            data={slides[slide]}
            hasStarted={hasStarted}
            isMuted={isMuted}
          />
        </motion.div>
      </AnimatePresence>

      {/* INTERACTIVE SEGMENTED NAVIGATION */}
      <div className="absolute top-10 left-0 right-0 z-50 flex justify-center gap-1.5 px-6 md:px-20 cursor-pointer pointer-events-auto">
        {slides.map((s, i) => (
          <div
            key={i}
            className="group h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden transition-all hover:h-2"
            onClick={() => paginate(i - slide, i)}
          >
            <motion.div
              className="h-full bg-[#d4af37] shadow-[0_0_15px_#d4af37]"
              initial={{ width: "0%" }}
              animate={{ width: i === slide ? "100%" : "0%" }}
              transition={{ duration: 0.3 }}
            />
            <div className="h-full w-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>

      {/* BOTTOM CONTROL CAPSULE */}
      {hasStarted && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, type: "spring" }}
          className="absolute bottom-10 right-10 z-50 pointer-events-auto hidden md:block"
        >
          {/* Desktop: Minimal Corner Controls */}
          <div className="flex items-center gap-3 p-2 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl">
            <button onClick={toggleMute} className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/10 transition-all text-[#d4af37]">
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <div className="w-[1px] h-6 bg-white/10" />
            <button onClick={() => paginate(-1)} className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/10 transition-all text-white">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => paginate(1)} className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/10 transition-all text-white">
              <ChevronRight size={20} />
            </button>
          </div>
        </motion.div>
      )}

      {/* MOBILE CONTROL BAR (Bottom Sheet Style) */}
      {hasStarted && (
        <div className="absolute bottom-0 inset-x-0 p-6 z-50 md:hidden bg-gradient-to-t from-black via-black/80 to-transparent pb-10">
          <div className="flex items-center justify-between">
            <button onClick={toggleMute} className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-[#d4af37]">
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <div className="flex gap-4">
              <button onClick={() => paginate(-1)} className="w-14 h-14 flex items-center justify-center rounded-full bg-white/10 text-white active:bg-white/30">
                <ChevronLeft size={24} />
              </button>
              <button onClick={() => paginate(1)} className="w-14 h-14 flex items-center justify-center rounded-full bg-[#d4af37] text-black active:scale-95 transition-transform font-bold">
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
