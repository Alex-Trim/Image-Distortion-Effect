import ghPages from "vite-plugin-gh-pages";

ghPages
  .publish({
    outDir: "dist",
  })
  .then(() => console.log("Deploy successful!"))
  .catch((error) => console.error("Deploy failed:", error));
