import { Suspense } from "react";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import QualifiedIntermediary from "@/components/QualifiedIntermediary";
import WhatIs1031 from "@/components/WhatIs1031";
import Steps from "@/components/Steps";
import FindAccommodator from "@/components/FindAccommodator";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <QualifiedIntermediary />
        <WhatIs1031 />
        <Steps />
        {/* Suspense boundary required because FindAccommodator reads useSearchParams */}
        <Suspense fallback={null}>
          <FindAccommodator />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
