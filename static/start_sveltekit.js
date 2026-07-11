// GENERATED

if ("serviceWorker" in navigator && location.protocol !== "chrome-extension:" && location.hostname !== "localhost") {
  const script_url = "/service-worker.js";
  navigator.serviceWorker.register(script_url, { type: "module" }).then(
    (registration) => {
      console.log("Service worker registration succeeded", performance.now());

      registration.addEventListener("updatefound", () => {
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
