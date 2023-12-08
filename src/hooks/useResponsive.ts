import { useEffect, useState } from "react";

interface ResponsiveState {
  isTablet: boolean;
  isMobile: boolean;
}

const useResponsive = (): ResponsiveState => {
  const [screens, setScreens] = useState<ResponsiveState>({
    isTablet: false,
    isMobile: false,
  });

  useEffect(() => {
    const handleResize = (): void => {
      if (window.innerWidth >= 1200) {
        setScreens({
          isTablet: false,
          isMobile: false,
        });
      } else if (window.innerWidth >= 991) {
        setScreens({
          isTablet: false,
          isMobile: false,
        });
      } else if (window.innerWidth >= 768 && window.innerHeight <= 991) {
        setScreens({
          isTablet: true,
          isMobile: false,
        });
      } else {
        setScreens({
          isTablet: false,
          isMobile: true,
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return screens;
};

export default useResponsive;
