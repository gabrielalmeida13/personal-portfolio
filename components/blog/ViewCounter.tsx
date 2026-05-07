"use client";

import { useEffect, useRef, useState } from "react";
import { Eye } from "lucide-react";

type Props = {
  slug: string;
};

export function ViewCounter({ slug }: Props) {
  const [views, setViews] = useState<number | null>(null);
  const incremented = useRef(false);

  useEffect(() => {
    if (incremented.current) return;
    incremented.current = true;

    fetch(`/api/views/${slug}`, { method: "POST" })
      .then((r) => r.json())
      .then((data: { views: number | null }) => {
        if (data.views !== null) setViews(data.views);
      })
      .catch(() => {});
  }, [slug]);

  if (views === null) return null;

  return (
    <span className="flex items-center gap-1.5 font-mono text-xs text-foreground-muted">
      <Eye size={12} />
      {views} {views === 1 ? "view" : "views"}
    </span>
  );
}
