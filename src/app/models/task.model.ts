export interface Task {
  id?: number; // Make 'id' optional since it's not always provided during creation
  title: string;
  description: string;
  status: string;
}
