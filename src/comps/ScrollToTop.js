import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import requestAnimationFrame from 'raf'

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        requestAnimationFrame(() => {
            window.scrollTo(0, 0);
        })
    }, [pathname]);

    return null;
}