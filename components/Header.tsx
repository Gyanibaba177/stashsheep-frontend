import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-blush-light bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid grid-cols-2 gap-[2px]" aria-hidden="true">
            <span className="h-2 w-2 rounded-[1px] bg-magenta" />
            <span className="h-2 w-2 rounded-[1px] bg-blush" />
            <span className="h-2 w-2 rounded-[1px] bg-blush" />
            <span className="h-2 w-2 rounded-[1px] bg-magenta" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-plum">
            stashsheep
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/browse"
            className="text-sm font-medium text-plum-soft transition-colors hover:text-magenta-dark"
          >
            Browse space
          </Link>
          <Link
            href="/list-your-space"
            className="text-sm font-medium text-plum-soft transition-colors hover:text-magenta-dark"
          >
            List your space
          </Link>
          <Link
            href="/how-it-works"
            className="text-sm font-medium text-plum-soft transition-colors hover:text-magenta-dark"
          >
            How it works
          </Link>
        </nav>

        <Link
          href="/list-your-space"
          className="rounded-full bg-magenta px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-magenta-dark"
        >
          List your space
        </Link>
      </div>
    </header>
  );
}
