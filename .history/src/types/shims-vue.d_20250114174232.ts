declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'element-plus/es/components/form' {
  export interface FormItemRule {
    required?: boolean
    message?: string
    trigger?: 'blur' | 'change'
    min?: number
    max?: number
  }
}

declare module 'xlsx' {
  export const utils: {
    book_new: () => any
    json_to_sheet: (data: any[]) => any
    book_append_sheet: (wb: any, ws: any, name: string) => void
    sheet_to_json: (ws: any) => any[]
  }
  export function read(data: any, opts?: any): any
  export function writeFile(wb: any, filename: string): void
} 