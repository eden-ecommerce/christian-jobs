import {
  DEFAULT_HIERARCHY_SEPARATOR,
  DEFAULT_LABEL_ID_DELIMITER,
} from "@lib/algolia/hierarchical-filter";

/** Strip hierarchical facet encoding (e.g. "Label:::id") from EVERY segment for display. */
export function cleanCategoryLabel(value: string | null): string | null {
  if (!value) return null;
  const separator = DEFAULT_HIERARCHY_SEPARATOR;
  const delimiter = DEFAULT_LABEL_ID_DELIMITER;
  return value
    .split(separator)
    .map((seg) => seg.split(delimiter)[0]?.trim() ?? seg)
    .join(separator);
}
