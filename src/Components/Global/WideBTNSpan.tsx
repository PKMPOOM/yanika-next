import React, { HTMLProps } from "react";

type Type = {
  children: React.ReactNode;
} & HTMLProps<HTMLDivElement>;

function WideBTNSpan({ children, ...props }: Type) {
  return (
    <div {...props} className=" px-5">
      {children}
    </div>
  );
}

export default WideBTNSpan;
