import { Button, Label, Modal, TextInput } from "flowbite-react";
import { FirebaseError } from "firebase/app";
import { useRef, useState } from "react";
import {
  signIn,
  signInWithEmail,
  signUpWithEmail,
  linkEmailToGoogle,
} from "../firebase/auth";
import { SigninButton } from "./SigninButton";

export type SigninModalProps = {
  show: boolean;
  onClose?: () => void;
};

export const SigninModal = ({ show, onClose }: SigninModalProps) => {
  const modalRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsLinking, setNeedsLinking] = useState(false);

  const handleEmailAuth = async (isSignUp: boolean) => {
    setError("");
    setNeedsLinking(false);
    setLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (e) {
      if (
        e instanceof FirebaseError &&
        e.code === "auth/email-already-in-use"
      ) {
        setNeedsLinking(true);
        setError(
          "This email is already used with Google sign-in. Link your accounts to also use email/password.",
        );
      } else {
        setError((e as Error).message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLink = async () => {
    setError("");
    setLoading(true);
    try {
      await linkEmailToGoogle(email, password);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
      setNeedsLinking(false);
    }
  };

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
              <h2 className="text-lg pb-6">Please sign in to continue</h2>

              <div className="flex flex-col gap-4 text-left">
                <div>
                  <Label htmlFor="email" value="Email" />
                  <TextInput
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="password" value="Password" />
                  <TextInput
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                {needsLinking ? (
                  <Button
                    color="purple"
                    onClick={handleLink}
                    disabled={loading}
                  >
                    Sign in with Google & Link Accounts
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      color="purple"
                      className="flex-1"
                      onClick={() => handleEmailAuth(false)}
                      disabled={loading}
                    >
                      Sign In
                    </Button>
                    <Button
                      color="light"
                      className="flex-1"
                      onClick={() => handleEmailAuth(true)}
                      disabled={loading}
                    >
                      Sign Up
                    </Button>
                  </div>
                )}

                <div className="flex items-center gap-2 py-2">
                  <hr className="flex-1 border-gray-300" />
                  <span className="text-sm text-gray-500">or</span>
                  <hr className="flex-1 border-gray-300" />
                </div>
              </div>

              <SigninButton
                onClick={async () => {
                  try {
                    await signIn();
                  } catch (error) {
                    alert(error);
                  }
                }}
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
