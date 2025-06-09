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
  userId: string;
}

interface DoneTask extends BaseTask {
  state: 'Done';
  endDate: string;
  userId: string;
  startDate?: string;
}

export type NewTask = TodoTask | DoingTask | DoneTask;

export type Task =
  | (TodoTask & { _id: string })
  | (DoingTask & { _id: string })
  | (DoneTask & { _id: string });
