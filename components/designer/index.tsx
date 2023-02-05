import { Editor, Element, Range } from "slate";
import { useSlateSelection, useSlateStatic } from "slate-react";
import { CustomElement } from "../types";


function useNodeProperties() {
  const selection = useSlateSelection();
  const editor = useSlateStatic();
  
  if (!selection || !Range.isCollapsed(selection)) return null;

  const nodePath = selection['anchor']['path'].slice(0, -1);
  const [node] = Editor.node(editor, nodePath);

  if (!Element.isElement(node)) return null;

  return node;
}

function Designer() {
  const node = useNodeProperties() as CustomElement;

  return (
    <div id="properties">
      {node ? (
        <div>{node['type']}</div>
      ) : null}
    </div>
  );
}

export default Designer;
