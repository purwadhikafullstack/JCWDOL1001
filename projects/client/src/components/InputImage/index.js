import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import Button from "../Button";

export default function InputImage({
  file,
  error,
  setFile,
  dataImage,
  setDataImage,
}) {
  const [previewImage, setPreviewImage] = useState(null);

  const onDrop = (acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile.size > 1000000) {
      alert("file too large. Max 1 MB");
      return;
    }
    setFile(selectedFile);

    // show prev image
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const removeImage = () => {
    setFile(null);
    setPreviewImage(null);
    setDataImage(null);
  };

  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: { "image/*": [".jpg", ".png", ".jpeg"] },
    noClick: true,
    noKeyboard: true,
  });

  return (
    <div className="flex h-fit w-full flex-col items-center justify-center px-4">
      <p className="text-dark mb-2 text-center text-lg font-semibold md:text-lg">
        Upload Image
      </p>

      <div
        {...getRootProps({
          className: `w-full h-fit flex items-center justify-center flex-col p-4 border-2 border-slate-500
            border-dashed rounded-md ${isDragActive ? "bg-teal-200/30" : null}`,
        })}
      >
        <input
          {...getInputProps({
            name: "image",
          })}
        />

        {previewImage || dataImage ? (
          <img
            src={
              previewImage ||
              process.env.REACT_APP_PRODUCT_IMAGE_URL + dataImage
            }
            className="w-64"
          />
        ) : (
          <>
            <p className="md:text-md text-center text-sm text-slate-400">
              {file === null && !dataImage ? (
                <>
                  <span className="select-none">
                    Drag & Drop your image here
                  </span>
                  <div className="flex items-center gap-2">
                    <hr className="h-[2px] w-full bg-slate-300" />
                    <p className="text-md mb-2 mt-2 text-center font-normal text-slate-400">
                      Or
                    </p>
                    <hr className="h-[2px] w-full bg-slate-300" />
                  </div>
                  <Button onClick={open} title="Choose a file" isSmall isPrimary />

                  {/* {error.image && (
                    <div className="text-base text-red-500 dark:text-red-400">
                      {error.image}
                    </div>
                  )} */}
                </>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={removeImage}
                    title="Remove"
                    isSmall
                    isSecondary
                    className="mt-2"
                  />
                </div>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
