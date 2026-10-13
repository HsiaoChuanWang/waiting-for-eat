/* eslint-disable react/prop-types */
import { ScrollShadow } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useState } from "react";
import Menu from "../Menu.jsx";
import noMenu from "../restaurantPictures/noMenu.png";

function RestaurantMenuSection({ images }) {
  const [position, setPosition] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="border-t-2 border-solid border-gray-300 pb-6">
        <h3 className="text-2xl font-bold text-[#ff6e06]">菜單</h3>
        <ScrollShadow orientation="horizontal" className="w-full">
          <div className=" flex w-[1000px] p-4">
            {images ? (
              images.map((picture, index) => (
                <div className="w-[200px] min-w-[200px]" key={index}>
                  <motion.img
                    whileHover={{
                      scale: 1.1,
                      transition: { duration: 0.15 },
                    }}
                    whileTap={{ scale: 0.9 }}
                    className="cursor-pointer px-2"
                    src={picture}
                    onClick={() => {
                      setPosition(index);
                      setIsOpen(true);
                    }}
                  />
                </div>
              ))
            ) : (
              <div className="flex h-32 items-center">
                <img src={noMenu} className="h-28" />
                <h4 className="text-lg font-bold text-gray-600">
                  暫無上傳菜單
                </h4>
              </div>
            )}
          </div>
        </ScrollShadow>
      </div>

      <div className={`${!isOpen && "hidden"}`}>
        <Menu
          images={images ?? []}
          position={position}
          setDisplay={setIsOpen}
        />
      </div>
    </>
  );
}

export default RestaurantMenuSection;
