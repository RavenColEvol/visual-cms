import { createContext, RefObject, useContext } from "react";

const frameContext = createContext<RefObject<HTMLIFrameElement> | null>(null);

export const FrameProvider = frameContext.Provider;
export const useBuilderFrame = () => useContext(frameContext);