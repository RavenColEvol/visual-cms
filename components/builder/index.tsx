import { useCallback } from "react";

import { Editable, RenderElementProps } from "slate-react";
import AddBlock from "./ui-blocks/add-block";
import Text from "./ui-blocks/text";

function Element(props: RenderElementProps) {
  const { element } = props;
  const { type } = element as any;

  switch (type) {
    case "add-block":
      return <AddBlock {...props} />;
    default:
      return <Text {...props} />;
  }
}

function Builder() {
  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    []
  );
  return (
    <div id="builder">
      <Editable renderElement={renderElement} />
    </div>
  );
}

export default Builder;
