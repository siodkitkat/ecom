import Drawer from "../Drawer";
import { GiHamburgerMenu } from "react-icons/gi";

const AuthLinks = () => {
  return (
    <>
      <a className="underline-teal-anim text-xl md:text-[2rem]" href="/login">
        Login
      </a>
      <a className="underline-teal-anim text-xl md:text-[2rem]" href="/register">
        Register
      </a>
    </>
  );
};

const Navbar = () => {
  return (
    <nav className="flex h-max w-full py-[2em] text-xl md:text-[2rem] md:leading-10">
      <div className="mx-[1em] flex h-max flex-grow items-center font-[600]">
        <div className="flex h-max flex-grow justify-evenly">
          <a className="underline-teal-anim" href="/">
            Home
          </a>
          <button className="underline-teal-anim">Search</button>
          <Drawer
            className="lg:hidden"
            Opener={
              <button className="underline-teal-anim lg:hidden">
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
