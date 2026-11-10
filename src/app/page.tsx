import { publicCourses } from "@/lib/repo/courses";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import CoursesSection from "@/components/CoursesSection";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import Navigation from "@/components/Navigation";
import ServicesSection from "@/components/ServicesSection";
import TestimonialsSection from "@/components/TestimonialsSection";

export const dynamic = "force-dynamic";

export default async function Home() {
  const courseList = await publicCourses();
  return (
    <div className="min-h-screen bg-white text-ink">
      <Navigation />
      <main>
        <HeroSection />
        <CoursesSection courses={courseList} />
        <ServicesSection />
        <AboutSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer courses={courseList} />
    </div>
  );
}
