import { PrismaService } from '../prisma/prisma.service';
export declare class ProgressService {
    private prisma;
    constructor(prisma: PrismaService);
    toggleTask(userId: number, taskId: number): Promise<{
        completed: boolean;
    }>;
    private updateUserExp;
    getUserProgress(userId: number): Promise<{
        taskId: number;
    }[]>;
    getUserStats(userId: number): Promise<{
        exp: number;
        username: string;
        level: number;
        streak: number;
    } | null>;
}
