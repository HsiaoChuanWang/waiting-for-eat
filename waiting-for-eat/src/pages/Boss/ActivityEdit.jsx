import { Button } from "@nextui-org/react";
import { ContentState, EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import htmlToDraft from "html-to-draftjs";
import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../services/firebase/firebaseClient.js";
import { uploadImage } from "../../services/storage/imageStorage.js";

function myBlockRenderer(contentBlock) {
  const type = contentBlock.getType();

  if (type === "atomic") {
    return {
      component: Media,
      editable: false,
      props: {
        foo: "bar",
      },
    };
  }
}

function Media(props) {
  const { block, contentState } = props;
  const data = contentState.getEntity(block.getEntityAt(0)).getData();
  const emptyHtml = " ";
  return (
    <div>
      {emptyHtml}
      <img
        src={data.src}
        alt={data.alt || ""}
        style={{
          height: data.height || "auto",
          width: data.width || "auto",
        }}
      />
    </div>
  );
}

function ActivityEdit() {
  const navigate = useNavigate();
  const { companyId } = useParams();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [isPhoneSize, setIsPhoneSize] = useState(false);
  const [companyData, setCompanyData] = useState([]);
  const uuid = uuidv4();

  function onEditorStateChange(e) {
    setEditorState(e);
  }

  async function getCompanyInfo(companyId) {
    const docRef = doc(db, "company", companyId);
    const docSnap = await getDoc(docRef);

    const resultUser = docSnap.data();
    return resultUser;
  }

  useEffect(() => {
    const companySnap = onSnapshot(doc(db, "company", companyId), (doc) => {
      const data = doc.data();
      setCompanyData(data);
      const blocksFromHtml = htmlToDraft(data.description);
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(
        contentBlocks,
        entityMap,
      );
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState);
    });

    return companySnap;
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsPhoneSize(true);
      } else {
        setIsPhoneSize(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  async function uploadPicture(picture) {
    const downloadURL = await uploadImage(uuid, picture);
    return { data: { link: downloadURL } };
  }

  function _uploadImageCallBack(file) {
    const pictureURL = uploadPicture(file);
    return pictureURL;
  }

  async function handleSend(postId) {
    const uploadHtml = draftToHtml(
      convertToRaw(editorState.getCurrentContent()),
    );

    const companyRef = doc(db, "company", companyId);
    await updateDoc(companyRef, {
      description: uploadHtml,
    });
  }

  const editorStyle =
    isPhoneSize === true
      ? {
          height: "calc(100vh - 540px)",
          overflow: "auto",
          marginBottom: "5px",
          border: "1px solid #ddd",
        }
      : {
          height: "calc(100vh - 400px)",
          overflow: "auto",
          marginBottom: "5px",
          border: "1px solid #ddd",
        };

  return (
    <div className="flex h-full w-full p-12 phone:flex-col-reverse phone:p-4">
      <div className="h-[calc(100vh-280px)] w-5/6 border-2 border-solid border-black p-4 phone:h-[calc(100vh-380px)] phone:w-full">
        <Editor
          editorStyle={editorStyle}
          editorState={editorState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={onEditorStateChange}
          customBlockRenderFunc={myBlockRenderer}
          toolbar={{
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
              uploadCallback: _uploadImageCallBack,
              previewImage: true,
              inputAccept: "image/gif,image/jpeg,image/jpg,image/png,image/svg",
              alt: { present: false, mandatory: false, previewImage: true },
              defaultSize: {
                height: "auto",
                width: "200px",
              },
            },
          }}
        />
      </div>

      <div className="w-1/6 self-end pl-12 phone:mb-8 phone:flex phone:w-auto phone:gap-4 phone:pl-0">
        <Button
          className="h-11 rounded-lg bg-[#ff850e] px-4 text-center text-lg font-black text-white shadow-lg"
          onClick={() => {
            handleSend();
            navigate(`/boss/activity/${companyId}`);
          }}
        >
          保存
        </Button>

        <Button
          className="mt-4 h-11 rounded-lg bg-[#b0aba5] px-4 text-center text-lg font-black text-white shadow-lg phone:mt-0"
          onClick={() => {
            navigate(`/boss/activity/${companyId}`);
          }}
        >
          取消
        </Button>
      </div>
    </div>
  );
}

export default ActivityEdit;
