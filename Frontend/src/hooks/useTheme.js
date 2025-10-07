import { useEffect, useState } from "react";



export function useTheme() {

  const [theme, setTheme] = useState(() => {

    return localStorage.getItem("theme") || "light";

  });



  useEffect(() => {

    const root = document.documentElement;

    if (theme === "dark") {

      root.classList.add("dark");

      root.classList.remove("light");

    } else {

      root.classList.add("light");

      root.classList.remove("dark");

    }

    localStorage.setItem("theme", theme);

  }, [theme]);



  return { theme, setTheme };

}

