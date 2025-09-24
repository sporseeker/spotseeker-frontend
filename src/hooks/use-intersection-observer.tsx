import { useEffect, useState, useRef, RefObject, useCallback } from "react";
import { useIsMobile } from "./use-mobile";

// Debounce helper function
function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;

  return function (...args: Parameters<T>): void {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

const useElementIntersection = (
  element1Ref: RefObject<HTMLElement>, // Keeping this as a ref
  element2RefOrId: RefObject<HTMLElement> | string, // This can be a ref or an id string
  threshold: number = 0,
  useMobileCondition: boolean = true,
  mobileBreakPoint?: number,
): boolean => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const isMobile = useIsMobile(mobileBreakPoint);
  const prevIsIntersecting = useRef(isIntersecting); // Store the previous value of intersection

  // A helper to get element2 either by ref or id
  const getElement2 = useCallback(() => {
    if (typeof element2RefOrId === "string") {
      return document.getElementById(element2RefOrId); // Get element by id
    }
    return element2RefOrId.current; // Get element by ref
  }, [element2RefOrId]);

  const checkIntersection = useCallback(() => {
    const element2 = getElement2();
    if (element1Ref.current && element2) {
      const rect1 = element1Ref.current.getBoundingClientRect();
      const rect2 = element2.getBoundingClientRect();

      const intersecting =
        rect1.left < rect2.right - threshold &&
        rect1.right > rect2.left + threshold &&
        rect1.top < rect2.bottom - threshold &&
        rect1.bottom > rect2.top + threshold;

      // Only update state if the intersection status has changed
      if (prevIsIntersecting.current !== intersecting) {
        prevIsIntersecting.current = intersecting;
        setIsIntersecting(intersecting);
      }
    }
  }, [element1Ref, getElement2, threshold]);

  useEffect(() => {
    if (useMobileCondition && isMobile) return;

    const element2 = getElement2();
    const resizeObserver = new ResizeObserver(() => {
      debounce(checkIntersection, 20)(); // Debounced intersection check
    });

    if (element1Ref.current) resizeObserver.observe(element1Ref.current);
    if (element2) resizeObserver.observe(element2);

    checkIntersection(); // Initial intersection check

    const handleScroll = debounce(() => checkIntersection(), 20); // Debounced scroll handling
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, [
    element1Ref,
    getElement2,
    threshold,
    useMobileCondition,
    isMobile,
    checkIntersection,
  ]);

  return isIntersecting;
};

export default useElementIntersection;
