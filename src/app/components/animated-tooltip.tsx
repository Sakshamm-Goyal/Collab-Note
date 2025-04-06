import Image from 'next/image';
import React, { useState } from 'react';
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from 'framer-motion';
import stringToColor from '../lib/stringToColor';

export const AnimatedTooltip = ({
  items,
}: {
  items: {
    id: number;
    name: string;
    image: string;
  }[];
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0);
  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig
  );
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig
  );

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const halfWidth = event.currentTarget.offsetWidth / 2;
    x.set(
      event.clientX -
        event.currentTarget.getBoundingClientRect().left -
        halfWidth
    );
  };

  return (
    <div className="flex flex-row items-center  justify-center">
      {items.map((item) => (
        <div
          className="-mr-2 relative group   cursor-pointer"
          key={item.id}
          onMouseEnter={() => setHoveredIndex(item.id)}
          onMouseLeave={() => setHoveredIndex(null)}
          onMouseMove={handleMouseMove}
        >
          <AnimatePresence mode="wait">
            {hoveredIndex === item.id && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: 'spring',
                    stiffness: 260,
                    damping: 10,
                  },
                }}
                exit={{ opacity: 0, y: 10, scale: 0.5 }}
                style={{
                  translateX: translateX,
                  rotate: rotate,
                  whiteSpace: 'nowrap',
                  backgroundColor: stringToColor(item.name),
                }}
                className="absolute h-4 -top-6 left-0 translate-x-1/2 flex text-xs flex-col items-center justify-center rounded-md shadow-xl px-2 py-2 z-[9999]"
              >
                <div className="font-bold text-white relative text-xs">
                  {item.name}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <Image
            height={22}
            width={22}
            src={item.image}
            alt={item.name}
            className="object-cover !m-0 !p-0 object-top rounded-full h-6 w-6 border-2 group-hover:scale-105 group-hover:z-[9999] border-white relative transition duration-500"
          />
        </div>
      ))}
    </div>
  );
};
