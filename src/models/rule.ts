import { GlobalStorage, createStorage } from "../storage/storage";
import { Header } from "./header";

export class Rule {
  constructor(
    public id: number = 0,
    public name: string = "",
    public headers: Header[] = [],
    public urlPattern: string = "",
  ) {}
}

export class RuleSet {
  private static readonly instance = new RuleSet();

  public static readonly getInstance = () => {
    return this.instance;
  };

  private store: GlobalStorage<Rule>;

  private constructor() {
    this.store = createStorage();
  }

  getRules = () => {
    return this.store.getAll();
  };

  getRuleById = (id: number) => {
    return this.store.get(id);
  };

  createRule = async (name: string) => {
    const id = await this.store.getNextId();

    const rule = new Rule(id, name);

    return this.store.set(id, rule);
  };

  saveRule = (rule: Rule) => {
    return this.store.set(rule.id, rule);
  };
}
