import { Element } from "src/app/shared/models/element.model";

export class Weather {
    id!: number;
    name!: string;
    contribution!: number;
    element!: Element;
}