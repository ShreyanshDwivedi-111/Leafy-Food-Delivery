import React, { useEffect, useState } from "react";
import "./ButtonScrollTop.css";
import { ChevronUpIcon } from "@heroicons/react/24/outline";

const ButtonScrollTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        setIsVisible(window.scrollY > 300);
    };

  // Scroll the page to the top when button is clicked
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [])

  return (
    <>
      <div
        className={`scroll-to-top ${isVisible ? "fade-in" : "fade-out"}`}
        onClick={scrollToTop}
      >
        <ChevronUpIcon className="scroll-icon" />
      </div>
    </>
  );
};

export default ButtonScrollTop;
