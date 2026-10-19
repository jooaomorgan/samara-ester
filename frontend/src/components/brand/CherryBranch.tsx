import { motion, useReducedMotion } from "framer-motion";

export function CherryBranch({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    show: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: reduce ? { duration: 0 } : { pathLength: { delay: 0.3 + i * 0.25, duration: 1.6, ease: "easeInOut" }, opacity: { delay: 0.3 + i * 0.25, duration: 0.3 } },
    }),
  };
  const blossom = (cx: number, cy: number, r: number, i: number) => (
    <motion.g key={`${cx}-${cy}`} custom={i} variants={draw} initial="hidden" animate="show" stroke="currentColor" strokeWidth="1" fill="none">
      {[0, 72, 144, 216, 288].map((a) => (
        <motion.ellipse key={a} cx={cx} cy={cy - r} rx={r * 0.45} ry={r} transform={`rotate(${a} ${cx} ${cy})`} variants={draw} custom={i} />
      ))}
      <circle cx={cx} cy={cy} r={r * 0.25} fill="var(--cherry)" stroke="none" />
    </motion.g>
  );
  return (
    <svg viewBox="0 0 600 420" className={className} aria-hidden="true" focusable="false">
      <motion.path d="M620 20C520 60 440 150 400 250c-20 50-40 90-90 130" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" variants={draw} custom={0} initial="hidden" animate="show" />
      <motion.path d="M470 150c-40-10-80 0-120 30" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" variants={draw} custom={1} initial="hidden" animate="show" />
      <motion.path d="M405 240c30 10 50 40 55 80" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" variants={draw} custom={2} initial="hidden" animate="show" />
      <motion.path d="M350 330c-30-20-60-20-90 0" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" variants={draw} custom={3} initial="hidden" animate="show" />
      {blossom(350, 180, 11, 2)}
      {blossom(460, 230, 9, 3)}
      {blossom(300, 345, 10, 4)}
      {blossom(520, 90, 8, 1)}
    </svg>
  );
}
