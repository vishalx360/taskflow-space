import { motion } from "framer-motion";
import React from "react";

export const simpleVariants = {
  enter: {
    y: 10,
    opacity: 0,
  },
  center: {
    y: 0,
    opacity: 1,
  },
  exit: {
    y: -10,
    opacity: 0,
  },
};
function Fade({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={simpleVariants}
      initial="enter"
      animate="center"
      exit="exit"
      // custom={direction}
      transition={{
        x: { type: "inertia", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }}
    >
      {children}
    </motion.div>
  );
}

export default Fade;
