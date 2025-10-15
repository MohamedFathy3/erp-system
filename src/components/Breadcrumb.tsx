"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumb() {
  const pathname = usePathname();

  const pathParts = pathname.split("/").filter(Boolean);

  const crumbs = pathParts.map((part, index) => {
    const href = "/" + pathParts.slice(0, index + 1).join("/");
    const label = decodeURIComponent(part).replace(/-/g, " ");

    return {
      label: label.charAt(0).toUpperCase() + label.slice(1),
      href,
      isLast: index === pathParts.length - 1,
    };
  });

  return (
    <nav className="text-sm text-blue-800  dark:text-gray-300 mb-4">
      <ol className="flex flex-wrap items-center space-x-2">
        <li>
          <Link href="/" className="hover:underline">
            Dashboard
          </Link>
        </li>
        {crumbs.map((crumb, index) => (
          <li key={index} className="flex items-center space-x-2">
            <span className="mx-1">›</span>
            {crumb.isLast ? (
              <span className="font-semibold">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="hover:underline capitalize">
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
