import { useEffect, useState } from "react";
import { useBuilderFrame } from "../context/frameContext";
import { addFrameListener, removeFrameListener } from "../utils";


function Designer() {
  const [state, setState] = useState({
    selectedNode: null,
    path: [],
  })
  useEffect(() => {
    const handleSelected = ({ node, path}:any) => {
      setState({
        selectedNode: node,
        path
      })
    };
    addFrameListener('selected', handleSelected)
    return () => {
      removeFrameListener('selected', handleSelected)
    }
  }, [])

  const { selectedNode } = state;
  return (
    <div id="properties">
      {selectedNode && JSON.stringify(selectedNode, null, 2)}
    </div>
  );
}

export default Designer;
