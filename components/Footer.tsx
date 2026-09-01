import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-blush-light bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <span className="font-display text-lg font-bold text-plum">stashsheep</span>
            <p className="mt-3 max-w-xs text-sm text-plum-soft">
              Unused space, put to work. Find storage nearby, or turn your spare
              room into monthly income.
            </p>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-plum">
              Renters
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-plum-soft">
              <li>
                <Link href="/browse" className="hover:text-magenta-dark">
                  Browse space
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-magenta-dark">
                  How it works
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-plum">
              Hosts
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-plum-soft">
              <li>
                <Link href="/list-your-space" className="hover:text-magenta-dark">
                  List your space
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-blush-light pt-6 text-xs text-plum-soft">
          © {new Date().getFullYear()} stashsheep. Built as an early MVP — pricing and
          availability shown are sample data.
        </div>
      </div>
    </footer>
  );
}
