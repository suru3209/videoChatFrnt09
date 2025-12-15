"use client";

import { ArrowUp, BookOpen } from "lucide-react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useMotionValue,
} from "motion/react";
import { JSX, useMemo } from "react";
import { useLayoutEffect, useRef, useState } from "react";
import React from "react";

import { cn } from "@/lib/utils";

// Animation constants
const ANIMATION_DURATION = 0.1;

// Component for animated placeholder text
const AnimatedPlaceholder = ({
  isDeepMindMode,
}: {
  isDeepMindMode: boolean;
}) => (
  <AnimatePresence mode="wait">
    <motion.p
      key={isDeepMindMode ? "search" : "ask"}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: ANIMATION_DURATION }}
      className="text-foreground/20 pointer-events-none absolute"
    >
      {isDeepMindMode ? "Type Shit.." : "Ask anything..."}
    </motion.p>
  </AnimatePresence>
);

// Message type definition
interface ChatMessage {
  id: number;
  message: string;
  isFromUser: boolean;
}

type Skiper85Props = {
  open: boolean;
  messages: { sender: string; text: string }[];
  username: string | null;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: () => void;
};

const Skiper85 = ({
  open,
  messages,
  username,
  message,
  setMessage,
  sendMessage,
}: Skiper85Props) => {
  if (!open) return null;

  return (
    <MotionConfig
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      <div className="bg-background text-black flex h-100 lg:w-200 w-full items-center justify-center rounded-3xl border py-4">
        {/* Chat Messages Container */}
        <motion.div className="no-scroll flex h-80 max-w-3xl flex-1 flex-col overflow-scroll  px-3 py-6 mb-15">
          {messages.map((m, i) => (
            <motion.div
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              key={i}
              className={cn(
                `bg-muted my-2 w-fit max-w-xs break-words rounded-2xl px-4 py-2 ${
                  m.sender === username
                    ? "bg-blue-100 text-right"
                    : "bg-gray-100 text-left"
                }`,
                m.sender === username ? "self-end" : "self-start"
              )}
            >
              <strong>{m.sender}</strong>:{m.text}
            </motion.div>
          ))}

          <motion.div />
        </motion.div>

        {/* Input Container */}
        <div className="rounded-t-4xl fixed bottom-2 w-full max-w-3xl gap-1 px-3 pb-3">
          <div className="bg-muted rounded-2xl border dark:!border-[#181818]">
            <div className="bg-background outline-border relative rounded-2xl outline dark:!outline-[#181818]">
              {/* Text Input Area */}
              <div className="relative">
                <textarea
                  value={message}
                  autoFocus
                  placeholder=""
                  className="field-sizing-content pr-15 max-h-52 w-full text-black resize-none rounded-none !bg-transparent p-4 !text-base leading-[1.2] shadow-none focus-visible:outline-0 focus-visible:ring-0"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <button
                onClick={() => sendMessage()}
                className="hover:bg-muted hover:border-border absolute right-2 top-2 flex size-10 items-center justify-center rounded-xl border border-transparent p-2"
              >
                {!sendMessage ? (
                  <ArrowUp className="size-5" />
                ) : (
                  <div className="size-3.5 rounded-[4px] bg-current"></div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
};

export type TextShimmerProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: any;
  as?: React.ElementType;
  className?: string;
  duration?: number;
  spread?: number;
};

function TextShimmerComponent({
  children,
  as: Component = "p",
  className,
  duration = 2,
  spread = 2,
}: TextShimmerProps) {
  const MotionComponent = motion.create(
    Component as keyof JSX.IntrinsicElements
  );

  const dynamicSpread = useMemo(() => {
    return children.length * spread;
  }, [children, spread]);

  return (
    <MotionComponent
      className={cn(
        "relative inline-block bg-[length:250%_100%,auto] bg-clip-text",
        "text-transparent [--base-color:#a1a1aa] [--base-gradient-color:#000]",
        "[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))] [background-repeat:no-repeat,padding-box]",
        "dark:[--base-color:#71717a] dark:[--base-gradient-color:#ffffff] dark:[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))]",
        className
      )}
      initial={{ backgroundPosition: "100% center" }}
      animate={{ backgroundPosition: "0% center" }}
      transition={{
        repeat: Infinity,
        duration,
        ease: "linear",
      }}
      style={
        {
          "--spread": `${dynamicSpread}px`,
          backgroundImage: `var(--bg), linear-gradient(var(--base-color), var(--base-color))`,
        } as React.CSSProperties
      }
    >
      {children}
    </MotionComponent>
  );
}

export const TextShimmer = React.memo(TextShimmerComponent);

export { Skiper85 };
