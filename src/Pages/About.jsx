

import React from "react";

import LearnScopik from "/src/Components/AboutComponents/LearnScopik.jsx";
import Partners from "/src/Components/HomeComponents/Partners.jsx";
import Learning from "/src/Components/ReusableComponents/Learning.jsx";
import ScopikAdvantages from "/src/Components/AboutComponents/Advantage";
import Stats from "/src/Components/AboutComponents/Stats";
import Policy from "/src/Components/AboutComponents/Policy";
import ScopikCard from "../Components/AboutComponents/ScopikCard";

function About() {
  return (
    <>
      <ScopikCard />
      <Partners />
      <Stats />
      <Policy />
      <Learning />
      <ScopikAdvantages />
    
    </>
  );
};

export default About;
