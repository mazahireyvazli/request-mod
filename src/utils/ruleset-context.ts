import { createContext, useEffect, useState } from "react";

import { Rule, RuleSet } from "../models/rule";

import { set } from "lodash";
import { Header } from "../models/header";

export type RuleSetStateHandler = {
  rules: Rule[];
  setRuleStatus: (rule: Rule, active: boolean) => void;
  updateRuleField: (id: number, fieldName: string, fieldValue: any) => void;
  deleteRuleHeader: (header: Header) => void;
  deleteRule: (id: Number) => void;
  createRule: (name: string) => Promise<number>;
  saveRule: (rule: Rule) => Promise<number>;
  ruleSet: RuleSet;
};

export const RuleSetContext = createContext({} as RuleSetStateHandler);

export const ruleSetStateHandler = (ruleSet: RuleSet): RuleSetStateHandler => {
  const [rules, setRules] = useState<Rule[]>([]);

  useEffect(() => {
    ruleSet.getRules().then((rules) => setRules(rules));
  }, []);

  return {
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
    deleteRuleHeader: (header: Header) => {
      setRules((s) => {
        return s.map((r) => {
          return {
            ...r,
            headers: r.headers.filter((h) => h.name !== header.name),
          };
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

            ruleSet.saveRule(updatedRule);

            return updatedRule;
          }

          return r;
        });

        return newState;
      });
    },
    createRule: (name: string) => {
      return ruleSet.createRule(name).then((id) => {
        ruleSet.getRules().then((rules) => setRules(rules));
        return id;
      });
    },
    saveRule: (rule: Rule) => {
      return ruleSet.saveRule(rule);
    },
    ruleSet,
  };
};
