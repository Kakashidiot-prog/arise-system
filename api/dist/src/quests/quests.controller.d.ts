import { QuestsService } from './quests.service';
export declare class QuestsController {
    private questsService;
    constructor(questsService: QuestsService);
    findAll(category?: string): Promise<({
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
