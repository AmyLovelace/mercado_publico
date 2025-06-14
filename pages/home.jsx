import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useScrollContext } from "../src/context/ScrollContext";
import Hero from '../src/components/Hero/Hero'
import BusquedaLicitaciones from "../src/components/LicitacionesList/LicitacionesList";
import AboutUsSection from "../src/components/AboutUs/AboutUsSection";
const Home = () => {
  const { setActiveSection,sectionRefs } = useScrollContext();
  const [selCodigo, setSelCodigo] = useState(null);
  const ticket ='AC3A098B-4CD0-41AF-81A5-41284248419B'
  useEffect(() => {
    const sections = [
      { id: "Inicio", ref: sectionRefs.Inicio },
      { id: "Búsqueda", ref: sectionRefs.Búsqueda },
      { id: "Licitaciones", ref: sectionRefs.Licitaciones }


    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = sections.find(s => s.ref.current === entry.target)?.id;
            if (sectionId) {
              setActiveSection(sectionId);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach(({ ref }) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => {
      sections.forEach(({ ref }) => {
        if (ref.current) observer.unobserve(ref.current);
      });
    };
  }, [setActiveSection]);
  
  return (
    <Box component={'div'} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
         <Hero id="Inicio" ref={sectionRefs.Inicio}/>
         <AboutUsSection id="Licitaciones" ref={sectionRefs.Licitaciones}/>
         <BusquedaLicitaciones id="Búsqueda" ref={sectionRefs.Búsqueda} ticket={ticket} onSelect={setSelCodigo} />  
    </Box>
  );
}

export default Home;