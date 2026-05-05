import { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ThemeProvider } from "./contexts/ThemeContext";
import ScrollProgress from "./components/ScrollProgress";
import BackgroundScene from "./components/BackgroundScene";
import CustomCursor from "./components/CustomCursor";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import GitHubRepos from "./components/GitHubRepos";
import Skills from "./components/Skills";
import Education from "./components/Education";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { Toaster } from "./components/ui/sonner";

const Home = () => {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal-line");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="app-shell grain">
      <BackgroundScene />
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      <main style={{ position: "relative", zIndex: 5 }}>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <GitHubRepos />
        <Skills />
        <Education />
        <Contact />
      </main>
      <Footer />
      <Toaster position="bottom-right" />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
