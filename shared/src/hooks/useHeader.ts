
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useRef, useState } from "react";

export function useHeader() {
    const [showAppBar, setShowAppBar] = useState(true);
    const lastScrollY = useRef(0);
    const ticking = useRef(false);
    const threshold = 72;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down(767));

    React.useEffect(() => {
        const handleScroll = () => {
            if (!ticking.current) {
                window.requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;
                    const scrollDown = currentScrollY > lastScrollY.current;

                    // Only for mobile
                    if (isMobile) {
                        if (scrollDown && currentScrollY > threshold) {
                            setShowAppBar(false);
                        } else if (!scrollDown) {
                            setShowAppBar(true);
                        }
                    }

                    lastScrollY.current = currentScrollY;
                    ticking.current = false;
                });

                ticking.current = true;
            }
        };

        const handleResize = () => {
            // If switching to desktop, always show appbar
            if (!isMobile) {
                setShowAppBar(true);
            }
        };

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleResize);

        // Initial check
        if (!isMobile) {
            setShowAppBar(true);
        }

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
        };
    }, [isMobile]);

    return {
        showAppBar
    }
}