const ALLOWED_TAGS = new Set([
  "P",
  "BR",
  "STRONG",
  "B",
  "EM",
  "I",
  "U",
  "OL",
  "UL",
  "LI",
  "SUP",
  "SUB",
  "SPAN",
]);

const ALLOWED_STYLES = new Set(["font-weight", "font-style", "text-decoration"]);

export function sanitizeRichTextHtml(value?: string | null): string {
  if (!value) return "";

  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    return value;
  }

  const parser = new DOMParser();
  const document = parser.parseFromString(`<div>${value}</div>`, "text/html");

  const cleanNode = (node: Node) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const element = child as HTMLElement;
        if (!ALLOWED_TAGS.has(element.tagName)) {
          element.replaceWith(...Array.from(element.childNodes));
          return;
        }

        Array.from(element.attributes).forEach((attribute) => {
          if (attribute.name !== "style") {
            element.removeAttribute(attribute.name);
            return;
          }

          const safeStyles = attribute.value
            .split(";")
            .map((style) => style.trim())
            .filter((style) => {
              const [name] = style.split(":").map((part) => part.trim().toLowerCase());
              return ALLOWED_STYLES.has(name);
            });

          if (safeStyles.length) {
            element.setAttribute("style", safeStyles.join("; "));
          } else {
            element.removeAttribute("style");
          }
        });
      }

      cleanNode(child);
    });
  };

  cleanNode(document.body);

  return document.body.firstElementChild?.innerHTML ?? "";
}

export function stripHtmlToPreviewText(value?: string | null): string {
  if (!value) return "";

  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  }

  const parser = new DOMParser();
  const document = parser.parseFromString(value, "text/html");
  return (document.body.textContent ?? "").replace(/\s+/g, " ").trim();
}
