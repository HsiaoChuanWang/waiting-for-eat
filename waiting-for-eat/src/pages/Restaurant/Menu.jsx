/* eslint-disable react/prop-types */
import { AnimatePresence, motion } from "framer-motion";
import { wrap } from "popmotion";
import { useState } from "react";
import { CgCloseO } from "react-icons/cg";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";

const variants = {
  enter: (direction) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

const Menu = ({ images, position, setDisplay }) => {
  const [[page, direction], setPage] = useState([position, 0]);
  if (!images?.length) return null;

  const imageIndex = wrap(0, images.length, page);

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  return (
    <div className="fixed left-0 top-0 z-20 flex h-screen w-screen items-center justify-center bg-black bg-opacity-70">
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          className="z-30 h-[800px] phone:h-72 tablet:h-[450px] laptop:h-[600px]"
          key={page}
          src={images[imageIndex]}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 1.2 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
        />
      </AnimatePresence>

      <div className="absolute z-40">
        <div className="flex w-[1200px] justify-between phone:w-96 tablet:w-[640px] laptop:w-[900px]">
          <div
            className="prev cursor-pointer text-5xl text-white phone:text-4xl"
            onClick={() => paginate(-1)}
          >
            <FaChevronCircleLeft />
          </div>
          <div
            className="next cursor-pointer text-5xl text-white phone:text-4xl"
            onClick={() => paginate(1)}
          >
            <FaChevronCircleRight />
          </div>
        </div>
      </div>

      <div className="absolute z-30 cursor-pointer pb-[85vh] pl-[70vw] text-5xl text-white phone:pb-[45vh] phone:text-4xl tablet:pb-[55vh] laptop:pb-[70vh]">
        <CgCloseO
          onClick={() => {
            setDisplay(false);
          }}
        />
      </div>
    </div>
  );
};

export default Menu;
