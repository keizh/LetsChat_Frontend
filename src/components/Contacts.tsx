import React from "react";
import { useLoaderData } from "react-router-dom";

function Contacts() {
  const _ = useLoaderData();

  return <div className="rounded-md bg-white flex-grow">contacts</div>;
}

export default Contacts;
