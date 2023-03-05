const Navbar = () => {
  //To do add a drawer for mobile

  return (
    <nav className="flex h-max w-full py-[2em] text-xl md:text-[2rem] md:leading-10">
      <div className="mx-[1em] flex h-max flex-grow items-center font-[600]">
        <div className="flex h-max flex-grow justify-evenly">
          <a className="underline-teal-anim" href="/">
            Home
          </a>
          <button className="underline-teal-anim">Search</button>
        </div>

        <div className="invisible absolute flex h-max flex-grow justify-evenly opacity-0 xl:visible xl:relative xl:opacity-100">
          <a className="underline-teal-anim" href="/login">
            Login
          </a>
          <a className="underline-teal-anim" href="/register">
            Register
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
