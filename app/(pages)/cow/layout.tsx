/** app/(pages)/cow/layout.tsx */
import { Suspense } from "react";
import CowPanel from "@/components/panels/Cow/CowPanel";

export default function CowLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CowPanel>{children}</CowPanel>
    </Suspense>
  );
}