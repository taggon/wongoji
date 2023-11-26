/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

declare module '*.module.css' {
  const styles: {
    readonly [key: string]: string
  }
  export default styles
}
