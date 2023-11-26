import { useContext, useEffect } from "react";

import { initFlowbite } from "flowbite";
import { Link } from "react-router-dom";
import { RuleSetContext } from "../utils/ruleset-context";

export const Sidenav = () => {
  const { rules, setRuleStatus } = useContext(RuleSetContext);

  useEffect(() => {
    initFlowbite();
  }, []);

  return (
    <aside
      id="default-sidenav"
      className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
      aria-label="Sidebar"
      aria-hidden="true"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
        <ul className="my-2">
          <li>
            <Link to="/rules/create">
              <button
                type="button"
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Add new rule
              </button>
            </Link>
          </li>
        </ul>
        <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
        <ul className="my-2 font-medium">
          {rules.map((rule) => {
            return (
              <li key={rule.id} className="flex items-center">
                <input
                  className="mr-3"
                  type="checkbox"
                  checked={rule.active}
                  onChange={(e) => {
                    setRuleStatus(rule, e.target.checked);
                  }}
                />
                <Link
                  className="flex-1 p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  to={`/rules/${rule.id}`}
                >
                  {rule.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};
