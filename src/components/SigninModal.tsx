import { Modal, Spinner } from "flowbite-react";
import { useRef } from "react";
import { signIn } from "../firebase/auth";
import { SigninButton } from "./SigninButton";

export type SigninModalProps = {
  show: boolean;
  onClose?: () => void;
  loading: boolean;
};

export const SigninModal = ({ show, onClose, loading }: SigninModalProps) => {
  const modalRef = useRef(null);

  return (
    <>
      <Modal
        show={show}
        size="md"
        popup
        onClose={onClose}
        initialFocus={modalRef}
        dismissible={false}
      >
        <Modal.Body>
          <div className="text-center p-6 pb-1" ref={modalRef}>
            <div className="p-6">
              {loading && (
                <div className="text-center">
                  <Spinner aria-label="Loading user" size="xl" color="purple" />
                </div>
              )}
              {!loading && (
                <>
                  <h2 className="text-lg pb-6">Please sign in to continue</h2>
                  <SigninButton
                    onClick={async () => {
                      try {
                        await signIn();
                      } catch (error) {
                        alert(error);
                      }
                    }}
                  />
                </>
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
