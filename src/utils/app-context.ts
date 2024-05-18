import { createContext, useEffect, useState } from "react";

import { onAuthStateChanged } from "firebase/auth";
import { set } from "lodash";
import { auth } from "../firebase/init";
import {
  EnvVar,
  EnvironmentAppModel,
  EnvironmentStorage,
} from "../storage/environment.storage";
import {
  NewNetRequestModifyHeaderInfo,
  RuleActionType,
  RuleAppModel,
  RuleStorage,
} from "../storage/rule.storage";
import {
  environmentStorage,
  globalStorage,
  ruleStorage,
  userStorage,
} from "../storage/storage";
import { UserAppModel, UserStorage } from "../storage/user.storage";
import { DocumentID } from "../types/firestore";
import { Nullable } from "../types/nullable";
import { sendMsgToExtension } from "../extension/messaging";
import { MSG_ACTION } from "../types/message";
import { useWithDebounce } from "./hooks";

export const useAppStateHandler = (
  userStore: UserStorage = userStorage,
  ruleStore: RuleStorage = ruleStorage,
  environmentStore: EnvironmentStorage = environmentStorage,
  globalStore = globalStorage,
) => {
  // USER state
  const [currentUser, setCurrentUser] = useState<Nullable<UserAppModel>>(null);
  const [authStateSettled, setAuthStateSettled] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const [userdb, err] = await userStore.get(user.uid);

        if (err !== null) {
          console.log("could not find user");

          const updated = {
            ...currentUser,
            email: user.email,
            document_id: user.uid,
          };

          const [err] = await userStore.set(updated);
          if (err !== null) {
            console.log("could not update user", err, updated);
          }

          setCurrentUser(updated);
        }

        if (userdb) {
          setCurrentUser(userdb);
          setAuthStateSettled(true);
        }

        return;
      }

      setCurrentUser(null);
      setAuthStateSettled(true);

      sendMsgToExtension({
        rules,
        activeEnv: environments.find(
          (e) => e.document_id === currentUser?.active_env_id,
        ),
        action: MSG_ACTION.DISABLE_EXTENSION,
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);
  // end of USER state

  const [isExtensionDisabled, setIsExtensionDisabled] = useState(
    globalStore.isExtensionDisabled(),
  );
  const toggleExtension = () => {
    setIsExtensionDisabled((prevState) => {
      const newState = !prevState;

      sendMsgToExtension({
        rules,
        activeEnv: environments.find(
          (e) => e.document_id === currentUser?.active_env_id,
        ),
        action: newState
          ? MSG_ACTION.DISABLE_EXTENSION
          : MSG_ACTION.ENABLE_EXTENSION,
      });

      globalStore.setIsExtensionDisabled(newState);

      return newState;
    });
  };

  // Rule state
  const [rules, setRules] = useState<RuleAppModel[]>([]);

  const getRulesByUserId = async (user_id: DocumentID) => {
    return ruleStore.getAllByUserId(user_id);
  };
  const addRule = async (
    name: string,
  ): Promise<[Nullable<RuleAppModel>, Nullable<Error>]> => {
    const [data, err] = await ruleStore.add({
      name,
      active: true,
      user_id: currentUser!.document_id!,
      rule: {
        id: 1, // will be overriden by hash code of rule DocumentID
        condition: {
          urlFilter: "*",
        },
        action: {
          type: RuleActionType.MODIFY_HEADERS,
          requestHeaders: [NewNetRequestModifyHeaderInfo()],
          responseHeaders: [],
        },
      },
    });

    if (err !== null) {
      return [null, err];
    }

    if (data) {
      setRules((prevState) => {
        return [...prevState, data];
      });
    }

    return [data, null];
  };

  const deleteRule = async (document_id: DocumentID) => {
    setRules((s) => {
      return s.filter((r) => r.document_id !== document_id);
    });

    return ruleStore.delete(document_id);
  };

  useEffect(() => {
    if (currentUser?.document_id) {
      getRulesByUserId(currentUser.document_id).then(([rules, err]) => {
        if (err) {
          console.log(err);
        }
        if (rules) {
          setRules(rules);
        }
      });
    }
  }, [currentUser?.document_id]);
  // end of rule state

  // Env state
  const [environments, setEnvironments] = useState<EnvironmentAppModel[]>([]);

  const getEnvironmentsByUserId = async (user_id: DocumentID) => {
    return environmentStore.getAllByUserId(user_id);
  };
  const addEnvironment = async (
    name: string,
  ): Promise<[Nullable<EnvironmentAppModel>, Nullable<Error>]> => {
    const [data, err] = await environmentStore.add({
      name,
      user_id: currentUser!.document_id!,
    });

    if (err !== null) {
      return [null, err];
    }

    if (data) {
      setEnvironments((prevState) => {
        return [...prevState, data];
      });
    }

    return [data, null];
  };

  useEffect(() => {
    if (currentUser?.document_id) {
      getEnvironmentsByUserId(currentUser.document_id).then(([rules, err]) => {
        if (err) {
          console.log(err);
        }
        if (rules) {
          setEnvironments(rules);
        }
      });
    }
  }, [currentUser?.document_id]);
  // end of env state

  const withDebounce = useWithDebounce();

  useEffect(() => {
    if (currentUser?.document_id && !globalStore.isExtensionDisabled()) {
      withDebounce(() => {
        sendMsgToExtension({
          rules,
          activeEnv: environments.find(
            (e) => e.document_id === currentUser.active_env_id,
          ),
          action: MSG_ACTION.APPLY_RULES,
        });
      }, 300);
    }
  }, [rules, environments, currentUser?.active_env_id]);

  return {
    isExtensionDisabled,
    isExtensionOpenInPopup: globalStore.isExtensionOpenInPopup(),
    toggleExtension,

    authStateSettled,
    currentUser,
    setActiveEnvironment: (env_id: Nullable<DocumentID>) => {
      setCurrentUser((prevState) => {
        const updated = {
          ...prevState,
          active_env_id: env_id,
        };

        userStore.set(updated);

        return updated;
      });
    },

    rules,
    deleteRule,
    addRule,

    updateRuleField: (
      document_id: DocumentID,
      fieldName: string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fieldValue: any,
    ) => {
      setRules((s) => {
        return s.map((r) => {
          if (r.document_id === document_id) {
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
    deleteRuleHeader: (
      rule: RuleAppModel,
      header: chrome.declarativeNetRequest.ModifyHeaderInfo,
    ) => {
      setRules((s) => {
        return s.map((r) => {
          if (r.document_id === rule.document_id) {
            return {
              ...r,
              rule: {
                ...r.rule,
                action: {
                  ...r.rule?.action,
                  requestHeaders: r.rule?.action?.requestHeaders?.filter(
                    (h) => h.header !== header.header,
                  ),
                },
              },
            };
          }

          return { ...r };
        });
      });
    },
    setRuleStatus: (data: RuleAppModel, active: boolean) => {
      setRules((prevState) => {
        const newState = prevState.map((r) => {
          if (r.document_id === data.document_id) {
            const updatedRule = {
              ...r,
              active: active,
            };

            ruleStore.set(updatedRule);

            return updatedRule;
          }

          return r;
        });

        return newState;
      });
    },
    saveRule: (rule: RuleAppModel) => {
      return ruleStore.set(rule);
    },

    environments,
    updateEnvField: (
      document_id: DocumentID,
      fieldName: string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fieldValue: any,
    ) => {
      setEnvironments((s) => {
        return s.map((r) => {
          if (r.document_id === document_id) {
            const updatedValue = {
              ...set(r, fieldName, fieldValue),
            };

            return updatedValue;
          }
          return {
            ...r,
          };
        });
      });
    },
    deleteVariable: (data: EnvironmentAppModel, variable: EnvVar) => {
      setEnvironments((s) => {
        return s.map((e) => {
          if (data.document_id === e.document_id) {
            const updated = {
              ...e,
              vars: e.vars?.filter((v) => v.name !== variable.name),
            };

            return updated;
          }

          return e;
        });
      });
    },
    createEnv: async (name: string) => {
      return addEnvironment(name);
    },
    saveEnv: (data: EnvironmentAppModel) => {
      return environmentStore.set(data);
    },
    deleteEnv: async (document_id: DocumentID) => {
      setEnvironments((s) => {
        return s.filter((r) => r.document_id !== document_id);
      });

      return await environmentStore.delete(document_id);
    },
  };
};

export const AppContext = createContext(
  {} as ReturnType<typeof useAppStateHandler>,
);
