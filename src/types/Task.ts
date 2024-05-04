export type Task = {
    type: string
    status: TaskStatus
    args?: {[arg: string]: any}
};

export type TaskStatus = 'done' | 'in progress' | 'waiting';

export type TaskResolver = (...params: any[]) => void;