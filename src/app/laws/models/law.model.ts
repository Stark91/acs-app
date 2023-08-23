import { LawType } from "../enums/law-type.enum";
import { Element } from "../../shared/models/element.model";
import { Stats } from "../../shared/models/stats.model";

export class Law {
    id!: number;
    name!: string;
    type!: LawType;
    element!: Element;
    yinYang!: string;
    description!: string;
    stats!: Stats;
}