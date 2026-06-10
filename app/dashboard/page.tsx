"use client";

import { Responsive, WidthProvider } from "react-grid-layout/legacy";
import DailyPanel from "@/components/panels/Daily/DailyPanel";
import AggPanel from "@/components/panels/Aggregates/AggPanel";
import CowPanel from "@/components/panels/Cow/CowPanel";

const RGL = WidthProvider(Responsive);

const layouts = {
  lg: [
    { i: "daily", x: 0, y: 0, w: 8, h: 14 },
    { i: "aggregates", x: 8, y: 0, w: 4, h: 14 },
    { i: "cow", x: 0, y: 14, w: 12, h: 8 },
  ],
};

export default function DashboardPage() {
  return (
    <RGL
      layouts={layouts}
      breakpoints={{ lg: 1200, md: 900, sm: 600 }}
      cols={{ lg: 12, md: 12, sm: 6 }}
      rowHeight={40}
      isDraggable={false}
      isResizable={false}
    >
      <div key="daily" style={{ overflow: "hidden" }}>
        <DailyPanel />
      </div>
      <div key="aggregates" style={{ overflow: "hidden" }}>
        <AggPanel />
      </div>
      <div key="cow" style={{ overflow: "hidden" }}>
        <CowPanel />
      </div>
    </RGL>
  );
}
