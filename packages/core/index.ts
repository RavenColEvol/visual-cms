import { createDraft, finishDraft } from 'immer';
import { Builder, Element as ElementType, Node as NodeType, Path as PathType, Text as TextType } from "./types";
import { FLUSING } from './weak-maps';

export const createBuilder = ():Builder => {
  const builder: Builder = {
    children: [],
    selection: null,
    operations: [],
    onChange: () => {},
    apply: (op) => {
      Transforms.transform(builder, op);
      builder.operations.push(op);

      if(!FLUSING.get(builder)) {
        FLUSING.set(builder, true)

        Promise.resolve().then(() => {
          FLUSING.set(builder, false);
          builder.onChange()
          builder.operations = []
        })
      }
    }
  };

  return builder;
};

export const Path = {
  parent(path: PathType) {
    return path.slice(0, -1);
  },
};

export const Element = {
  isElement(node: NodeType): node is ElementType {
    return node.hasOwnProperty('children');
  }
}

export const Text = {
  isText(node: NodeType): node is TextType {
    return node.hasOwnProperty('text')
  }
}

export const Node = {
  parent(builder: Builder, path: PathType) {
    const parentPath = Path.parent(path);
    const node = Node.get(builder, parentPath);

    return node;
  },
  get(builder: ElementType, path: PathType): ElementType {
    let node = builder;

    for (const idx of path) {
      const child = node.children[idx];

      if(Text.isText(child)) {
        throw new Error('Unable to reach given path node');
      }

      node = child;
    }

    return node;
  },
};

export const Transforms = {
  moveNode(builder: Builder, from: PathType, to: PathType) {
    const node = Node.get(builder, from);
    const parent = Node.parent(builder, from);
    const index = from.at(-1)!;

    parent.children.splice(index, 1);

    //TODO: update in paths
    const newParent = Node.get(builder, Path.parent(to));
    const newIndex = to.at(-1)!;
    newParent.children.splice(newIndex, 0, node);
  },
  insertNode(builder: Builder, node: NodeType, at: PathType) {
    builder.apply({ type: 'insert_node', path: at, node})
  },
  removeNode(builder: Builder, at: PathType) {
    if(at.length === 0) {
      throw new Error("Unable to remove at root");
    }
    const parent = Node.parent(builder, at);
    const index = at.at(-1)!;
    parent.children.splice(index, 1);
  },
  updateNode(builder: Builder, properties:Partial<NodeType>, at: PathType) {
    const node = Node.get(builder, at);

    for (const key in properties) {
      if( key === 'children' || key === 'text') continue;
      //TODO: fix type
      //@ts-ignore
      const value = properties[key];
      if (value === null) {
        delete node[key];
      } else {
        node[key] = value;
      }
    }
  },
  transform(builder: Builder, op: object):void {
    builder.children = createDraft(builder.children)
    let selection = builder.selection && createDraft(
      builder.selection
    );
    try {
      applyToDraft(builder, selection, op);
    } finally {
      builder.children = finishDraft(builder.children);
    }
  }
};

function applyToDraft(builder: Builder, selection: any, op:any) {
  switch (op.type) {
    case 'insert_node': {
      const { path, node } = op
      if(path.length === 0) {
        throw new Error("Unable to insert at root");
      }
      const parent = Node.parent(builder, path);
      const index = path.at(-1)!;
      parent.children.splice(index, 0, node);
    }
  }
}