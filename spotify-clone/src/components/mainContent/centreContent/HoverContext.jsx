import { createContext, useState } from "react";

// Create Context
export const HoverContext = createContext();

export const HoverProvider = ({ children }) => {
  const [hoverImage, setHoverImage] = useState("");

  return (
    <HoverContext.Provider value={{ hoverImage, setHoverImage }}>
      {children}
    </HoverContext.Provider>
  );
};
