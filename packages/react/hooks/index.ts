import { useEffect } from "react"

const triggerEvent = (message: any) => {
  const { data } = message;
  const { type, clientX, clientY } = data;
  data['bubbles'] = true;
  const dragType = /drag|dragstart|dragend|dragover|drop/;

  let event;
  if(type.match(dragType)) {
    event = new DragEvent(type, data);
  }

  if(!event) return;
  const elementToTarget = document.elementFromPoint(clientX, clientY);
  elementToTarget?.dispatchEvent(event);
}

export const usePostMessage = () => {
  useEffect(() => {
    const handlePostMessage = (event: MessageEvent) => {
      const { data } = event;
      if(data['from'] !== 'cs-weeb') return;

      switch(data['type']) {
        case 'event': 
          return triggerEvent(data);
        default:
          return;
      }
    }
    window.addEventListener('message', handlePostMessage);

    // const drag = new DragEvent('dragover', { clientX: 55, clientY: 7})
    setTimeout(() => {
      const drag = new MouseEvent('mouseover', { clientX: 55, clientY: 7, bubbles: true})
      const el = document.elementFromPoint(55, 7)!;
      console.log('drag', drag, el);
      el.dispatchEvent(drag);
    }, 100)

    return () => {
      window.removeEventListener('message', handlePostMessage);
    }
  }, [])
}