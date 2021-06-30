// src/components/include/request.ts
var includeFiles = new Map();
var requestInclude = async (src, mode = "cors") => {
  if (includeFiles.has(src)) {
    return includeFiles.get(src);
  } else {
    const request = fetch(src, { mode }).then(async (response) => {
      return {
        ok: response.ok,
        status: response.status,
        html: await response.text()
      };
    });
    includeFiles.set(src, request);
    return request;
  }
};

export {
  requestInclude
};
