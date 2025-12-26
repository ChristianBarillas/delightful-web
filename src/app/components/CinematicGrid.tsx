"use client";

import { motion } from "framer-motion";

export default function CinematicGrid() {
    const satellites = [
        { src: "/videos/video1.mp4", poster: "/images/deck.png" },
        { src: "/videos/video2.mp4", poster: "/images/ramp.png" },
        { src: "/videos/video3.mp4", poster: "/images/ramp.png" },
        { src: "/videos/video4.mp4", poster: "/images/bathroom.png" },
        { src: "/videos/video5.mp4", poster: "/images/lift.png" },
        { src: "/videos/video6.mp4", poster: "/images/deck.png" },
    ];

    return (
        <div className="w-full h-full p-8 md:p-12 relative z-20">
            <div className="grid grid-cols-4 grid-rows-3 gap-4 w-full h-full max-w-[1600px] mx-auto">

                {/* Satellites (Left) */}
                <div className="col-span-1 row-span-1 relative rounded-xl overflow-hidden border border-white/10 group">
                    <video src={satellites[0].src} poster={satellites[0].poster} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 grayscale group-hover:grayscale-0" muted loop playsInline autoPlay />
                </div>
                <div className="col-span-1 row-span-1 relative rounded-xl overflow-hidden border border-white/10 group">
                    <video src={satellites[1].src} poster={satellites[1].poster} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 grayscale group-hover:grayscale-0" muted loop playsInline autoPlay />
                </div>
                <div className="col-span-1 row-span-1 relative rounded-xl overflow-hidden border border-white/10 group">
                    <video src={satellites[2].src} poster={satellites[2].poster} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 grayscale group-hover:grayscale-0" muted loop playsInline autoPlay />
                </div>

                {/* HERO (Center) */}
                <div className="col-span-2 row-span-3 relative rounded-2xl overflow-hidden border-2 border-[#d4af37] shadow-2xl">
                    <video src="/videos/video7.mp4" poster="/images/deck.png" className="w-full h-full object-cover" muted loop playsInline autoPlay />
                    <div className="absolute bottom-8 left-8">
                        <h3 className="text-[#d4af37] text-2xl font-bold tracking-tight">Delightful Services</h3>
                        <p className="text-white text-sm tracking-[0.2em] uppercase">Excellence in Motion</p>
                    </div>
                </div>

                {/* Satellites (Right) - Flipped Logic for Grid */}
                <div className="col-span-1 row-span-1 relative rounded-xl overflow-hidden border border-white/10 group">
                    <video src={satellites[3].src} poster={satellites[3].poster} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 grayscale group-hover:grayscale-0" muted loop playsInline autoPlay />
                </div>
                <div className="col-span-1 row-span-1 relative rounded-xl overflow-hidden border border-white/10 group">
                    <video src={satellites[4].src} poster={satellites[4].poster} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 grayscale group-hover:grayscale-0" muted loop playsInline autoPlay />
                </div>
                <div className="col-span-1 row-span-1 relative rounded-xl overflow-hidden border border-white/10 group">
                    <video src={satellites[5].src} poster={satellites[5].poster} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 grayscale group-hover:grayscale-0" muted loop playsInline autoPlay />
                </div>

            </div>
        </div>
    );
}
