import { User } from './user'

export interface PostData {
  number: number
  name: string
  body_md: string
  wip: boolean
  category: string
  created_by: User
  updated_at: string
}
