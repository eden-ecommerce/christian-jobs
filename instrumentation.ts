export const register = async () => {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }

  // Forward @eden-ecommerce/blog-kit internal errors (Sanity/Algolia fetch and
  // parse failures) to Sentry instead of the default console.error.
  if (
    process.env.NEXT_RUNTIME === "nodejs" ||
    process.env.NEXT_RUNTIME === "edge"
  ) {
    const [{ setBlogKitReporter }, Sentry] = await Promise.all([
      import("@eden-ecommerce/blog-kit/reporting"),
      import("@sentry/nextjs"),
    ]);
    setBlogKitReporter((error) => Sentry.captureException(error));
  }
};
