import React from "react";

function Container({ children }: { children: React.ReactNode }) {
  return (
    <main className=" flex min-h-full items-center justify-center  px-8 xl:px-0">
      <div className=" flex w-full max-w-7xl flex-col pt-6 ">{children}</div>
    </main>
  );
}

export default Container;
