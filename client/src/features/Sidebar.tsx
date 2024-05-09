import { cn } from "@/lib/utils";
import { faChalkboard, faLineChart, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export const Sidebar = () => {
  return (
    <div className="w-16 h-full bg-neutral-100 border border-r py-4 space-y-3  ">
      {/* <LucidePieChart className='size-10'/> */}
      <div className="flex">
        <Link className="mx-auto " to={"/portfolio"}>
          <FontAwesomeIcon
            className={cn("w-full size-8 ", activeLink("/portfolio"))}
            icon={faChalkboard}
          ></FontAwesomeIcon>
        </Link>
      </div>
      <div className="flex">
        <Link className="mx-auto" to={"/tools"}>
          <FontAwesomeIcon
            className={cn("w-full size-8 ", activeLink("/tools"))}
            icon={faMagnifyingGlass}
          />
        </Link>
      </div>
    </div>
  );
};

function activeLink(pathname: string) {
  return  location.pathname.startsWith(pathname) ? "text-blue-400" : "";
}
