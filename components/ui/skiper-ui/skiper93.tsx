"use no memo";
"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  CircleFadingArrowUp,
  CircleHelp,
  Cog,
  Ellipsis,
  FolderKanban,
  LogOut,
  User,
} from "lucide-react";
import { useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";

import { cn } from "@/lib/utils";

const IN_ANIM = {
  type: "spring" as const,
  stiffness: 400,
  damping: 35,
  mass: 0.5,
};
const OUT_ANIM = {
  type: "spring" as const,
  stiffness: 550,
  damping: 35,
  mass: 0.1,
};

const Skiper93 = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isActiveHover, setIsActiveHover] = useState(0);

  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref as React.RefObject<HTMLElement>, () =>
    setIsOpen(false),
  );

  const items = [
    {
      icon: User,
      title: "profile",
    },
    {
      icon: CircleFadingArrowUp,
      title: "upgrade",
    },
    {
      icon: FolderKanban,
      title: "projects",
    },
    {
      icon: BookOpen,
      title: "documentation",
    },

    {
      title: "separator",
    },
    {
      icon: Cog,
      title: "settings",
    },
    {
      icon: CircleHelp,
      title: "Get Help",
    },
    {
      icon: LogOut,
      title: "logout",
    },
  ];

  return (
    <div className="bg-background text-foreground flex h-full w-full flex-col items-center justify-center rounded-3xl border">
      <div className="-mt-36 mb-36 grid content-start justify-items-center gap-6 text-center">
        {/* <span className="after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-transparent after:content-['']">
          Try Clicking on menu
        </span> */}
      </div>

      <div className="relative">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex size-8 items-center justify-center rounded-full"
        >
          <motion.div
            key="btn"
            layoutId="wrapper"
            transition={OUT_ANIM}
            style={{ borderRadius: "20px" }}
            className="bg-border absolute inset-0 origin-top-right p-px"
          >
            <motion.div
              layoutId="bg"
              transition={OUT_ANIM}
              style={{ borderRadius: "19px" }}
              className="bg-muted group-hover:bg-foreground/1 flex size-full items-center justify-center"
            />
          </motion.div>
          <AnimatePresence>
            {!isOpen && (
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                  duration: 0.2,
                  delay: 0.2,
                }}
              >
                <Ellipsis className="relative size-4" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {isOpen && (
          <div
            ref={ref}
            tabIndex={-1}
            className="absolute -right-2 -top-2 z-10 origin-top-left overflow-hidden pl-6"
          >
            <motion.div
              layoutId="wrapper"
              key="pop"
              style={{ borderRadius: "14px" }}
              transition={IN_ANIM}
              className="bg-border overflow-y-clip p-px"
            >
              <motion.div
                layoutId="bg"
                transition={IN_ANIM}
                style={{ borderRadius: "13px" }}
                className="bg-muted size-full origin-top-left"
              >
                <div className="relative origin-top-left p-2">
                  <motion.ul
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.2,
                    }}
                    layout
                    className="flex w-[200px] flex-col gap-1"
                  >
                    {items.map((item, index) =>
                      item.title === "separator" ? (
                        <hr key={index} className="my-1" />
                      ) : (
                        <li
                          onMouseEnter={() => setIsActiveHover(index)}
                          key={index}
                          className={cn(
                            "hover:bg-linear-to-r from-foreground/10 to-foreground/2 relative flex min-h-8 w-full cursor-pointer select-none items-center gap-4 rounded-lg px-2 text-sm capitalize transition-all after:absolute after:bottom-0 after:left-0 after:h-1.5 after:w-full after:translate-y-full after:content-['']",
                            index == isActiveHover
                              ? "text-foreground"
                              : "text-muted-foreground",
                          )}
                        >
                          <div className="z-2 relative flex items-center gap-2">
                            {item.icon && <item.icon className="size-3.5" />}
                            {item.title}
                          </div>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{
                              opacity: {
                                delay: 0.15,
                                duration: 0.3,
                                ease: "easeOut",
                              },
                            }}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            {index == isActiveHover && (
                              <motion.div
                                layoutId="leftPill"
                                transition={OUT_ANIM}
                                className="absolute -left-2.5 h-[70%] w-0.5"
                              >
                                <div className="bg-foreground absolute h-full w-full blur"></div>
                                <div className="bg-linear-to-b from-foreground to-foreground dark:via-foreground/30 absolute h-full w-full"></div>
                              </motion.div>
                            )}
                          </motion.div>
                        </li>
                      ),
                    )}
                  </motion.ul>
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </div>

      {/* <p className="text-muted-foreground absolute bottom-4 text-xs">
        inspired and adapted UI from{" "}
        <a
          href="https://x.com/disarto_max/status/1958217151795560875?s=12"
          target="_blank"
          className="hover:text-foreground"
        >
          disarto_max
        </a>
      </p> */}
    </div>
  );
};

export { Skiper93 };
