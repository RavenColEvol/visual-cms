import { RefObject } from "react";

export const sendFrameMessage = (
  iframeRef: RefObject<HTMLIFrameElement>,
  message: object
) => {
  if (!iframeRef.current) return;
  iframeRef.current.contentWindow?.postMessage(message, "*");
};

export const getRelativeCoordinates = (
  iframeRef: RefObject<HTMLIFrameElement>,
  event: DragEvent
) => {
  if (!iframeRef.current) return;
  const { x, y } = iframeRef.current.getBoundingClientRect();
  return [event.x - x, event.y - y];
};

export const getEvent = (
  iframeRef: RefObject<HTMLIFrameElement>,
  event: any
) => {
  if (!iframeRef.current) return;
  const allowedKeys = [
    "path",
    "which",
    "type",
    "altKey",
    "metaKey",
    "ctrlKey",
    "shiftKey",
    "clientX",
    "clientY",
    "detail",
  ];
  const { x, y } = iframeRef.current.getBoundingClientRect();
  const e = {} as any;
  for(const key of allowedKeys) {
    if(!event[key]) continue;
    e[key] = event[key];
    if( key === 'clientX') e['clientX'] -= x;
    if( key === 'clientY') e['clientY'] -= y;
  }
  return e;
};
