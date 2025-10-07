import { useState, useEffect } from 'react';

import { ThemeContext } from './Theme'; // This import is correct



// The useTheme hook has been REMOVED from this file.



export const ThemeProvider = ({ children }) => {

  const [theme, setTheme] = useState(() => {

    return localStorage.getItem('theme') || 'dark';

  });



  useEffect(() => {

    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    root.classList.add(theme);

    localStorage.setItem('theme', theme);

  }, [theme]);



  const toggleTheme = () => {

    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));

  };



  const value = {

    theme,

    toggleTheme,

  };



  return (

    <ThemeContext.Provider value={value}>

      {children}

    </ThemeContext.Provider>

  );

};