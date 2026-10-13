import { useCallback, useMemo, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { uploadImage } from "../../services/storage/imageStorage.js";

function createEditorToolbar(uploadCallback) {
  return {
    options: [
      "inline",
      "blockType",
      "fontSize",
      "textAlign",
      "history",
      "colorPicker",
      "emoji",
      "image",
      "remove",
    ],
    inline: {
      options: ["bold", "italic", "underline", "strikethrough"],
      bold: { className: "demo-option-custom" },
      italic: { className: "demo-option-custom" },
      underline: { className: "demo-option-custom" },
      strikethrough: { className: "demo-option-custom" },
      monospace: { className: "demo-option-custom" },
      superscript: { className: "demo-option-custom" },
      subscript: { className: "demo-option-custom" },
    },
    blockType: {
      options: ["Normal", "H1", "H2", "H3", "H4", "H5", "H6"],
      className: "demo-option-custom-wide",
      dropdownClassName: "demo-dropdown-custom",
    },
    fontSize: { className: "demo-option-custom-medium" },
    image: {
      urlEnabled: true,
      uploadEnabled: true,
      alignmentEnabled: false,
      uploadCallback,
      previewImage: true,
      inputAccept: "image/gif,image/jpeg,image/jpg,image/png,image/svg",
      alt: { present: false, mandatory: false, previewImage: true },
      defaultSize: {
        height: "auto",
        width: "200px",
      },
    },
  };
}

function useEditorImageUpload() {
  const uploadId = useRef(uuidv4()).current;
  const uploadFile = useCallback(
    (file) => uploadImage(uploadId, file),
    [uploadId],
  );
  const uploadCallback = useCallback(
    async (file) => ({ data: { link: await uploadFile(file) } }),
    [uploadFile],
  );
  const toolbar = useMemo(
    () => createEditorToolbar(uploadCallback),
    [uploadCallback],
  );

  return { toolbar, uploadFile };
}

export default useEditorImageUpload;
