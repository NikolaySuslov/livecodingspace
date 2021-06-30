// src/utilities/base-path.ts
var basePath = "";
function setBasePath(path) {
  basePath = path;
}
function getBasePath() {
  return basePath.replace(/\/$/, "");
}
if (!basePath) {
  const allScripts = [...document.getElementsByTagName("script")];
  const el = allScripts.find((script) => script.hasAttribute("data-shoelace"));
  if (el) {
    setBasePath(el.getAttribute("data-shoelace"));
  } else {
    const script = document.querySelector('script[src$="shoelace.js"], script[src$="shoelace.min.js"]');
    let path = "";
    if (script) {
      path = script.getAttribute("src");
    }
    setBasePath(path.split("/").slice(0, -1).join("/"));
  }
}

export {
  setBasePath,
  getBasePath
};
