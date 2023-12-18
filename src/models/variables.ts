import { Type, plainToInstance } from "class-transformer";
import { createStorage } from "../storage/storage";
import { appID } from "../utils/common";
import { GlobalStorage } from "./storage";

export class Var {
  constructor(
    public name: string = "",
    public value: string = "",
  ) {}
}

export class Env {
  constructor(
    public id: number = 0,
    public name: string = "",
    public active: boolean = false,
    vars: Var[] = [],
  ) {
    this.vars = vars;
  }

  @Type(() => Var)
  vars: Var[];

  getVarsKV = () => {
    return this.vars.reduce((a, b) => {
      return {
        ...a,
        [b.name]: b.value,
      };
    }, {});
  };
}

export class EnvVarStore {
  private static readonly instance = new EnvVarStore();

  public static readonly getInstance = () => {
    return this.instance;
  };

  private store: GlobalStorage<Env>;

  private constructor() {
    this.store = createStorage(
      `${appID}-envvars-db_`,
      `${appID}-envvars-lastid`,
    );
  }

  getAll = () => {
    return this.store.getAll().then((v) => plainToInstance(Env, v));
  };

  getById = (id: number) => {
    return this.store.get(id);
  };

  create = async (name: string) => {
    const id = await this.store.getNextId();

    const entity = new Env(id, name);

    return this.store.set(id, entity);
  };

  save = (entity: Env) => {
    return this.store.set(entity.id, entity);
  };

  delete = (id: number) => {
    return this.store.delete(id);
  };
}
