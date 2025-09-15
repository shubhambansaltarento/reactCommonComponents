'use client';
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Delete,
  InsertPhotoOutlined,
  InsertDriveFileOutlined,
} from "@mui/icons-material";
import { CustomButton } from "../Button";
import { useTranslation } from "react-i18next";
import SvgDeleteIcon from "../../generated-icon/DeleteIcon";

export const MAX_FILE_SIZE = 5000000; //in bytes
export const ACCEPTED_FILES = ["pdf", "doc", "docx", "png", "jpg", "jpeg"];
//import { Delete } from "@shared/channel-partner-system";

interface IUploadFiles {
  droppedFiles: any[];
  setDroppedFiles: (value: any) => void;
  handleFileUpload: (value: any) => Promise<void> | void;
  errMsg?: string;
  acceptedFileFormats?: string[]; // Optional prop to specify accepted file formats
  acceptedMaxSize?: number;
  msg?: string;
  uploadButtonText: string;
}

export const CustomDocumentUploader = (props: IUploadFiles) => {
  const {
    droppedFiles,
    setDroppedFiles,
    handleFileUpload,
    errMsg,
    msg,
    uploadButtonText,
    acceptedFileFormats = ACCEPTED_FILES, // Default to ACCEPTED_FILES if not provided
    acceptedMaxSize = MAX_FILE_SIZE,
  } = props;
  const [uploadButtonDisable, setUploadButtonDisable] =
    useState<boolean>(false);
  const [uploadError, setUploadError] = useState<any>();
  const [hasSuccessfulUpload, setHasSuccessfulUpload] = useState<boolean>(false);

  const { t } = useTranslation("translations");
  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
  } = useDropzone({});

  useEffect(() => {
    console.log(acceptedFiles);
    const tempFiles = acceptedFiles.map((file: any) => ({
      file,
      fileName: file?.name,
    }));
    setDroppedFiles((prevState: any[]) => [...prevState, ...tempFiles]);
    if (!droppedFiles?.length) {
      setUploadError("");
    }
    if (acceptedFiles.length > 0) {
      setHasSuccessfulUpload(false);
    }
  }, [acceptedFiles]);

  useEffect(() => {
    if (!droppedFiles?.length) {
      setUploadError("");
      setUploadButtonDisable(false);
    }
  }, [droppedFiles]);

  return (
    <>
      <div className="w-full max-w-2xl bg-white rounded-lg CustomDocumentContainer ">
        {/* Error Message */}
        <span className="flex items-center gap-2 m-2 sm:m-2 text-[var(--alert-300)] text-xs sm:text-sm">
          {errMsg && errMsg?.length ? (
            <div className="errorText">
              <InfoOutlinedIcon className="cursor-pointer" fontSize="small" />
              {errMsg}
            </div>
          ) : null}
        </span>

        {/* Dropzone */}
        <div className="flex flex-col ml-4 drop_zone">
          <div
            {...getRootProps({
              className:
                "dropzone cursor-pointer border-2 border-[#D1D5DB] border-dashed rounded-md min-h-[158px] w-full flex flex-col items-center mt-6",
            })}
          >
            <input
              {...getInputProps({
                multiple: true,
                minSize: 0,
                maxSize: acceptedMaxSize,
              })}
            />
            {!isDragActive && (
              <div className="flex flex-col upload_container">
                {acceptedFileFormats?.includes("pdf") ? (
                  <IconButton size="small">
                    <InsertDriveFileOutlined fontSize="small" />
                  </IconButton>
                ) : (
                  <IconButton size="small">
                    <InsertPhotoOutlined fontSize="small" />
                  </IconButton>
                )}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    fontSize={12}
                    color="textSecondary"
                  >
                    {t(msg || "SHARED.UPLOAD.DROP_FILES_HERE")}
                  </Typography>

                  <CustomButton variant="outlined" className="uploadButton">
                    {t(uploadButtonText)}
                  </CustomButton>
                </Box>
              </div>
            )}
            {isDragActive && !isDragReject && (
              <h4 className="text-sky-700 text-sm sm:text-base">
                {t("SHARED.UPLOAD.FILE_TYPE_ACCEPTED")}
              </h4>
            )}
            {isDragReject && (
              <h4 className="text-rose-600 text-sm sm:text-base">
                {t("SHARED.UPLOAD.FILE_TYPE_NOT_ACCEPTED")}
              </h4>
            )}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "4px",
            }}
          >
            <span className="text-sm text-gray-400">
              {t("SHARED.UPLOAD.SUPPORTED_FILES", {
                formats: acceptedFileFormats.join(", "),
                maxSize: acceptedMaxSize / 1000000,
              })}
            </span>
          </div>

          {/* Files List (now BELOW dropzone) */}
          {droppedFiles.length !== 0 && (
            <div className="flex flex-col w-full">
              <Paper
                className="max-h-[250px] sm:max-h-[370px] overflow-auto pr-2 pt-2"
                elevation={0}
              >
                {droppedFiles.map((file: any, index: number) => (
                  <div
                    className="pb-4 gap-2 flex flex-col"
                    key={index + "_" + file.path + "_container"}
                  >
                    <div
                      className="flex items-center justify-between w-full border-[0.5px] rounded-[5px] text-[#3D4152] p-4"
                      key={index + "_" + file.file.name + "_container"}
                    >
                      {/* File thumbnail + name + size */}
                      <div className="flex items-center gap-3">
                        {file?.file?.type?.startsWith("image/") ? (
                          <img
                            src={URL.createObjectURL(file.file)}
                            alt={file.file.name}
                            className="w-12 h-12 object-cover rounded-md border"
                          />
                        ) : (
                          <IconButton size="small">
                            <InsertDriveFileOutlined fontSize="small" />
                          </IconButton>
                        )}

                        <div className="flex flex-col truncate min-w-0 flex-1">
                          <span
                            className="font-medium text-sm truncate max-w-[200px] sm:max-w-[300px]"
                            title={file.file.name}
                          >
                            {file.file.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {file.file.size < 1024 * 1024
                              ? `${Math.round(file.file.size / 1024)} KB`
                              : `${(file.file.size / (1024 * 1024)).toFixed(
                                  2
                                )} MB`}
                          </span>
                        </div>
                      </div>
                      <div>
                        {/* Delete button docked right - only enabled if file is not uploaded */}
                        <IconButton
                          size="small"
                          disabled={file.isUploaded}
                          onClick={() => {
                            if (!file.isUploaded) {
                              const filesList = [...droppedFiles];
                              filesList.splice(index, 1);
                              setDroppedFiles(filesList);
                              const isAnyFileNameEmpty = filesList.some(
                                (file) => !file.fileName
                              );
                              setUploadButtonDisable(isAnyFileNameEmpty);
                            }
                          }}
                          sx={{
                            opacity: file.isUploaded ? 0.3 : 1,
                            cursor: file.isUploaded ? "not-allowed" : "pointer",
                          }}
                        >
                          <SvgDeleteIcon className="w-5 h-5" />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                ))}
              </Paper>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-2 px-2 sm:px-4 w-full">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {/* Left side (error or empty placeholder) */}
            <Box
              sx={{
                flexGrow: 1,
                minHeight: 24,
                display: "flex",
                alignItems: "center",
              }}
            >
              {uploadError && (
                <Typography variant="body2" color="error">
                  {t("SHARED.UPLOAD.ERROR", { error: uploadError })}
                </Typography>
              )}
            </Box>

            {/* Right side (button) */}
            {/* <CustomButton
              type="button"
              color="success"
              variant="contained"
              onClick={async () => {
                if (!droppedFiles?.length) {
                  return;
                }
                if (uploadButtonDisable) {
                  return;
                }

                const exceedingFileNames: string[] = [];
                const unsupportedFileNames: string[] = [];

                const fileSizeExceeded = droppedFiles.some((item) => {
                  if (item?.file?.size > acceptedMaxSize) {
                    exceedingFileNames.push(item?.file?.name);
                    return true;
                  }
                  return false;
                });

                const containsUnsupportedFiles = droppedFiles.some((item) => {
                  const fileExtension = item?.file?.name
                    ?.split(".")
                    .pop()
                    ?.toLowerCase();
                  if (!acceptedFileFormats.includes(fileExtension)) {
                    unsupportedFileNames.push(item?.file?.name);
                    return true;
                  }
                  return false;
                });

                if (fileSizeExceeded) {
                  setUploadError(
                    t("SHARED.UPLOAD.SIZE_EXCEEDED", {
                      files: exceedingFileNames.join(", "),
                    })
                  );
                } else if (containsUnsupportedFiles) {
                  setUploadError(
                    t("SHARED.UPLOAD.UNSUPPORTED_FORMAT", {
                      files: unsupportedFileNames.join(", "),
                    })
                  );
                } else {
                  setUploadError(""); // ✅ clear error
                  setUploadButtonDisable(true);
                  try {
                    await handleFileUpload(droppedFiles);
                    setHasSuccessfulUpload(true);
                  } catch (error) {
                    console.error("Upload failed:", error);
                    setUploadError(t("SHARED.UPLOAD.ERROR_MESSAGE"));
                  } finally {
                    setUploadButtonDisable(false);
                  }
                }
              }}
              tabIndex={0}
            >
              {uploadButtonDisable 
                ? "Uploading..." 
                : hasSuccessfulUpload && !droppedFiles?.length 
                  ? "Upload" 
                  : t("SHARED.UPLOAD.UPLOAD")
              }
            </CustomButton> */}
          </Box>
        </div>
      </div>
    </>
  );
};
