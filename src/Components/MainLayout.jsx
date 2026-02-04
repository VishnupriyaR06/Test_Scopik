// src/Layouts/MainLayout.jsx
import Header1 from "/src/Components/ReusableComponents/Header.jsx";
import Footer from "/src/Components/ReusableComponents/Footer.jsx";
import { Outlet } from "react-router-dom";


const MainLayout = () => {
  return (
    <>
      <Header1 />
      <Outlet />
      <Footer />
    </>
  );
};

export default MainLayout;
