"use client";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import MasterclassesSection from "@/components/MasterclassesSection";
import Navigation from "@/components/Navigation";
import ProgramsSection from "@/components/ProgramsSection";
import SchoolsSection from "@/components/SchoolsSection";
import StatsSection from "@/components/StatsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <HeroSection />
      
      <main>
        <SchoolsSection />
        {/* <ProgramsSection /> */}
        <AboutSection />
        <TestimonialsSection />
        <ContactSection />
        {/* <MasterclassesSection /> */}
        {/* <StatsSection /> */}
      </main>

      <Footer />
    </div>
  );
}
