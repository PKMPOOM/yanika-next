import React from "react";

function Container({ children }: { children: React.ReactNode }) {
  return (
    <main className=" min-h-full flex items-center justify-center">
      <div className=" max-w-7xl pt-6 w-full ">{children}</div>
    </main>
  );
}

export default Container;
