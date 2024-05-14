import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  faChalkboard,
  faCircleHalfStroke,
  faLanguage,
  faLineChart,
  faMagnifyingGlass,
  faMoon,
  faSun,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router-dom";
import { UserSettings } from "./UserDropdown";
import { LanguageDropdown } from "./LanguageDropdown";
import { ls } from "@/utils/localStorage";
import { Moon, Sun } from "lucide-react";

export const Sidebar = () => {
  return (
    <div className="w-16 flex flex-col h-full bg-neutral-100 border border-r py-4 space-y-3 justify-between  ">
      {/* <LucidePieChart className='size-10'/> */}
      <div className="space-y-3 ">
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

      <div className="flex flex-col space-y-2">
        {/* //todo finish dark mode */}
        {/* <div className="flex mx-auto">
          <Button
            variant={"ghost"}
            onClick={() => {
              console.log("exd");
              ls.setDarkMode(ls.getDarkMode() === "1" ? "0" : "1");
            }}
          >
            {ls.getDarkMode() === "1" ? <Moon /> : <Sun />}
          </Button>
        </div> */}

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
