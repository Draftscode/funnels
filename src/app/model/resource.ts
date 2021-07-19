import { GlobalUtils } from "../utils/global.utils";

export class Resource {
  // unique identifier for each resource
  private id: string;

  constructor(id = GlobalUtils.uuidv4()) {
    this.id = id;
  }

  /**
   * get unique id of the resource
   * @returns string
   */
  public getId(): string {
    return this.id;
  }

  /**
   * set unique id for the resource
   * @param {string} id unique id
   * @returns this
   */
  public setId(id: string): this {
    this.id = id; return this;
  }

  public serialize(): Record<string, any> {
    const result: Record<string, any> = {};
    Object.keys(this).forEach((key: string) => {
      result[key] = this.serializeProperty(this.readProp(this, key));
    });
    return result;
  }

  /**
   *  serializes single property
   */
  private serializeProperty(prop: any): Record<string, any> | number | string | number[] | string[] | null {
    if (typeof prop === 'function') {
      return null;
    } else if (prop instanceof Resource) {
      return prop.serialize();
    } else if (Array.isArray(prop)) {
      return prop.map((p) => {
        // this.serializeProperty(p);
        return 'Hallo';
      });
    } else if (prop instanceof Date) {
      return prop.getTime();
    } else {
      return prop;
    }
  }

  private readProp(obj: any, prop: string) {
    return obj[prop];
  }

}
