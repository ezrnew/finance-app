import { cn } from "@/lib/utils";
import {
  faChalkboard,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { LanguageDropdown } from "./LanguageDropdown";
import { UserSettings } from "./UserDropdown";
import { useActions, useTypedSelector } from "@/hooks/use-redux";

export const Sidebar = () => {
  const { showPortfolioSidebar } = useTypedSelector((state) => state.misc);
  const { setShowPortfolioSidebar } = useActions();
  return (
    <div className="w-16 min-w-16 flex flex-col h-full bg-neutral-100 border border-r py-4 space-y-3 justify-between  ">
      <div className="space-y-3 ">
        <div className="flex">
          <Link
            onClick={() => {
              if (location.pathname.startsWith("/portfolio"))
                setShowPortfolioSidebar(!showPortfolioSidebar);
            }}
            className="mx-auto "
            to={"/portfolio"}
          >
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

      <div className="flex flex-col space-y-2">
        <div className="flex">
          <LanguageDropdown />
        </div>
        <div className=" w-1/2 h-[1px] my-2 bg-gray-300 mx-auto"></div>
        <div className="flex">
          <UserSettings />
        </div>
      </div>
    </div>
  );
};

function activeLink(pathname: string) {
  return location.pathname.startsWith(pathname) ? "text-blue-400" : "";
}
