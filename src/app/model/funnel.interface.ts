import { IPage } from "../shared/components/page/page.interface";
import { IWebsite } from "./website.interface";

export interface IFunnel {
    id: string;
    name: string;
    pages: Record<string, IPage>;
    websites: Record<string, IWebsite>;
}
