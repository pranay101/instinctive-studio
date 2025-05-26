import { useRouter } from "next/navigation";

interface BreadCrumb {
  label: string;
  href: string;
}

interface BreadCrumbsProps {
  breadCrumbs: BreadCrumb[];
}

export default function BreadCrumbs({ breadCrumbs }: BreadCrumbsProps) {
  const router = useRouter();

  return (
    <div className="breadcrumbs text-sm">
      <ul>
        {breadCrumbs.map((crumb) => (
          <li key={crumb.href}>
            <button 
              onClick={() => router.push(crumb.href)}
              className="hover:underline"
            >
              {crumb.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
