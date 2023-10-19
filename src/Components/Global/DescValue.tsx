import Link from "next/link";
import { ReactNode } from "react";
import { LuArrowUpRight } from "react-icons/lu";

type Props = {
  keyValue: string;
  value?: string;
  extra?: string;
  element?: ReactNode;
  textSize?: "sm" | "md" | "lg" | "xl";
  href?: string;
};

const DescValue = ({
  keyValue,
  value,
  extra,
  element,
  textSize = "md",
  href,
}: Props) => {
  const getTextSize = () => {
    switch (textSize) {
      case "sm":
        return "text-sm";
      case "md":
        return "text-base";
      case "lg":
        return "text-lg";
      case "xl":
        return "text-xl";
    }
  };
  return (
    <div className={`flex gap-2 ${getTextSize()}  text-slate-500`}>
      <p className=" ">{keyValue}:</p>
      {href ? (
        <Link href={`/${href}`} target="_blank">
          <div className=" flex items-baseline gap-1  font-semibold text-black">
            {value}
            {extra}
            <div className=" text-emerald-500">
              <LuArrowUpRight />
            </div>
          </div>
        </Link>
      ) : (
        <div className=" font-semibold text-black">
          {value}
          {extra}
        </div>
      )}

      {element}
    </div>
  );
};

export default DescValue;
