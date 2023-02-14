import { RefObject, useEffect } from "react";

export const sendFrameMessage = (
  iframeRef: RefObject<HTMLIFrameElement>,
  message: object
) => {
  if (!iframeRef.current) return;
  iframeRef.current.contentWindow?.postMessage(message, "*");
};

const frameListeners = new Map();

export const useFrameEvents = (iframeRef: RefObject<HTMLIFrameElement>) => {
  useEffect(() => {
    if(!iframeRef.current) return;
    const handleFrameEvents = (event: MessageEvent) => {
      const { from, type, data } = event.data || {};
      if (from !== 'cs-weeb--example') return;
      
      const listeners = frameListeners.get(type) || [];
      listeners.forEach((listener: any) => listener(data))
    }
    window.addEventListener('message', handleFrameEvents);
    return () => {
      window.removeEventListener('message', handleFrameEvents);
    }
  }, [iframeRef])
}

export const addFrameListener = (eventName: string, callback: any) => {
  const listeners = frameListeners.get(eventName) || []
  frameListeners.set(eventName, listeners.concat(callback));
}

export const removeFrameListener = (eventName: string, callback: any) => {
  const listeners = frameListeners.get(eventName) || [];
  const listenerIdx = listeners.indexOf(callback);
  if(listenerIdx === -1) return;
  listeners.splice(listenerIdx, 1);
}

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
