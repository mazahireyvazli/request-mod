import { Type, plainToInstance } from "class-transformer";
import { createStorage } from "../storage/storage";
import { Header } from "./header";
import { GlobalStorage } from "./storage";

export class Rule {
  constructor(
    public id: number = 0,
    public name: string = "",
    headers: Header[] = [],
    public urlPattern: string = "",
    public active = true,
  ) {
    this.headers = headers;
  }

  @Type(() => Header)
  headers: Header[] = [];
}

export class RuleStore {
  private static readonly instance = new RuleStore();

  public static readonly getInstance = () => {
    return this.instance;
  };

  private store: GlobalStorage<Rule>;

  private constructor() {
    this.store = createStorage();
  }

  getAll = () => {
    return this.store.getAll().then((v) => {
      return plainToInstance(Rule, v);
    });
  };

  getById = (id: number) => {
    return this.store.get(id);
  };

  create = async (name: string) => {
    const id = await this.store.getNextId();

    const rule = new Rule(id, name, [new Header()], "*");

    return this.store.set(id, rule);
  };

  save = (rule: Rule) => {
    return this.store.set(rule.id, rule);
  };
}
