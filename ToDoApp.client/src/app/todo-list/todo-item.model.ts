export class TodoItem {
  constructor(
    public id: string,
    public title: string,
    public description: string = '',
    public isCompleted: boolean = false,
    public createdAt: Date = new Date()
  ) { }
}
