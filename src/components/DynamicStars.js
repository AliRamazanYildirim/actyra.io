"use client";

import dynamic from "next/dynamic";

const Stars = dynamic(() => import("./Stars"), { ssr: false });

export default Stars;
