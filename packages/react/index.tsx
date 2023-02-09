import { useCallback, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import throttle from "lodash-es/throttle";
import { createBuilder, Element } from "../core";
import { Builder, Node } from "../core/types";
import { usePostMessage } from "./hooks";
import { BuilderProvider, StaticBuilderProvider, useBuilder } from "./use-builder";
import { findKey, useIsomorphicLayoutEffect } from "./utils";
import { EDITOR_TO_ON_CHANGE, NODE_TO_INDEX, NODE_TO_PARENT } from "./weak-maps";

// Package internal code
export function BuilderComponent({ value }: any) {
  const [builder] = useState(() => {
    const builder = createBuilder();
    builder.children = value;
    builder.onChange = () => {
      ReactDOM.unstable_batchedUpdates(() => {
        const onContextChange = EDITOR_TO_ON_CHANGE.get(builder);

        if(onContextChange) {
          onContextChange();
        }
      })
    }
    return builder;
  });

  const [context, setContext] = useState(():[Builder] => [builder])

  usePostMessage();

  const onContextChange = useCallback(() => {
    setContext([builder]);
  }, []);

  EDITOR_TO_ON_CHANGE.set(builder, onContextChange)

  const components = useMemo(
    () => ({
      text: (props: any) => <p {...props.attributes}>{props.children}</p>,
    }),
    []
  );

  return (
    <BuilderProvider value={context}>
      <StaticBuilderProvider value={builder}>
        <Renderer node={builder} components={components} />
      </StaticBuilderProvider>
    </BuilderProvider>
  );
}

function Renderer(props: any) {
  useIsomorphicLayoutEffect(() => {
    const onDOMSelectionChange = throttle(() => {
      const domSelection = document.getSelection()!;

      console.log("dom selection", domSelection);
    }, 100);

    document.addEventListener("selectionchange", onDOMSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", onDOMSelectionChange);
    };
  }, []);
  const editor = useBuilder();
  console.log('editor changed', editor)
  return <div data-cs-weeb-editor>{useChildren(props)}</div>;
}

function useChildren({ node, components }: any) {
  const children = [] as any;

  node["children"].forEach((child: Node, idx: number) => {
    const key = findKey(child);

    if (Element.isElement(child)) {
      children.push(
        <ElementComponent
          key={key.id}
          element={child}
          components={components}
        />
      );
    } else {
      children.push(<LeafComponent key={key.id} text={child} />);
    }

    NODE_TO_INDEX.set(child, idx);
    NODE_TO_PARENT.set(child, node);
  });

  return children;
}

function ElementComponent({ element, components }: any) {
  const ref = useRef(null);
  const children = useChildren({
    node: element,
    components,
  });
  const attributes = {
    "data-cs-weeb-node": "element",
    ref,
  };
  return components[element["type"]]({ attributes, children });
}

function LeafComponent(props: any) {
  const leaf = props["text"];
  const children = leaf["text"];

  return children;
}
