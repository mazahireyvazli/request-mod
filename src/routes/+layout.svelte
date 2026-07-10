<script lang="ts">
  import "$lib/assets/css/global.css";

  import { dev } from "$app/environment";
  import { onNavigate } from "$app/navigation";
  import favicon from "$lib/assets/favicon.svg";
  import { setAppContext, type DBUser, type RequestRule } from "$lib/client/app_context.svelte";
  import { auth, db } from "$lib/client/firebase";
  import { removeAllDNRRules, updateExtensionDNRRules } from "$lib/client/rules_manager";
  import Header from "$lib/components/Header/Header.svelte";
  import { onAuthStateChanged } from "firebase/auth";
  import { collection, doc, onSnapshot } from "firebase/firestore";
  import { onMount } from "svelte";

  const appContext = setAppContext();

  const { children } = $props();

  onMount(() => {
    console.log("hydration complete", performance.now());

    setTimeout(
      () => {
        appContext.isInteractive = true;
      },
      performance.now() > 500 ? 0 : 500,
    );
  });

  $effect(() => {
    if (appContext.isInteractive) {
      console.log("interaction ready", performance.now());
    }
  });

  onNavigate((navigation) => {
    if (!document.startViewTransition) return;

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });

  onMount(() => {
    if (!dev && "serviceWorker" in navigator && location.protocol !== "chrome-extension:") {
      const script_url = "/service-worker.js";
      navigator.serviceWorker.register(script_url, { type: "module" }).then(
        (registration) => {
          console.log("Service worker registration succeeded", performance.now());

          registration.addEventListener("updatefound", () => {
            appContext.isUpdateAvailable = true;

            console.log("Service Worker update available");
          });

          navigator.serviceWorker.addEventListener(
            "controllerchange",
            () => {
              console.log("Service Worker controller changed");

              location.reload();
            },
            { once: true },
          );
        },
        (error) => {
          console.error(`Service worker registration failed`, error);
        },
      );
    }
  });

  onMount(() => {
    if (!auth) return;

    onAuthStateChanged(auth, async (user) => {
      appContext.authUser = user;
    });
  });

  $effect(() => {
    if (!appContext.authUser || !db) {
      return;
    }

    const docRef = doc(db, "users", appContext.authUser.uid);
    const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data() as DBUser;
        appContext.dbUser = userData;
      }
    });

    return () => {
      unsubscribe();
    };
  });

  $effect(() => {
    if (!appContext.authUser || !db) {
      return;
    }

    const colRef = collection(db, "users", appContext.authUser.uid, "rules");
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const rules: RequestRule[] = [];
      snapshot.docs.forEach((doc) => {
        const ruleData = doc.data() as RequestRule;
        rules.push(ruleData);
      });
      appContext.rules = rules;
    });

    return () => {
      unsubscribe();
    };
  });

  $effect((rules = appContext.rules, dbUser = appContext.dbUser) => {
    if (!dbUser) {
      return;
    }

    if (!rules) {
      return;
    }

    if(dbUser.isExtensionEnabled === false) {
      console.log("Extension is enabled", dbUser?.isExtensionEnabled);
      removeAllDNRRules();
      return;
    }

    updateExtensionDNRRules($state.snapshot(rules).filter((r) => r.isActive));

  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} type="image/svg+xml" />
</svelte:head>

<div
  class="app-shell"
  class:interactive={appContext.isInteractive}
  class:extension-active={appContext.isExtension}
  class:extension-popup={appContext.isExtensionPopup}
>
  <Header />
  <main>
    {#if !appContext.authUser || !appContext.dbUser}
      <div
        style="display: flex; justify-content: center; align-items: center; height: 100dvh; flex-direction: column; gap: 1rem;"
      >
        <div class="spinner"></div>
        <p>Checking authentication state...</p>
      </div>
    {:else}
      {@render children()}
    {/if}
  </main>
</div>

<style>
  .app-shell {
    display: grid;
    grid-template-rows: auto 1fr;
    height: 100dvh;
  }

  main {
    overflow-y: auto;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--border-color);
    border-top: 4px solid var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
</style>
