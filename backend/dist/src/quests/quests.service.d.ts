import { PrismaService } from '../prisma/prisma.service';
export declare class QuestsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        tasks: {
            id: number;
            key: string;
            name: string;
            note: string | null;
            exp: number;
            questId: number;
        }[];
    } & {
        id: number;
        key: string;
        name: string;
        icon: string;
        sub: string;
        category: string;
        order: number;
    })[]>;
    findByCategory(category: string): Promise<({
        tasks: {
            id: number;
            key: string;
            name: string;
            note: string | null;
            exp: number;
            questId: number;
        }[];
    } & {
        id: number;
        key: string;
        name: string;
        icon: string;
        sub: string;
        category: string;
        order: number;
    })[]>;
}
