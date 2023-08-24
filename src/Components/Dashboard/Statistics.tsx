import { Statistic } from "antd";
import React from "react";

function Statistics() {
  return (
    <div className=" items-start flex gap-20 border-b border-slate-200 pb-6">
      <Statistic title="Monthly paid (THB)" value={1128} />
      <Statistic title="Weekly paid (THB)" value={1128} />
      <Statistic title="Total user" value={1128} />
    </div>
  );
}

export default Statistics;
