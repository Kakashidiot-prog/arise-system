import { ProgressService } from './progress.service';
export declare class ProgressController {
    private progressService;
    constructor(progressService: ProgressService);
    toggleTask(req: any, taskId: number): Promise<{
        completed: boolean;
    }>;
    getProgress(req: any): Promise<{
        taskId: number;
    }[]>;
    getStats(req: any): Promise<{
        exp: number;
        username: string;
        level: number;
        streak: number;
    } | null>;
}
