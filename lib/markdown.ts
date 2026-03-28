/**
 * Processes custom glossary link syntax: [[glossary:term-id|display text]]
 * Converts to a custom HTML span that the GlossaryTooltip component can pick up.
 *
 * We transform BEFORE passing to react-markdown so the markdown parser
 * sees standard markdown syntax.
 */
export function processGlossaryLinks(content: string): string {
  // [[glossary:term-id|display text]] → <glossary-link term="term-id">display text</glossary-link>
  return content.replace(
    /\[\[glossary:([a-z0-9-]+)\|([^\]]+)\]\]/g,
    '<glossary-link term="$1">$2</glossary-link>'
  );
}
