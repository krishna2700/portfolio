import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ui/ScrollProgress";
import {
  heroData,
  aboutData,
  experienceData,
  projectsData,
  skillsData,
} from "@/lib/data";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero data={heroData} about={aboutData} />
        <About data={aboutData} />
        <Experience data={experienceData} />
        <Projects data={projectsData} />
        <Skills data={skillsData} />
        <Contact data={aboutData} />
      </main>
      <Footer about={aboutData} />
    </>
  );
}
