"use client";

import React from "react";
import NextError from "next/error";

type Props = {
  error: Error;
};

const Error = ({ error }: Props) => {
  return <NextError statusCode={500} title={error.message} />;
};

export default Error;
