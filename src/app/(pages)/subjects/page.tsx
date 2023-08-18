import Container from "@/Components/Global/Container";
import React, { useState } from "react";
import { z } from "zod";

const subjects = [];

type subjects = {
  id: string;
};

type grade = {
  id: string;
  name: string;
  subjects: subjects[];
};

// const gradeSchema = z.object({

// })
export default function page() {
  return (
    <Container>
      <div>All subject</div>
      <div>All subject</div>
    </Container>
  );
}
