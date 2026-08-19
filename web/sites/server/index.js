const addSecurityHeaders = (response) => {
  const headers = new Headers(response.headers);
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "SAMEORIGIN");

  return new Response(response.body, {
    headers,
    status: response.status,
    statusText: response.statusText
  });
};

const assetRequest = (request, pathname) => {
  const url = new URL(request.url);
  url.pathname = pathname;
  return new Request(url, request);
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const directResponse = await env.ASSETS.fetch(request);

    if (directResponse.status !== 404 || url.pathname.includes(".")) {
      return addSecurityHeaders(directResponse);
    }

    const pagePath = url.pathname.endsWith("/")
      ? `${url.pathname}index.html`
      : `${url.pathname}/index.html`;
    const pageResponse = await env.ASSETS.fetch(assetRequest(request, pagePath));

    if (pageResponse.status !== 404) {
      return addSecurityHeaders(pageResponse);
    }

    const notFoundResponse = await env.ASSETS.fetch(assetRequest(request, "/404.html"));
    return addSecurityHeaders(
      new Response(notFoundResponse.body, {
        headers: notFoundResponse.headers,
        status: 404,
        statusText: "Not Found"
      })
    );
  }
};
