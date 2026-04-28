import { motion } from 'framer-motion';

const pageTransitionVariants = {
  initial: { opacity: 0, y: 16, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -16, scale: 0.98 },
};

const pageTransitionTransition = {
  duration: 0.32,
  ease: [0.16, 1, 0.3, 1],
};

const PageTransition = ({ children, className = '', ...props }) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransitionVariants}
      transition={pageTransitionTransition}
      className={`page-transition-wrapper ${className}`}
      style={{
        willChange: 'opacity, transform',
        backfaceVisibility: 'hidden',
        WebkitFontSmoothing: 'antialiased',
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
