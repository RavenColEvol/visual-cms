import { RenderElementProps, useFocused, useSelected } from "slate-react"

function Text(props: RenderElementProps) {
  const { children, attributes } = props;
  const isSelected = useSelected();
  const isFocused = useFocused();

  const shouldHighlight = isSelected && isFocused;

  return (
    <p {...attributes} style={{border: shouldHighlight ? '1px solid blue' : 'none'}}>
      Lorem Ipsum
      {children}
    </p>
  )
}

export default Text