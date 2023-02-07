export type Path = number[]

export type Element = {
  children: Node[],
  type?: string,
  [key: string]: any
}

export type Text = {
  text: string
}

export type Node = Element | Text

export type Builder = {
  children: Node[] 
}