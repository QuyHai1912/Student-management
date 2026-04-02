import BaseLayout from "../BaseLayout";
import { titleAdvisor } from "~/Component";
import { useState } from "react";

function AdvisorLayout() {
  return <BaseLayout menuItems={titleAdvisor} role={"Advisor"} />;
}

export default AdvisorLayout;
