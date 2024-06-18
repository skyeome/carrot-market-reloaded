import TabBar from "@/components/tab-bar";
import React, { PropsWithChildren } from "react";

export default function TabLayout({ children }: PropsWithChildren) {
  return (
    <div>
      {children}
      <TabBar />
    </div>
  );
}
