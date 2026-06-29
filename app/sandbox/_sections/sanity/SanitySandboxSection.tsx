import { IntegrationEnvError } from "@/components/common/IntegrationEnvError";
import { JsonBlock } from "@app/sandbox/_components/JsonBlock";
import { StatusList, StatusRow } from "@app/sandbox/_components/StatusRow";
import { getFooter } from "@lib/sanity/get-footer";
import { getHeader } from "@lib/sanity/get-header";
import { isSanityEnvConfigured } from "@lib/env-configured.server";

export async function SanitySandboxSection() {
  if (!isSanityEnvConfigured()) {
    return (
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Sanity CMS — Site chrome</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The root layout renders static Eden chrome via{" "}
            <code className="font-mono text-xs">SanityHeader</code>,{" "}
            <code className="font-mono text-xs">SanityPreFooter</code>, and{" "}
            <code className="font-mono text-xs">SanityFooter</code>. This section
            shows live Sanity payloads from{" "}
            <code className="font-mono text-xs">getHeader()</code> /{" "}
            <code className="font-mono text-xs">getFooter()</code> for debugging.
          </p>
        </div>
        <IntegrationEnvError integration="sanity" />
      </section>
    );
  }

  const [header, footer] = await Promise.all([getHeader(), getFooter()]);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Sanity CMS — Site chrome</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Live navigation and footer chrome appear above and below this page (static{" "}
          <code className="font-mono text-xs">SanityHeader</code> /{" "}
          <code className="font-mono text-xs">SanityPreFooter</code> /{" "}
          <code className="font-mono text-xs">SanityFooter</code>). This section
          shows fetched Sanity payloads used by the lib getters.
        </p>
      </div>

      <StatusList>
        <StatusRow
          label="Header loaded"
          value={header ? "yes" : "no"}
          detail={
            header
              ? `${header.navigationBar.length} nav item(s); logo: ${header.logoVariant}; mega-nav: ${header.navigationBar.filter((item) => (item.megaNav?.megaNavBlocks.length ?? 0) > 0).length} item(s)`
              : "getHeader() returned null — check GROQ, credentials, or document ID."
          }
        />
        <StatusRow
          label="Footer loaded"
          value={footer ? "yes" : "no"}
          detail={
            footer
              ? `${footer.footerInfo.length} info item(s), ${footer.footerLinks.length} link(s)`
              : "getFooter() returned null — check GROQ, credentials, or document ID."
          }
        />
      </StatusList>

      {header ? <JsonBlock label="Mapped header payload" value={header} /> : null}
      {footer ? <JsonBlock label="Mapped footer payload" value={footer} /> : null}
    </section>
  );
}
