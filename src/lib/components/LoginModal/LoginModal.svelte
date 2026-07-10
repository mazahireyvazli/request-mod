<script lang="ts">
  import { getAppContext } from "$lib/client/app_context.svelte";
  import { auth } from "$lib/client/firebase";
  import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

  const appContext = getAppContext();

    let authEmail = $state("");
  let authPassword = $state("");
  let authError = $state("");
  let isRegistering = $state(false);
  let authLoading = $state(false);


  async function handleAuth() {
    if (!auth) return;
    if (!authEmail.trim() || !authPassword.trim()) {
      authError = "Please enter email and password.";
      return;
    }

    authError = "";
    authLoading = true;

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, authEmail, authPassword);
      } else {
        await signInWithEmailAndPassword(auth, authEmail, authPassword);
      }
      authEmail = "";
      authPassword = "";
    } catch (err: any) {
      console.error(err);
      authError = err.message || "Authentication failed.";
    } finally {
      authLoading = false;
    }
  }

  const extensionSignin = async () => {
    if (!auth) {
      return;
    }

    const authTokenResult = await chrome.identity.getAuthToken({
      interactive: true,
    });

    const userCredential = await signInWithCredential(auth, GoogleAuthProvider.credential(null, authTokenResult.token));

    return userCredential;
  };

  const browserSignin = async () => {
    if (!auth) {
      return;
    }

    const provider = new GoogleAuthProvider();
    provider.addScope("email");
    provider.setCustomParameters({
      prompt: "select_account",
    });

    const userCredential = await signInWithPopup(auth, provider);

    return userCredential;
  };

  async function handleGoogleSignIn() {
    if (!auth) return;
    authError = "";
    authLoading = true;

    try {
      if (appContext.isExtension) {
        // Inside extension service workers / popups, we use chrome.identity.getAuthToken
        await extensionSignin();
      } else {
        // Standard Web mode
        await browserSignin();
        authLoading = false;
      }
    } catch (err: any) {
      console.error("Google sign in failed:", err);
      authError = err.message || "Google sign in failed.";
      authLoading = false;
    }
  }

</script>

<div class="login-overlay">
    <div class="card auth-card login-modal">
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <h1 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: #007bff;">Request Modifier Pro</h1>
        <p style="color: #666; font-size: 0.9rem;">Please sign in to access your request modification rules.</p>
      </div>

      {#if authError}
        <div class="error-msg">{authError}</div>
      {/if}

      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" bind:value={authEmail} placeholder="you@example.com" />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" bind:value={authPassword} placeholder="••••••••" />
      </div>
      <div class="auth-buttons">
        <button class="btn btn-primary" onclick={handleAuth} disabled={authLoading} style="width: 100%;">
          {authLoading ? "Please wait..." : isRegistering ? "Sign Up" : "Sign In"}
        </button>

        <button
          class="btn btn-secondary google-btn"
          onclick={handleGoogleSignIn}
          disabled={authLoading}
          style="margin-top: 0.5rem; display: flex; gap: 0.5rem; width: 100%; justify-content: center; background: #ea4335; color: white;"
        >
          <svg style="width: 18px; height: 18px;" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M21.35,11.1H12V12.9H18c-0.22,1.25-1.04,2.3-2.15,3L17.5,17.4A8.86,8.86,0,0,0,21.35,11.1Z"
            />
            <path
              fill="currentColor"
              d="M12,21.35A8.86,8.86,0,0,0,18,17.4L16.35,15.9A5.6,5.6,0,0,1,12,18a5.55,5.63,0,0,1-5.18-3.83L5.18,15.42A8.93,8.93,0,0,0,12,21.35Z"
            />
            <path fill="currentColor" d="M6.82,14.17A5.55,5.63,0,0,1,6.82,9.83L5.18,8.58A8.93,8.93,0,0,0,5.18,15.42Z" />
            <path
              fill="currentColor"
              d="M12,6A5.55,5.63,0,0,1,16.35,8.1L17.7,6.75A8.93,8.93,0,0,0,12,2.65,8.93,8.93,0,0,0,5.18,8.58L6.82,9.83A5.55,5.63,0,0,1,12,6Z"
            />
          </svg>
          Sign in with Google
        </button>

        <button
          class="btn btn-link"
          onclick={() => (isRegistering = !isRegistering)}
          style="margin-top: 0.5rem; width: 100%; text-align: center;"
        >
          {isRegistering ? "Already have an account? Sign In" : "Need an account? Sign Up"}
        </button>
      </div>
    </div>
  </div>