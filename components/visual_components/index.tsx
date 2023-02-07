import { LegacyRef, MutableRefObject, useEffect, useRef, useState } from "react";

type dragCallback = {
  item: object,
}

type dragResult = [
  { isDragging: boolean },
  LegacyRef<HTMLDivElement>
]

function useDrag(props:dragCallback): dragResult {
  const dragRef = useRef(null);
  const [state, setState] = useState({
    ...props,
    isDragging: false
  });

  useEffect(() => {
    if(!dragRef.current) return;
    const dom = dragRef.current as HTMLElement;
    const builderDropzone = document.getElementById('weeb-dropzone') as HTMLDivElement;
    console.log('builder', builderDropzone);
    // drag
    const handleDrag = (event: DragEvent) => {
      builderDropzone.style.display = 'block';
      setState(state => ({
        ...state, 
        isDragging: true
      }))
    }
    const handleDragEnd = (event: DragEvent) => {
      console.log('handle drag end', event);
      builderDropzone.style.display = 'none';
      setState(state => ({
        ...state, 
        isDragging: false
      }))
    }
    dom.addEventListener('dragstart', handleDrag);
    dom.addEventListener('dragend', handleDragEnd);

    return () => {
      dom.removeEventListener('dragstart', handleDrag);
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
