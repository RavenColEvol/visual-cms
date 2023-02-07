import { createContext, useContext } from "react";
import { Builder } from "../core/types";

const BuilderContext = createContext<null | Builder>(null)

export const BuilderProvider = BuilderContext.Provider;
export const useBuilder = () => useContext(BuilderContext);