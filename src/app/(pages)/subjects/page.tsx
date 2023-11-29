import Container from "@/Components/Global/Container";
import React from "react";
import AllSubjects from "@/Components/Subjects/AllSubjects";

export default function Subjects() {
  return (
    <Container>
      <div className="flex flex-col gap-6 ">
        <div>
          <p className=" rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-400 p-6 text-3xl text-white">
            All subjects
          </p>
        </div>
        <AllSubjects />
      </div>
    </Container>
  );
}
