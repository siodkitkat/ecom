import Drawer from "../Drawer";
import { GiHamburgerMenu } from "react-icons/gi";
import useAuth from "../../hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { refetchUser } from "../../contexts/Auth/utils";
import { Link } from "react-router-dom";

const AuthLinks = () => {
  const { isLoggedIn } = useAuth();

  const queryClient = useQueryClient();

  const { mutate: logout, isLoading } = useMutation({
    mutationFn: async () => {
      fetch("/api/logout", {
        method: "POST",
      });
    },
    onSuccess: () => {
      return refetchUser(queryClient);
    },
  });

  return (
    <>
      {isLoggedIn ? (
        <button
          className="underline-pink-anim inline text-start text-xl md:text-[2rem]"
          onClick={
            !isLoading
              ? () => {
                  logout();
                }
              : undefined
          }
        >
          Logout
        </button>
      ) : (
        <>
          <Link className="underline-pink-anim text-xl md:text-[2rem]" to="/login">
            Login
          </Link>
          <Link className="underline-pink-anim text-xl md:text-[2rem]" to="/register">
            Register
          </Link>
        </>
      )}
    </>
  );
};

const Navbar = () => {
  return (
    <nav className="flex h-max w-full py-[2em] text-xl md:text-[2rem] md:leading-10">
      <div className="mx-[1em] flex h-max flex-grow items-center font-[600]">
        <div className="flex h-max flex-grow justify-evenly">
          <Link className="underline-pink-anim" to="/">
            Home
          </Link>
          <Link className="underline-pink-anim" to="/products">
            Products
          </Link>
          <Drawer
            className="lg:hidden"
            Opener={
              <button className="underline-pink-anim lg:hidden">
                <GiHamburgerMenu />
              </button>
            }
          >
            <div className="flex h-full flex-col gap-4 py-4 px-2 text-2xl md:gap-8 md:py-8 md:px-4">
              <AuthLinks />
            </div>
          </Drawer>
        </div>

        <div className="relative hidden h-max flex-grow justify-evenly opacity-0 lg:flex lg:opacity-100">
          <AuthLinks />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
