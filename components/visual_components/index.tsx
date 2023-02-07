function Text() {
  return (
    <div 
    draggable={true}
    style={{ 
        width: "100px", 
        height: "100px", 
        border: "1px solid black"
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
