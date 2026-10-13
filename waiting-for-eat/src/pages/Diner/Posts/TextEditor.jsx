import { Button } from "@nextui-org/react";
import { Form, Input } from "antd";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useNavigate, useParams } from "react-router-dom";
import { renderEditorMediaBlock } from "../../../features/editor/editorImageRenderer.js";
import useEditorImageUpload from "../../../features/editor/useEditorImageUpload.js";
import { getOrderById } from "../../../services/repositories/orderRepository.js";
import { createPost } from "../../../services/repositories/postRepository.js";

function TextEditor() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [title, setTitle] = useState("");
  const [mainPicture, setMainPicture] = useState("");
  const [orderData, setOrderData] = useState({});
  const { toolbar, uploadFile } = useEditorImageUpload();

  useEffect(() => {
    getOrderById(orderId).then(setOrderData);
  }, [orderId]);

  function onEditorStateChange(e) {
    setEditorState(e);
  }

  async function handleMainPicture(picture) {
    const downloadURL = await uploadFile(picture);
    setMainPicture(downloadURL);
  }

  async function handleSend() {
    const uploadHtml = draftToHtml(
      convertToRaw(editorState.getCurrentContent()),
    );

    await createPost({
      companyId: orderData.companyId,
      content: uploadHtml,
      mainPicture,
      orderId: orderId,
      title,
      userId: orderData.userId,
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
            customBlockRenderFunc={renderEditorMediaBlock}
            toolbar={toolbar}
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
