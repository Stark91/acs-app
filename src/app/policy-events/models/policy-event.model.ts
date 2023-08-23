import { Policy } from "../enums/policy.enum"

export class PolicyEvent {
    id!: number;
    policy!: Policy;
    description!: string;
}