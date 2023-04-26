export interface TodoList {
	id: string,
	name: string,
	tasks: Task[]
	userId: string,
	createdAt: number
}
export interface Task {
	id: string,
	name: string,
	todoListId: string,
	createdAt: number,
	active: boolean,
}
