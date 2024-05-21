import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { faLanguage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";

interface Props {}
// todo flag icons
export function LanguageDropdown({}: Props) {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
  };

  // user

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-full" onClick={() => {}}>
          <FontAwesomeIcon className=" h-7 " icon={faLanguage} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-center absolute bottom-4 left-8">
        <DropdownMenuLabel className="">{t("language")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              handleLanguageChange("pl");
            }}
          >
            {/* <circle className="mr-2 h-4 w-4" /> */}
            <span className="ml-6">Polish</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              handleLanguageChange("en");
            }}
          >
            <span className="ml-6">English</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
