"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ultrabol } from "@/app/fonts";

const Skiper19 = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
  });

  const router = useRouter();
  const { user } = useAuth();

  const handleClick = () => {
    if (user?.token) {
      router.push("/home");
    } else {
      router.push("/auth");
    }
  };

  return (
    <section
      ref={ref}
      className="mx-auto flex lg:h-[250vh] sm:h-[380vh] w-screen flex-col items-center overflow-hidden bg-[#FAFDEE] px-4 text-[#1F3A4B] -z-10"
    >
      <div className="mt-32 relative flex w-fit flex-col items-center justify-center gap-5 text-center">
        <h1 className="font-jakarta-sans relative z-10 text-7xl font-medium tracking-[-0.08em] lg:text-9xl">
          Connect Instantly <br /> with High-Quality <br />
          <span className={`${ultrabol.className}`}>V</span>ideo Calls
        </h1>
        <p className="font-jakarta-sans relative z-10 max-w-2xl text-xl font-medium text-[#1F3A4B]">
          Connect with friends, teams, or clients in just one click.
        </p>

        <LinePath
          className="absolute -right-[40%] top-0 z-0"
          scrollYProgress={scrollYProgress}
        />
        <Button className="h-9.5 border-foreground/10 mt-20  relative inline-flex cursor-pointer items-center rounded-full hover:text-white border bg-[#c2f84f] px-3 tracking-[0.035em] text-black">
          <span onClick={handleClick}>Join-meeting</span>
        </Button>
      </div>

      <section className="max-w-6xl z-500 mx-auto px-6 py-20 lg:mt-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-2xl md:text-6xl mb-10 font-bold leading-tight">
            Connect Instantly with
            <span className="bg-gradient-to-r from-green-400 to-blue-400 text-transparent bg-clip-text">
              {" "}
              High-Quality Video Calls
            </span>
          </h1>

          <p className="text-gray-600 mt-4 text-base md:text-lg">
            Start a private video room with friends, team, or clients — no
            downloads, no sign-up required.
          </p>

        </div>

        <div className="flex justify-center">
          <img
            src="/heroPng.png"
            alt="Video Chat"
            className="rounded-2xl w-full max-w-md"
          />
        </div>
      </section>

       <section className="py-20 lg:mt-30 z-500  text-gray-900">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12">
            What We Are Providing
          </h2>
        <div className="max-w-6xl mx-auto px-6 lg:py-30">

          <div className="grid md:grid-cols-3 gap-10">
            <div className="p-6  rounded-xl border border-white/10 hover:bg-black/20 transition text-center">
              <img src="/card3.png" className="w-54 h-54 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Noise-Free Video Calls
              </h3>
              <p className="text-gray-700">
                Crystal-clear audio & video quality for seamless conversations.
              </p>
            </div>

            <div className="p-6  rounded-xl border border-white/10 hover:bg-black/20 transition text-center">
              <img src="/cardOne.png" className="w-24 h-24 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Smart Meeting Tools
              </h3>
              <p className="text-gray-700">
                Share screens, collaborate, and communicate effortlessly.
              </p>
            </div>

            <div className="p-6  rounded-xl border border-white/10 hover:bg-black/20 transition text-center">
              <img src="/cardTwo.png" className="w-24 h-24 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Instant Connect</h3>
              <p className="text-gray-700">
                Connect with friends, teams, or clients in just one click.
              </p>
            </div>
          </div>

          <p className="mt-14 text-center text-gray-900">
            Built with ❤️ for creators, gamers, and remote teams.
          </p>
        </div>
      </section>
      

      
    </section>
  );
};

export { Skiper19 };

const LinePath = ({
  className,
  scrollYProgress,
}: {
  className: string;
  scrollYProgress: any;
}) => {
  const pathLength = useTransform(scrollYProgress, [0, 1], [0.5, 1]);

  return (
    <svg
      width="1278"
      height="2319"
      viewBox="0 0 1278 2319"
      fill="none"
      overflow="visible"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <motion.path
        d="M876.605 394.131C788.982 335.917 696.198 358.139 691.836 416.303C685.453 501.424 853.722 498.43 941.95 409.714C1016.1 335.156 1008.64 186.907 906.167 142.846C807.014 100.212 712.699 198.494 789.049 245.127C889.053 306.207 986.062 116.979 840.548 43.3233C743.932 -5.58141 678.027 57.1682 672.279 112.188C666.53 167.208 712.538 172.943 736.353 163.088C760.167 153.234 764.14 120.924 746.651 93.3868C717.461 47.4252 638.894 77.8642 601.018 116.979C568.164 150.908 557 201.079 576.467 246.924C593.342 286.664 630.24 310.55 671.68 302.614C756.114 286.446 729.747 206.546 681.86 186.442C630.54 164.898 492 209.318 495.026 287.644C496.837 334.494 518.402 366.466 582.455 367.287C680.013 368.538 771.538 299.456 898.634 292.434C1007.02 286.446 1192.67 309.384 1242.36 382.258C1266.99 418.39 1273.65 443.108 1247.75 474.477C1217.32 511.33 1149.4 511.259 1096.84 466.093C1044.29 420.928 1029.14 380.576 1033.97 324.172C1038.31 273.428 1069.55 228.986 1117.2 216.384C1152.2 207.128 1188.29 213.629 1194.45 245.127C1201.49 281.062 1132.22 280.104 1100.44 272.673C1065.32 264.464 1044.22 234.837 1032.77 201.413C1019.29 162.061 1029.71 131.126 1056.44 100.965C1086.19 67.4032 1143.96 54.5526 1175.78 86.1513C1207.02 117.17 1186.81 143.379 1156.22 166.691C1112.57 199.959 1052.57 186.238 999.784 155.164C957.312 130.164 899.171 63.7054 931.284 26.3214C952.068 2.12513 996.288 3.87363 1007.22 43.58C1018.15 83.2749 1003.56 122.644 975.969 163.376C948.377 204.107 907.272 255.122 913.558 321.045C919.727 385.734 990.968 497.068 1063.84 503.35C1111.46 507.456 1166.79 511.984 1175.68 464.527C1191.52 379.956 1101.26 334.985 1030.29 377.017C971.109 412.064 956.297 483.647 953.797 561.655C947.587 755.413 1197.56 941.828 936.039 1140.66C745.771 1285.32 321.926 950.737 134.536 1202.19C-6.68295 1391.68 -53.4837 1655.38 131.935 1760.5C478.381 1956.91 1124.19 1515 1201.28 1997.83C1273.66 2451.23 100.805 1864.7 303.794 2668.89"
        stroke="#C2F84F"
        strokeWidth="20"
        style={{
          pathLength,
          strokeDashoffset: useTransform(pathLength, (value) => 1 - value),
        }}
      />
    </svg>
  );
};

/**
 * Skiper 19 — React + framer motion
 * Inspired by and adapted from https://comgio.ai/
 * We respect the original creators. This is an inspired rebuild with our own taste and does not claim any ownership.
 * These animations aren’t associated with the comgio.ai . They’re independent recreations meant to study interaction design
 *
 * License & Usage:
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * - No attribution required with Skiper UI Pro.
 *
 * Feedback and contributions are welcome.
 *
 * Author: @gurvinder-singh02
 * Website: https://gxuri.in
 * Twitter: https://x.com/Gur__vi
 */
