import { useActions, useTypedSelector } from "@/hooks/use-redux";
import { ls } from "@/utils/localStorage";
import { PlusCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";

export const PortfolioSidebar = () => {
  const { availablePortfolios } = useTypedSelector((state) => state.portfolio);
  const { setCurrentPortfolioId } = useActions();

  let location = useLocation();

  return (
    <div className="max-w-60 xl:w-full w-52 bg-neutral-50  p-4 ">
      <div className="flex justify-between">
        <p className="text-lg font-semibold my-auto">Portfolios</p>
        <Button asChild variant="ghost" size="icon">
          <Link to="new" state={{ background: location }}>
            <PlusCircle />
          </Link>
        </Button>
      </div>

      <div className="h-[1px]  my-1 w-full bg-gray-200" />

      <ul className="flex flex-col py-2 font-semibold">
        {availablePortfolios.map((item) => (
          <li
            onClick={() => {
              setCurrentPortfolioId(item._id);
              ls.setPortfolioId(item._id);
            }}
            key={item._id}
          >
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  );
};
