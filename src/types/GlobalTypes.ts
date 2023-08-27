export type UserCreateInput = {
    id: number
    name: string
    email: string
    password?: string | null
    validated?: number
    code: string
  }