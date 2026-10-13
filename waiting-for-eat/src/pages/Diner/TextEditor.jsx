import { Button } from "@nextui-org/react";
import { Form, Input } from "antd";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
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

function TextEditor() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [title, setTitle] = useState("");
  const [mainPicture, setMainPicture] = useState("");
  const [orderData, setOrderData] = useState({});
  const uuid = uuidv4();

  useEffect(() => {
    const orderRef = doc(db, "order", orderId);
    getDoc(orderRef).then((result) => {
      const data = result.data();
      setOrderData(data);
    });
  }, []);

  function onEditorStateChange(e) {
    setEditorState(e);
  }

  async function uploadPicture(picture) {
    const downloadURL = await uploadImage(uuid, picture);
    return { data: { link: downloadURL } };
  }

  function _uploadImageCallBack(file) {
    const pictureURL = uploadPicture(file);
    return pictureURL;
  }

  async function handleMainPicture(picture) {
    const downloadURL = await uploadImage(uuid, picture);
    setMainPicture(downloadURL);
  }

  async function handleSend() {
    const uploadHtml = draftToHtml(
      convertToRaw(editorState.getCurrentContent()),
    );

    await addDoc(collection(db, "post"), {
      title: title,
      mainPicture: mainPicture,
      content: uploadHtml,
      createTime: serverTimestamp(),
      orderId: orderId,
      userId: orderData.userId,
      companyId: orderData.companyId,
    });
  }

  const editorStyle = {
    height: "calc(100vh - 450px)",
    overflow: "auto",
    marginBottom: "5px",
    border: "1px solid #ddd",
  };

  return (
    <div className="flex w-full justify-center">
      <div className="relative w-full max-w-[1300px] px-20 pb-20 pt-12 phone:p-4 phone:pb-12">
        <div>
          <Form>
            <div className="mb-6 flex items-center phone:mb-2 phone:flex-col phone:items-start">
              <h1 className="mr-4 w-24 text-lg font-black text-gray-600 [text-align-last:justify] phone:[text-align-last:auto]">
                標題
              </h1>
              <Input
                className="h-10 w-[500px] border border-solid border-gray-600 text-lg phone:w-full"
                name="title"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
            </div>

            <div className="mb-6 flex items-center phone:flex-col phone:items-start">
              <h1 className="mr-4 w-24 text-lg font-black text-gray-600 [text-align-last:justify] phone:[text-align-last:auto]">
                封面照片
              </h1>
              <Input
                className="h-10 w-[500px] border border-solid border-gray-600 phone:w-full"
                type="file"
                accept="image/*"
                name="picture"
                onChange={(e) => handleMainPicture(e.target.files[0])}
              />
            </div>
          </Form>
        </div>

        <div className="min-h-[400px] border-2 border-solid border-gray-400">
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
                inputAccept:
                  "image/gif,image/jpeg,image/jpg,image/png,image/svg",
                alt: { present: false, mandatory: false, previewImage: true },
                defaultSize: {
                  height: "auto",
                  width: "200px",
                },
              },
            }}
          />
        </div>

        <Button
          className="absolute bottom-4 right-48 mt-8 block h-10 rounded-lg bg-[#b0aba5] px-4 text-center text-lg font-black text-white shadow-lg phone:bottom-0 phone:right-28"
          onClick={() => {
            navigate(`/diner/eatenShop/${orderData.userId}`);
          }}
        >
          返回
        </Button>

        <Button
          className="absolute bottom-4 right-20 mt-6 block h-10 rounded-lg bg-[#ff850e] px-4 text-center text-lg font-black text-white shadow-lg phone:bottom-0 phone:right-4 phone:mt-0"
          onClick={() => {
            handleSend().then(() => {
              navigate(`/diner/posted/${orderData.userId}`);
            });
          }}
        >
          保存
        </Button>
      </div>
    </div>
  );
}

export default TextEditor;
