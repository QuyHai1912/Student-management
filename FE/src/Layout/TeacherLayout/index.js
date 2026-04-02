import BaseLayout from "../BaseLayout";
import { titleTeacher } from "~/Component";
import { useState } from "react";

function TeacherLayout() {
  return <BaseLayout menuItems={titleTeacher} role={"Teacher"} />;
}

export default TeacherLayout;
