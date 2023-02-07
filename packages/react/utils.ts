import { Node, Path } from "../core/types";
import { NODE_TO_INDEX, NODE_TO_PARENT } from "./weak-maps";

export const findPath = (node: Node): Path => {
  const path: Path = [];
  let child = node;

  while(true) {
    const parent = NODE_TO_PARENT.get(child);
    if(parent == null) {
      if(child.hasOwnProperty('selection')) {
        return path;
      } else {
        break;
      }
    }

    const i = NODE_TO_INDEX.get(child);

    if(i == null) break;

    path.unshift(i);
    child = parent;
  }
  
  throw new Error('Unable to find path');
}