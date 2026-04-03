type SeoInput = {
  title: string;
  description: string;
};

/** Meta entries for the root route `head` (TanStack Router). */
export function seo({ title, description }: SeoInput) {
  return [
    { title },
    { name: "description", content: description },
  ] as const;
}
