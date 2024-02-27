import { useContext, useEffect, useState } from "react";

import { initFlowbite } from "flowbite";
import { Link, useNavigate } from "react-router-dom";
import { appContext } from "../utils/app-context";
import { Button, Modal, Tooltip } from "flowbite-react";
import { DocumentID } from "../types/firestore";
import { useWithDebounce } from "../utils/hooks";
import { signOut } from "../firebase/auth";
import clsx from "clsx";

export const Sidenav = () => {
  const navigate = useNavigate();

  const {
    rules: rules,
    setRuleStatus,
    deleteRule,
    isExtensionDisabled,
    toggleExtension,
  } = useContext(appContext);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRuleId, setSelectedRuleId] = useState<DocumentID>();
  const [isDeletingRule, setIsDeleteingRule] = useState(false);

  const deleteWithDebounce = useWithDebounce();

  const handleOpenModal = (document_id: DocumentID) => {
    setShowDeleteModal(true);
    setSelectedRuleId(document_id);
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setSelectedRuleId(undefined);
  };

  const handleConfirmModal = async () => {
    setIsDeleteingRule(true);
    deleteWithDebounce(async () => {
      await deleteRule(selectedRuleId!);
      navigate("/");
      setIsDeleteingRule(false);
      handleCloseModal();
    });
  };

  const handleCancelModal = () => {
    handleCloseModal();
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleToggleExtension = async () => {
    toggleExtension();
  };

  useEffect(() => {
    initFlowbite();
  }, []);

  return (
    <aside
      id="default-sidenav"
      className="flex flex-col fixed top-0 left-0 z-40 w-64 h-screen pt-20 px-3 pb-4  transition-transform -translate-x-full bg-white border-r 
      border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
      aria-label="Sidebar"
      aria-hidden="true"
    >
      <div className="flex-none">
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
        <hr className="flex-none h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
      </div>

      <section className="overflow-y-auto flex-grow">
        <ul className="my-2 font-medium">
          {rules.map((rule) => {
            return (
              <li key={rule.document_id} className="flex items-center">
                <div className="mr-3">
                  <Tooltip
                    placement="right"
                    content={rule.active ? "Deactivate rule" : "Activate rule"}
                  >
                    <input
                      type="checkbox"
                      checked={!!rule.active}
                      onChange={(e) => {
                        setRuleStatus(rule, e.target.checked);
                      }}
                    />
                  </Tooltip>
                </div>
                <Link
                  className="flex-1 p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  to={`/rules/${rule.document_id}`}
                >
                  {rule.name}
                </Link>
                <button
                  className="px-2"
                  onClick={() => {
                    handleOpenModal(rule.document_id!);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                    stroke="currentColor"
                    className="w-5 h-5 stroke-current hover:stroke-red-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="flex-none">
        <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
        <ul>
          <li className="mb-3">
            <button
              onClick={() => {
                handleToggleExtension();
              }}
              type="button"
              className={clsx(
                "w-full flex items-center justify-center mr-3 text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-4 py-2 dark:focus:ring-blue-800",
                {
                  "bg-yellow-700 hover:bg-yellow-800 dark:bg-yellow-600 dark:hover:bg-yellow-700":
                    !isExtensionDisabled,
                  "bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700":
                    isExtensionDisabled,
                },
              )}
            >
              <span className="flex items-center transition-all duration-200 rounded-md text-sm">
                {isExtensionDisabled ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 mr-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 mr-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                )}

                {isExtensionDisabled ? "Enable" : "Disable"}
              </span>
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                handleSignOut();
              }}
              type="button"
              className="w-full flex items-center justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <span className="flex items-center transition-all duration-200 rounded-md text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 mr-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                  />
                </svg>
                Sign out
              </span>
            </button>
          </li>
        </ul>
      </div>

      <Modal
        show={showDeleteModal}
        size="md"
        onClose={() => {
          setShowDeleteModal(false);
        }}
        popup
      >
        <Modal.Body>
          <div className="text-center p-3">
            <div className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-14 h-14"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                />
              </svg>
            </div>

            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this entity?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="warning"
                onClick={() => handleConfirmModal()}
                disabled={isDeletingRule}
                isProcessing={isDeletingRule}
              >
                {"Yes, I'm sure"}
              </Button>
              <Button
                color="gray"
                onClick={() => handleCancelModal()}
                disabled={isDeletingRule}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </aside>
  );
};
