// Re-export HeaderSearch from the shared site-chrome package.
// The package version accepts algoliaAppId/algoliaSearchKey as explicit props
// rather than reading from process.env directly, so the consuming EdenHeader
// component passes them in from layout.tsx.
export { HeaderSearch } from "@eden-ecommerce/site-chrome/components";
