import Link from "next/link";
import type { ComponentProps } from "react";

type NsLinkProps = ComponentProps<typeof Link>;

/** Internal navigation — pass the full path you need, e.g. `/christian-jobs`. */
export function NsLink(props: NsLinkProps) {
  return <Link {...props} />;
}
