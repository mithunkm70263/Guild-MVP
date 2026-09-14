export const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.06 },
  },
};

export const cardHover = {
  rest: { y: 0, boxShadow: '0 16px 44px rgba(18, 18, 18, 0.05)' },
  hover: {
    y: -3,
    boxShadow: '0 20px 52px rgba(74, 124, 110, 0.12)',
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
  },
};

export const listItem = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};
