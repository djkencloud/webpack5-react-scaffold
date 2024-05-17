import React from "react";

import img from "../../../static/images/test.png";
import img2 from "../../../static/images/insect-dance.jpg";

export default function Content() {
  return (
    <section>
      <img src={img} alt="test" width="2526" height="2176" />
      <img src={img2} alt="test" width="1917" height="1278" />
    </section>
  );
}
