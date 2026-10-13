import { Button } from "@nextui-org/react";
import { Form, Input } from "antd";
import { ContentState, EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import htmlToDraft from "html-to-draftjs";
import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { db, storage } from "../../services/firebase/firebaseClient.js";

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

function PostedEdit() {
  const navigate = useNavigate();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [title, setTitle] = useState("");
  const [mainPicture, setMainPicture] = useState("");
  const [post, setPost] = useState([]);
  const { postId } = useParams();
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
    let postData;
    const postSnap = onSnapshot(doc(db, "post", postId), (doc) => {
      postData = doc.data();
      getCompanyInfo(postData.companyId).then((result) => {
        const data = Object.assign(postData, result);
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

    return postSnap;
  }, []);

  async function uploadPicture(picture) {
    const storageRef = ref(storage, uuid);
    await uploadBytes(storageRef, picture);
    const downloadURL = await getDownloadURL(storageRef);
    return { data: { link: downloadURL } };
  }

  function _uploadImageCallBack(file) {
    const pictureURL = uploadPicture(file);
    return pictureURL;
  }

  async function handleMainPicture(picture) {
    const storageRef = ref(storage, uuid);
    await uploadBytes(storageRef, picture);
    const downloadURL = await getDownloadURL(storageRef);
    setMainPicture(downloadURL);
  }

  async function handleSend(postId) {
    const uploadHtml = draftToHtml(
      convertToRaw(editorState.getCurrentContent()),
    );

    const postRef = doc(db, "post", postId);
    await updateDoc(postRef, {
      title: title,
      content: uploadHtml,
      createTime: serverTimestamp(),
    });

    if (mainPicture !== "") {
      await updateDoc(postRef, {
        mainPicture: mainPicture,
      });
    }
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
