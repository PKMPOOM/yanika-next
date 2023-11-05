import React from "react";

type Container = {
  children: React.ReactNode;
  debug?: boolean;
};

function Container({ children, debug = false }: Container) {
  return (
    <main
      className={`relative flex min-h-full items-center justify-center  px-8 xl:px-0 ${
        debug && "bg-red-50 outline outline-red-400"
      }`}
    >
      <div className=" flex w-full max-w-7xl flex-col pt-6 ">{children}</div>
      {debug && (
        <div className="absolute left-0 top-0 flex gap-2 rounded-md sm:bg-red-200 md:bg-yellow-200 lg:bg-blue-200 xl:bg-emerald-200 2xl:bg-orange-200">
          <div className=" hidden p-2 sm:flex">sm</div>
          <div className=" hidden p-2 md:flex">md</div>
          <div className=" hidden p-2 lg:flex">lg</div>
          <div className=" hidden p-2 xl:flex">xl</div>
          <div className=" hidden p-2 2xl:flex">2xl</div>
        </div>
      )}
    </main>
  );
}

export default Container;
