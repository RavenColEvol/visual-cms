import { createContext, useContext } from "react";
import { Builder } from "../core/types";

const StaticBuilderContext = createContext<null | Builder>(null);
const BuilderContext = createContext<[Builder] | null>(null);

export const StaticBuilderProvider = StaticBuilderContext.Provider;
export const useStaticBuilder = () => useContext(StaticBuilderContext);

export const BuilderProvider = BuilderContext.Provider;
export const useBuilder = () => {
  const context = useContext(BuilderContext);
  if(!context) {
    throw new Error('Must be used inside context')
  }
  const [editor] = context;
  return editor;
}
