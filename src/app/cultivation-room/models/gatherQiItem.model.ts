import { Element } from "../../shared/models/element.model";

export class GatherQiItem {
    id!: number;
    name!: string;
    image!: string;
    element!: Element;
    gatherQi!: {
        power: number;
        range: number;
        decay: number;
        startDecay: number;
    }
    elementEmit!: {
        power: number;
        range: number;
        decay: number;
        startDecay: number;
    }
}