import { useDrag } from "react-dnd";

function Text() {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: {
      type: 'text'
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }), []);

  return (
    <div 
    ref={drag}
    style={{ 
        width: "100px", 
        height: "100px", 
        border: "1px solid black",
        opacity: isDragging ? 0.5 : 1
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
