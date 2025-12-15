"use client";

import PageFooter from "@/components/PageFooter";
import { Skiper75Carousel } from "@/components/ui/skiper-ui/skiper75";

export default function WithNavbarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="top-0 fixed w-screen z-500">
        <Skiper75Carousel />
      </div>
      {children}
      <PageFooter/>
    </>
  );
}
