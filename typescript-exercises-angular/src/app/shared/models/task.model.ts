interface BaseTask {
  storyId: number;
  title: string;
  description: string;
  estimatedWorkHours: number;
  createdAt: string;
}

interface TodoTask extends BaseTask {
  state: 'Todo';
}

interface DoingTask extends BaseTask {
  state: 'Doing';
  startDate: string;
  userId: number;
}

interface DoneTask extends BaseTask {
  state: 'Done';
  endDate: string;
  userId: number;
  startDate?: string;
}

export type NewTask = TodoTask | DoingTask | DoneTask;

export type Task =
  | (TodoTask & { id: number })
  | (DoingTask & { id: number })
  | (DoneTask & { id: number });
