import React, { useState } from "react";
import "./Home.css";
import Header from "../../components/Header/Header";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import OurChef from "../../components/OurChef/OurChef";
import AboutUs from "../../components/AboutUs/AboutUs";
import ButtonScrollTop from "../../components/ButtonScrollTop/ButtonScrollTop";
import { assets } from "../../assets/assets";

const Home = () => {
  const [category, setCategory] = useState("All");

  return (
    <div className="home">
      <img className="hero-img" src={assets.hero} alt="hero-img" />
      <img className="mobile-hero-img" src={assets.hero_mobile} alt="mobile-hero-img" />

      <Header />
      <ExploreMenu category={category} setCategory={setCategory}/>
      <FoodDisplay category={category}/>
      <AboutUs/>
      <OurChef/>
      <ButtonScrollTop/>
    </div>
  );
};

export default Home;
