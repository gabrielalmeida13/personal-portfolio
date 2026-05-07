import { NowPlaying } from "@/components/layout/NowPlaying";

export function LiveBar() {
  return (
    <div
      className="fixed bottom-0 w-full z-50 backdrop-blur-md bg-background/70 border-t border-border/50"
      role="complementary"
      aria-label="Now playing"
    >
      <div className="mx-auto flex h-10 max-w-6xl items-center px-4">
        <NowPlaying />
      </div>
    </div>
  );
}
