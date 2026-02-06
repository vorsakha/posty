import { LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export const Header = () => {
  const { logout } = useAuth();

  return (
    <header className="w-full bg-[#7695EC] py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <h1 className="text-white text-[22px] font-bold">CodeLeap Network</h1>
        <button
          onClick={logout}
          className="flex items-center cursor-pointer gap-2 text-white hover:opacity-70 transition-opacity"
          aria-label="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};
