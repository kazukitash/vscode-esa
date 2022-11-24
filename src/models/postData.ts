import { User } from './user'

export interface PostData {
  number: number
  name: string
  body_md: string
  wip: boolean
  created_by: User
  updated_at: string
}
