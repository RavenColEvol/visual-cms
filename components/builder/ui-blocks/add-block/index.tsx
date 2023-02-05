import { useDrop } from "react-dnd";
import { mergeRefs } from "react-merge-refs";
import { Editor, Transforms } from 'slate';
import { ReactEditor, RenderElementProps, useSlateStatic } from "slate-react";

// function combineRef(...refs) {
//   return ()
// }

function AddBlock(props: RenderElementProps) {
  const { children, attributes, element } = props;
  const editor = useSlateStatic() as ReactEditor;

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "component",
      drop: (item: any) => {
        console.log("dropped", ReactEditor.findPath(editor, element));
        Transforms.setNodes(editor, {
          type: item['type']
        } as any, {
          at: ReactEditor.findPath(editor, element)
        })
        // replace current with
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    []
  );

  return (
    <div
      {...attributes}
      ref={mergeRefs([drop, attributes.ref])}
      style={{ 
        height: "100px", 
        border: "1px solid black",
        background: isOver ? 'blue': 'transparent'
      }}
      contentEditable={false}
    >
      {children}
      Add Block
    </div>
  );
}

export default AddBlock;
