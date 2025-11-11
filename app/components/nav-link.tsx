import Link from "next/link";

interface NavLinkProps {
  link: string;
  title: string;
  icon: string;
  isPath: boolean;
  onClick: () => void;
}

export default function NavLink(props: NavLinkProps) {
  return (
    <Link
      onClick={props.onClick}
      href={props.link}
      className="sidebar-nav-link">
      <li
        className={`sidebar-nav-item ${
          props.isPath && "sidebar-nav-link-active"
        }`}>
        <i className={`fas ${props.icon} mr-2`}></i>
        <span>{props.title}</span>
      </li>
    </Link>
  );
}
