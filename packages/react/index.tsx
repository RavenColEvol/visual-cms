import { useMemo, useRef, useState } from "react";
import { createBuilder, Element } from "../core";
import { Node } from "../core/types";
import { BuilderProvider, useBuilder } from "./use-builder";
import { findKey, findPath } from "./utils";
import { NODE_TO_INDEX, NODE_TO_PARENT } from "./weak-maps";

// Package internal code
export function BuilderComponent({ value }: any) {
  const [builder] = useState(() => {
    const builder = createBuilder();
    builder.children = value;
    return builder;
  });

  const components = useMemo(
    () => ({
      text: (props: any) => <p {...props.attributes}>{props.children}</p>,
    }),
    []
  );

  return (
    <BuilderProvider value={builder}>
      <Renderer node={builder} components={components} />
    </BuilderProvider>
  )
  
}

function Renderer(props: any) {
  return <div data-cs-weeb-editor>{useChildren(props)}</div>;
}

function useChildren({ node, components }: any) {
  const children = [] as any;
  
  node['children'].forEach((child: Node, idx: number) => {
    const key = findKey(child);

    if(Element.isElement(child)) {
      children.push(
        <ElementComponent
          key={key.id}
          element={child}
          components={components}
        />
      )
    } else {
      children.push(
        <LeafComponent 
          key={key.id}
          text={child}
        />
      )
    }

    NODE_TO_INDEX.set(child, idx)
    NODE_TO_PARENT.set(child, node);
  }) 

  return children;
}

function ElementComponent({ element, components}:any) {
  const ref = useRef(null);
  const children = useChildren({
    node: element,
    components
  })
  const attributes = {
    'data-cs-weeb-node': 'element',
    ref
  }
  return components[element['type']]({ attributes, children });
}

function LeafComponent(props:any) {
  const leaf = props['text']
  const ref = useRef(null);
  const children = (
    <span data-slate-string ref={ref}>{leaf['text']}</span>
  );

  return children;
}