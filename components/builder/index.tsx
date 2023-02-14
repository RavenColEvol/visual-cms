import { DragEvent, useRef } from "react";
import { getEvent, sendFrameMessage, useFrameEvents } from "../utils";

function Builder({ builderRef }: any) {
  
  useFrameEvents(builderRef);

  return (
    <div id="builder">
      <Dropzone frameRef={builderRef}/>
      <iframe
        ref={builderRef}
        src="/example"
        style={{
          width: "100%",
          height: "100%",
          outline: "none",
          border: "none",
        }}
      ></iframe>
    </div>
  );
}

function Dropzone({ frameRef }:any) {
  const dropRef = useRef(null);

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    sendFrameMessage(frameRef, {
      from: "cs-weeb",
      type: "event",
      data: getEvent(frameRef, event),
    });
  };

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    sendFrameMessage(frameRef, {
      from: "cs-weeb",
      type: "event",
      data: getEvent(frameRef, event),
    });
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      ref={dropRef}
      id="weeb-dropzone"
    ></div>
  );
}

export default Builder;
