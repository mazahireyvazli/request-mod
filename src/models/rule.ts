import { GlobalStorage, createStorage } from "../storage/storage";
import { Header } from "./header";

export class Rule {
  constructor(
    public id: string = "",
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

  getRuleById = (id: string) => {
    return this.store.get(id);
  };

  createRule = (name: string) => {
    const uuid = crypto.randomUUID();
    const rule = new Rule(uuid, name);

    return this.store.set(uuid, rule);
  };

  saveRule = (rule: Rule) => {
    return this.store.set(rule.id, rule);
  };
}
