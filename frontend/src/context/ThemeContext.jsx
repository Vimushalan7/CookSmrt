import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [dark, setDark] = useState(() => localStorage.getItem('cooksmrt_theme') === 'dark');

    useEffect(() => {
        document.body.classList.toggle('dark', dark);
        localStorage.setItem('cooksmrt_theme', dark ? 'dark' : 'light');
    }, [dark]);

    const toggle = () => setDark((d) => !d);

    return <ThemeContext.Provider value={{ dark, toggle }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
