import { Action } from "../enums/action.enum";

export class Outcome {
    id!: number;
    event!: number;
    action!: Action;
    condition!: string;
    outcome!: string;
}