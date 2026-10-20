import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, CustomEase);
CustomEase.create("premium", "0.4, 0, 0.2, 1");

export const DUR = { fast: 0.35, base: 0.5, slow: 0.6 };
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

export { gsap, ScrollTrigger };
