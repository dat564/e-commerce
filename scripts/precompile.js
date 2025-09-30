const http = require("http");

const pages = [
  "/",
  "/login",
  "/register",
  "/products",
  "/categories",
  "/cart",
  "/admin",
  "/admin/products",
  "/admin/categories",
  "/admin/users",
];

const precompilePage = (page) => {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:3000${page}`, (res) => {
      console.log(`✅ Compiled: ${page} (${res.statusCode})`);
      resolve();
    });

    req.on("error", (err) => {
      console.log(`❌ Failed: ${page} - ${err.message}`);
      resolve();
    });

    req.setTimeout(10000, () => {
      console.log(`⏰ Timeout: ${page}`);
      req.destroy();
      resolve();
    });
  });
};

const precompileAll = async () => {
  console.log("🚀 Pre-compiling pages...");

  for (const page of pages) {
    await precompilePage(page);
    // Small delay between requests
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log("✨ Pre-compilation complete!");
};

precompileAll();
