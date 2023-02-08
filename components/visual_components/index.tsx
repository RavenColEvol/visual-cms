import { LegacyRef, useEffect, useRef, useState } from "react";
import { useBuilderFrame } from "../context/frameContext";
import { getEvent, getRelativeCoordinates, sendFrameMessage } from "../utils";

type dragCallback = {
  item: object,
}

type dragResult = [
  { isDragging: boolean },
  LegacyRef<HTMLDivElement>
]

function useDrag(props:dragCallback): dragResult {
  const dragRef = useRef(null);
  const frameRef = useBuilderFrame()!;

  const [state, setState] = useState({
    ...props,
    isDragging: false
  });

  useEffect(() => {
    if(!dragRef.current) return;
    const dom = dragRef.current as HTMLElement;
    const builderDropzone = document.getElementById('weeb-dropzone') as HTMLDivElement;
    // drag
    const handleDragStart = (event: DragEvent) => {
      builderDropzone.style.display = 'block';
      setState(state => ({
        ...state, 
        isDragging: true
      }))
    }
    const handleDragEnd = (event: DragEvent) => {
      builderDropzone.style.display = 'none';
      setState(state => ({
        ...state, 
        isDragging: false
      }))
    }

    dom.addEventListener('dragstart', handleDragStart);
    dom.addEventListener('dragend', handleDragEnd);

    return () => {
      dom.removeEventListener('dragstart', handleDragStart);
      dom.removeEventListener('dragend', handleDragEnd);
    }
  }, [dragRef])
  
  const { isDragging } = state;

  return [{ isDragging }, dragRef];
}

function Text() {
  const [{ isDragging }, dragRef] = useDrag({
    item: { type: 'text' }
  });

  return (
    <div 
    ref={dragRef}
    draggable={true}
    style={{ 
        width: "50px", 
        height: "50px", 
        border: "1px solid black",
        opacity: isDragging ? '.5' : '1'
    }}>
      Text
    </div>
  );
}

function VisualComponents() {
  return (
    <div id="components">
      <Text />
    </div>
  );
}

export default VisualComponents;
