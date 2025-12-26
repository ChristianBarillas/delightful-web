"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

interface ImmersiveSlideProps {
  videoSrc: string;
  posterSrc: string;
  children: React.ReactNode;
  isActive: boolean;
}

export default function ImmersiveSlide({
  videoSrc,
  posterSrc,
  children,
  isActive,
}: ImmersiveSlideProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Optimization: Only play video when slide is active
  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(() => { });
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0; // Reset for next view
      }
    }
  }, [isActive]);

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-black">
      {/* Video Background */}
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{
          opacity: 1,
          scale: isActive ? 1.0 : 1.1
        }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          poster={posterSrc}
          loop
          muted
          playsInline
          onLoadedData={() => setIsLoaded(true)}
        >
          <source src={videoSrc} type="video/mp4" />
          {/* Add WebM if available, but MP4 is primary */}
        </video>

        {/* Loading Overlay (fades out when video loads) */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-black z-10" />
        )}
      </motion.div>

      {/* Scrim Overlay */}
      <div className="absolute bottom-0 left-0 w-full h-3/4 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 pointer-events-none" />

      {/* Floating Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 40 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="relative z-20 h-full flex flex-col justify-end p-12 md:p-20 max-w-4xl"
      >
        {children}
      </motion.div>
    </div>
  );
}
