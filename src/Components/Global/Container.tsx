import React from "react";

type Container = {
  children: React.ReactNode;
  debug?: boolean;
  margin?: boolean;
  nopadding?: boolean;
};

function Container({
  children,
  debug = false,
  margin = true,
  nopadding = false,
}: Container) {
  return (
    <main
      className={`relative ${nopadding ? "px-0" : "px-4"} ${
        margin && "mt-10"
      } flex min-h-full items-start justify-center xl:px-0 ${
        debug && "bg-red-100 outline"
      }`}
    >
      <div
        className={`flex w-full max-w-7xl flex-col ${margin ? "pt-6" : null} `}
      >
        {children}
      </div>

      {debug && (
        <div className="fixed left-5 top-5 flex gap-2 rounded-md sm:bg-red-200 md:bg-yellow-200 lg:bg-blue-200 xl:bg-emerald-200 2xl:bg-orange-200">
          <div className="hidden p-2 sm:flex">sm</div>
          <div className="hidden p-2 md:flex">md</div>
          <div className="hidden p-2 lg:flex">lg</div>
          <div className="hidden p-2 xl:flex">xl</div>
          <div className="hidden p-2 2xl:flex">2xl</div>
        </div>
      )}
    </main>
  );
}

export default Container;
