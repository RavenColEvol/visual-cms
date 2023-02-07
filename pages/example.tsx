import { BuilderComponent } from "../packages/react";


// CLIENT SIDE CODE
function ReactExample() {
  const initialValue = [
    {
      type: 'text',
      children: [{ text: 'This is cool'}]
    },
    {
      type: 'text',
      children: [{ text: 'This is empty'}]
    }
  ]

  return (
    <BuilderComponent value={initialValue}/>
  );
}
export default ReactExample;
