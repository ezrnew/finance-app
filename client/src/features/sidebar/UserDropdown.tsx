import { LogOut, User } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTypedSelector } from "@/hooks/use-redux";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cookies, setCookie } from "@/utils/cookies";
import { useNavigate } from "react-router-dom";

interface Props {}

export function UserSettings({}: Props) {



  const navigate = useNavigate();



  const logOut = () =>{
    setCookie(cookies.auth,'false')
    navigate("/login")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-full" onClick={() => {}}>
          <FontAwesomeIcon className=" h-7 " icon={faUser} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-center absolute bottom-4 left-8">
        <DropdownMenuLabel className="">uusernazwa</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem >
            <button className="flex w-full items-center ">

            <User className="mr-2 h-4 w-4" />
            <span>Settings</span>
            </button>
          </DropdownMenuItem>
          <DropdownMenuItem>
          <button onClick={logOut} className="flex w-full items-center ">

            <LogOut className="mr-2 h-4 w-4" />
            <span>Log Out</span>
            </button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
