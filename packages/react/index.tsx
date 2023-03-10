import { useCallback, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import throttle from "lodash-es/throttle";
import { createBuilder, Element, Transforms } from "../core";
import { Builder, Node } from "../core/types";
import { usePostMessage } from "./hooks";
import { BuilderProvider, StaticBuilderProvider, useBuilder, useStaticBuilder } from "./use-builder";
import { findKey, findNodeFromDOM, findPath, sendToParent, useIsomorphicLayoutEffect } from "./utils";
import { EDITOR_TO_ON_CHANGE, ELEMENT_TO_NODE, NODE_TO_INDEX, NODE_TO_PARENT } from "./weak-maps";
import styles from './index.module.css';
import { get } from "lodash-es";

// Package internal code
export function BuilderComponent({ suidata }: any) {
  const [builder] = useState(() => {
    const builder = createBuilder();
    builder.children = suidata[0];
    builder.uidata = suidata[1];
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
  const dragLineRef = useRef(null);
  const outlineRef = useRef(null);
  const builder = useBuilder();

  useIsomorphicLayoutEffect(() => {
    const onDOMSelectionChange = throttle(() => {
      const domSelection = document.getSelection()!;
      if(!outlineRef.current || domSelection?.['type'] !== 'Caret') return;
      const outlineBox = outlineRef.current as HTMLSpanElement;
      if(domSelection === null) {
        outlineBox.removeAttribute('style');
      }
      if(!domSelection || !outlineRef.current) return;
      const isDifferentEl = domSelection.anchorNode !== domSelection.focusNode;
      if(isDifferentEl) return;
      const parentNode = domSelection.anchorNode?.parentNode as globalThis.Element;
      if(!parentNode) return;
      const outlineNode = parentNode.closest('[data-cs-weeb-node="element"]') as HTMLElement
      if(!outlineNode) return;
      const box = outlineNode?.getBoundingClientRect() as any;
      
      outlineBox.style.top = box['top'] + 'px';
      outlineBox.style.left = box['left'] + 'px';
      outlineBox.style.width = box['width'] + 'px';
      outlineBox.style.height = box['height'] + 'px';

      const node = findNodeFromDOM(outlineNode);
      const path = findPath(node);

      sendToParent({
        from: 'cs-weeb--example',
        type: 'selected',
        data: { node, path }
      })
      
      Transforms.setSelection(builder, path);
    }, 100);

    const onDragOver = (event: DragEvent) => {
      const { clientX, clientY } = event;
      const cursorEl = document.elementFromPoint(clientX, clientY);
      const node = cursorEl?.closest('[data-cs-weeb-node="element"]')
      const dragLine = dragLineRef.current! as HTMLSpanElement;
      if(!node || !dragLine) return;
      const box = node.getBoundingClientRect();
      const { bottom, top, width, left } = box;

      const topDistance = Math.abs(clientY - top);
      const bottomDistance = Math.abs(clientY - bottom);
      const closestTo = topDistance > bottomDistance ? 'bottom': 'top';
      dragLine.style.top = box[closestTo] + 'px'
      dragLine.style.left = left + 'px'
      dragLine.style.width = width + 'px'
    }

    const handleDrop = (event: DragEvent) => {
      event.preventDefault();
      if(!dragLineRef.current) return;
      const dragLine = dragLineRef.current! as HTMLSpanElement;
      const { clientX, clientY } = event;

      const cursorEl = document.elementFromPoint(clientX, clientY);
      const domNode = cursorEl?.closest('[data-cs-weeb-node="element"]') as HTMLElement
      if(!domNode || !dragLine) return;
      const box = domNode.getBoundingClientRect();
      const { bottom, top, width, left } = box;

      const topDistance = Math.abs(clientY - top);
      const bottomDistance = Math.abs(clientY - bottom);
      const closestTo = topDistance > bottomDistance ? 'bottom': 'top';
      const node = findNodeFromDOM(domNode);
      const path = findPath(node) || [];
      const at = closestTo === 'top' ? 0 : 1;
      path[path.length - 1] = path[path.length - 1] + at;
      console.log('called');
      Transforms.insertNode(builder, {
        type: 'text',
        children: [{ text: '{{append}}'}]
      }, path);
      dragLine.removeAttribute('style');
    }

    document.addEventListener("selectionchange", onDOMSelectionChange);
    document.addEventListener('dragover', onDragOver);
    document.addEventListener('drop', handleDrop);

    return () => {
      document.removeEventListener("selectionchange", onDOMSelectionChange);
      document.removeEventListener('dragover', onDragOver);
      document.removeEventListener('drop', handleDrop);
    };
  }, []);

  return (
    <>
      <div data-cs-weeb-editor>{useChildren(props)}</div>
      <span className={styles["cs-weeb-dragline"]} ref={dragLineRef}></span>
      <span className={styles["cs-weeb-outline"]} ref={outlineRef}></span>
    </>
  );
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
    style: element['style']
  };

  useIsomorphicLayoutEffect(() => {
    if(!ref.current) return;
    ELEMENT_TO_NODE.set(ref.current, element)
  }, [])

  return components[element["type"]]({ attributes, children });
}

function LeafComponent(props: any) {
  const leaf = props["text"];
  const children = leaf["text"];
  const builder = useStaticBuilder()!;
  if(get(builder['uidata'], children)) return get(builder['uidata'], children)
  return children;
}
