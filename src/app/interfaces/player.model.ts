export interface Player {
    id?: string;
    error?: string;
    name?: string;
    pushKey?: string;
    ready?: boolean;
    slug?: string;
    team?: number;
    vip?: boolean;
    words?: string[];
    loading?: boolean;
}
