import { createContext, useEffect, useState } from "react";

import { Rule, RuleStore } from "../models/rule";

import { set } from "lodash";
import { Header } from "../models/header";
import { Env, EnvVarStore, Var } from "../models/variables";

export type AppStateHandler = {
  ruleStore: RuleStore;
  rules: Rule[];
  setRuleStatus: (rule: Rule, active: boolean) => void;
  updateRuleField: (id: number, fieldName: string, fieldValue: any) => void;
  deleteRuleHeader: (rule: Rule, header: Header) => void;
  deleteRule: (id: Number) => void;
  createRule: (name: string) => Promise<number>;
  saveRule: (rule: Rule) => Promise<number>;
  envVarStore: EnvVarStore;
  envs: Env[];
  updateEnvField: (id: number, fieldName: string, fieldValue: any) => void;
  deleteVariable: (env: Env, v: Var) => void;
  createEnv: (name: string) => Promise<number>;
  setActiveEnv: (id: number) => void;
};

export const appContext = createContext({} as AppStateHandler);

export const appStateHandler = (
  ruleStore = RuleStore.getInstance(),
  envVarStore = EnvVarStore.getInstance(),
): AppStateHandler => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [envs, setEnvs] = useState<Env[]>([]);

  useEffect(() => {
    ruleStore.getAll().then((data) => setRules(data));
    envVarStore.getAll().then((data) => setEnvs(data));
  }, []);

  return {
    ruleStore,
    rules,
    updateRuleField: (id: number, fieldName: string, fieldValue: any) => {
      setRules((s) => {
        return s.map((r) => {
          if (r.id === id) {
            return {
              ...set(r, fieldName, fieldValue),
            };
          }
          return {
            ...r,
          };
        });
      });
    },
    deleteRuleHeader: (rule: Rule, header: Header) => {
      setRules((s) => {
        return s.map((r) => {
          if (r.id === rule.id) {
            return {
              ...r,
              headers: r.headers.filter((h) => h.name !== header.name),
            };
          }

          return r;
        });
      });
    },
    deleteRule: (id: Number) => {
      setRules((s) => {
        return s.filter((r) => r.id !== id);
      });
    },
    setRuleStatus: (rule: Rule, active: boolean) => {
      setRules((prevState) => {
        const newState = prevState.map((r) => {
          if (r.id === rule.id) {
            const updatedRule = {
              ...r,
              active: active,
            };

            ruleStore.save(updatedRule);

            return updatedRule;
          }

          return r;
        });

        return newState;
      });
    },
    createRule: async (name: string) => {
      const id = await ruleStore.create(name);
      ruleStore.getAll().then((rules) => setRules(rules));
      return id;
    },
    saveRule: (rule: Rule) => {
      return ruleStore.save(rule);
    },

    envVarStore: envVarStore,
    envs: envs,
    updateEnvField: (id: number, fieldName: string, fieldValue: any) => {
      setEnvs((s) => {
        return s.map((r) => {
          if (r.id === id) {
            const updatedValue = {
              ...set(r, fieldName, fieldValue),
            };

            envVarStore.save(updatedValue);

            return updatedValue;
          }
          return {
            ...r,
          };
        });
      });
    },
    deleteVariable: (env: Env, variable: Var) => {
      setEnvs((s) => {
        return s.map((e) => {
          if (env.id === e.id) {
            const updated = {
              ...e,
              vars: e.vars.filter((v) => v.name !== variable.name),
            };

            envVarStore.save(updated);

            return updated;
          }

          return e;
        });
      });
    },
    createEnv: async (name: string) => {
      const id = await envVarStore.create(name);
      envVarStore.getAll().then((data) => setEnvs(data));
      return id;
    },
    setActiveEnv: (id: number) => {
      setEnvs((s) => {
        return s.map((e) => {
          const updated = {
            ...e,
            active: e.id === id,
          };

          envVarStore.save(updated);

          return updated;
        });
      });
    },
  };
};
