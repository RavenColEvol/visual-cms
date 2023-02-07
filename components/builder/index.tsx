import { DragEvent, useEffect, useRef } from "react";

function Builder() {
  return (
    <div id='builder'>
      <Dropzone />
      <iframe src="/example" style={{width: '100%', height: '100%', outline: 'none', 'border': 'none'}}></iframe>
    </div>
  )
}

function Dropzone() {
  const dropRef = useRef(null);

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    console.log('drop event', event);
  }

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }

  return (
    <div onDrop={handleDrop} onDragOver={handleDragOver} ref={dropRef} id="weeb-dropzone"></div>
  )
}

export default Builder;
