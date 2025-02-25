declare module 'html-to-docx' {
  interface Options {
    orientation?: 'portrait' | 'landscape';
    margins?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
  }

  function HTMLToDocx(
    html: string,
    headerHtml: string | null,
    options?: Options
  ): Promise<Blob>;

  export default HTMLToDocx;
} 