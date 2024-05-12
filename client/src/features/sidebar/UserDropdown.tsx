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

interface Props {
}

export function UserSettings({  }: Props) {
  const { username } = useTypedSelector((state) => state.auth);

  // user

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="w-full"
          onClick={() => {
          }}
        >
          <FontAwesomeIcon className=" h-7 " icon={faUser} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-center absolute bottom-4 left-8">
        <DropdownMenuLabel className="">{username}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log Out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
