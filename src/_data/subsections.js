import sections from "./sections.json" with { type: "json" };

export default function () {
  return sections.flatMap(s =>
    (s.subsections || []).map(sub => ({ ...sub, section: s.slug, sectionTitle: s.title }))
  );
}
