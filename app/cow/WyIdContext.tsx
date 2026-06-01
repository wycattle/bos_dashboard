"use client";

import React, { createContext, useContext, useState } from "react";

type WyIdContextType = {
  wyId: string;
  setWyId: (id: string) => void;
};

const WyIdContext = createContext<WyIdContextType>({
  wyId: "",
  setWyId: () => {},
});

export const WyIdProvider = ({ children }: { children: React.ReactNode }) => {
  const [wyId, setWyId] = useState("");
  return (
    <WyIdContext.Provider value={{ wyId, setWyId }}>
      {children}
    </WyIdContext.Provider>
  );
};

export const useWyId = () => useContext(WyIdContext);
