import useTheme from "/src/Hooks/ThemeHook.js";
import HeroSlider from "/src/Components/HomeComponents/HeroSlider";
import CourseCard from "/src/Components/HomeComponents/CourseCard.jsx";
import Future from "/src/Components/HomeComponents/LearningFuture";
import HomeCourse from "/src/Components/HomeComponents/HomeCourse.jsx";
import Partners from "/src/Components/HomeComponents/Partners.jsx";
import Student from "/src/Components/HomeComponents/Student.jsx";
import Blog from "/src/Components/HomeComponents/Blog.jsx";
import FaqSection from "/src/Components/HomeComponents/FAQ.jsx";
import Card from "/src/Components/HomeComponents/Card.jsx";
import Learning from "/src/Components/ReusableComponents/Learning.jsx";
import HomeBanner from "/src/Components/HomeComponents/HomeBanner.jsx";

export default function DarkHome() {
  const isDarkMode = useTheme();
  return (
    <>
      <HeroSlider />

      <HomeCourse />

      <Learning />

      <CourseCard />

      <Future />

      <Card />

     <div className="hidden sm:block">
      <HomeBanner />
      </div>


      <Partners />

      <div className={isDarkMode ? "bg-black" : "bg-white"}>
          <Blog />
      </div>

      <Student />

      <FaqSection />
    </>
  );
}