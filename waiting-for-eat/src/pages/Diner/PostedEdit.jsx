import { Button } from "@nextui-org/react";
import { Form, Input } from "antd";
import { ContentState, EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useNavigate, useParams } from "react-router-dom";
import { renderEditorMediaBlock } from "../../features/editor/editorImageRenderer.js";
import useEditorImageUpload from "../../features/editor/useEditorImageUpload.js";
import { getCompanyById } from "../../services/repositories/companyRepository.js";
import {
  subscribePostById,
  updatePost,
} from "../../services/repositories/postRepository.js";

function PostedEdit() {
  const navigate = useNavigate();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [title, setTitle] = useState("");
  const [mainPicture, setMainPicture] = useState("");
  const [post, setPost] = useState([]);
  const { postId } = useParams();
  const { toolbar, uploadFile } = useEditorImageUpload();

  function onEditorStateChange(e) {
    setEditorState(e);
  }

  useEffect(() => {
    return subscribePostById(postId, (postData) => {
      if (!postData) return;

      getCompanyById(postData.companyId).then((result) => {
        const data = { ...postData, ...result };
        setPost(data);
        const blocksFromHtml = htmlToDraft(data.content);
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(
          contentBlocks,
          entityMap,
        );
        const editorState = EditorState.createWithContent(contentState);
        setEditorState(editorState);
        setTitle(data.title);
      });
    });
  }, [postId]);

  async function handleMainPicture(picture) {
    const downloadURL = await uploadFile(picture);
    setMainPicture(downloadURL);
  }

  async function handleSend(postId) {
    const uploadHtml = draftToHtml(
      convertToRaw(editorState.getCurrentContent()),
    );

    await updatePost(postId, {
      content: uploadHtml,
      ...(mainPicture !== "" && { mainPicture }),
      title,
    });
  }

  const editorStyle = {
    height: "calc(100vh - 300px)",
    overflow: "auto",
    marginBottom: "5px",
    border: "1px solid #ddd",
  };

  return (
    <div className="flex w-full justify-center">
      <div className="relative w-full max-w-[1300px] px-20 pb-20 pt-12 phone:p-4 phone:pb-12">
        <h1 className="w-88 mb-4 bg-red-600 py-2 text-center text-2xl font-black text-white phone:mb-2  phone:text-lg">
          請直接填寫需要更改的地方
        </h1>
        <div>
          <Form>
            <div className="mb-6 flex items-center phone:mb-2 phone:flex-col phone:items-start">
              <h1 className="mr-4 w-24 text-lg font-black text-gray-600 [text-align-last:justify] phone:[text-align-last:auto]">
                標題
              </h1>
              <Input
                className="h-10 w-[500px] border border-solid border-gray-600 text-lg phone:w-full"
                name="title"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                value={title}
              />
            </div>

            <div className="mb-6 flex items-center phone:mb-2 phone:flex-col phone:items-start">
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

            <div>
              <img
                className="mb-6 h-[200px] w-[400px] rounded-xl object-cover object-center"
                src={post.mainPicture}
              ></img>
            </div>
          </Form>
        </div>

        <div className="min-h-[400px] border-2 border-solid border-gray-600">
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
            navigate(`/diner/posted/${post.userId}`);
          }}
        >
          取消
        </Button>

        <Button
          className="absolute bottom-4 right-20 mt-6 block h-10 rounded-lg bg-[#ff850e] px-4 text-center text-lg font-black text-white shadow-lg phone:bottom-0 phone:right-4 phone:mt-0"
          onClick={() => {
            handleSend(postId).then(() => {
              navigate(`/diner/posted/${post.userId}`);
            });
          }}
        >
          保存
        </Button>
      </div>
    </div>
  );
}

export default PostedEdit;
