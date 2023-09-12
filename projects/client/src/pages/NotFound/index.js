import React from "react";
import Button from "../../components/Button";

export default function NotFound() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <h3 className="title">Oops! Looks like you got lost.</h3>
      <p className="mb-2">The page you're trying to reach was not found.</p>
      <Button
        isButton
        isPrimary
        isLink
        title="Back"
        path="/"
      />
    </div>
  );
}
