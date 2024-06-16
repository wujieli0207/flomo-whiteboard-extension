export interface IMemo {
  content: string
  files: IFile[]
  id: number
  linked_count: number
  links: string[]
  pin: number
  slug: string
  source: string
  tags: string[]
  updated_at: string
  updated_at_long: number
  deleted_at: string | null
  deleted_at_long: number | null
  created_at: string
  created_at_long: number
  creator_id: number
}

export interface IFile {
  id: number
  index: number
  name: string
  parent_slug: string
  path: string
  size: number
  thumbnail_url: string // 完整路径
  type: string
  url: string // path 前缀
  creator_id: number
}
