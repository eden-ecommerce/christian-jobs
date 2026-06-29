import next from "eslint-config-next";

const absolutePathMessage =
  "Root-relative URL breaks on Cloudflare Worker. Use @public, assetUrl(), apiFetch, or NsLink. See PROJECT_RULES.md.";

const eslintConfig = [
  ...next,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "*.tsbuildinfo",
      "next.config.ts",
    ],
  },
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../*", "./*"],
              message: "Use @ aliases — no relative imports. See PROJECT_RULES.md.",
            },
            {
              group: [
                "components/*",
                "providers/*",
                "hooks/*",
                "lib/*",
                "app/*",
                "types/*",
                "public/*",
              ],
              message:
                "Use @ alias prefix (@components/*, @hooks/*, etc.). See PROJECT_RULES.md.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    ignores: [
      "lib/apiFetch.ts",
      "node_modules/@eden-ecommerce/lib/src/eden/fetch.ts",
      "node_modules/@eden-ecommerce/lib/src/eden/fetch-client.ts",
      "node_modules/@eden-ecommerce/lib/src/sanity/direct-fetch.ts",
      "node_modules/@eden-ecommerce/lib/src/sanity/fetch.ts",
      "app/api/**",
      "hooks/**/fetch-*.ts",
      "components/jobs/SavedJobsPageClient.tsx",
    ],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "CallExpression[callee.name='fetch']",
          message: "Use a React Query hook from @hooks/* — see PROJECT_RULES.md.",
        },
        {
          selector: "CallExpression[callee.name='apiFetch']",
          message:
            "apiFetch only in hooks/**/fetch-*.ts, lib/, or app/api/. See PROJECT_RULES.md.",
        },
        {
          selector:
            "JSXAttribute[name.name='src'] > Literal[value=/^\\//]",
          message: absolutePathMessage,
        },
        {
          selector:
            "JSXOpeningElement[name.name='a'] JSXAttribute[name.name='href'] > Literal[value=/^\\//]",
          message:
            "Use NsLink for internal links. Root-relative <a href> breaks routing. See PROJECT_RULES.md.",
        },
        {
          selector:
            "Property[key.name='url'] > Literal[value=/^\\//]",
          message: absolutePathMessage,
        },
      ],
    },
  },
];

export default eslintConfig;
