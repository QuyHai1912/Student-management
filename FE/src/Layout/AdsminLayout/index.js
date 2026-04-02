import BaseLayout from "../BaseLayout";
import { titleAdsmin } from "~/Component";
import { useState } from "react";

function AdsminLayout() {
  return <BaseLayout menuItems={titleAdsmin} role={"Adsmin"} />;
}

export default AdsminLayout;
