import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

const RootLayout = () => {
  const location = useLocation(); // Keep this for the key

  return (
    <>
      <Toaster position="top-right" />
      {/* AnimatePresence will now just watch for the Outlet to change,
        and let the page itself handle the animation.
        We provide the key here so AnimatePresence knows the component has changed.
      */}
      <AnimatePresence mode="wait" initial={false}>
        <Outlet key={location.pathname} />
      </AnimatePresence>
    </>
  );
};

export default RootLayout;