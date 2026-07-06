"use client";

import { use } from "react";
import { StudentProfilePage } from "./components/student-profile-page";

export default function StudentProfileRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return <StudentProfilePage studentId={id} />;
}
