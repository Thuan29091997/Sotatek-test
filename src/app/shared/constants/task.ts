export interface Task {
  id: number,
  title: string,
  description?: string,
  dueDate: string,
  piority: number,
  checked?: boolean
}