import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

const ThemeContext = createContext({ theme: "dark", toggleTheme: () => {} });

const STORAGE_KEY = "theme";

const applyTheme = (t) => {
  document.documentElement.setAttribute("data-theme", t);
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark") return saved;
      return document.documentElement.getAttribute("data-theme") || "dark";
    } catch (_) {
      return "dark";
    }
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try { localStorage.setItem(STORAGE_KEY, next); } catch (_) {}
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
