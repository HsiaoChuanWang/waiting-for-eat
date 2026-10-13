import { Button } from "@nextui-org/react";
import { ContentState, EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useNavigate, useParams } from "react-router-dom";
import useCompanyProfile from "../../../features/boss/useCompanyProfile.js";
import { renderEditorMediaBlock } from "../../../features/editor/editorImageRenderer.js";
import useEditorImageUpload from "../../../features/editor/useEditorImageUpload.js";
import { updateCompany } from "../../../services/repositories/companyRepository.js";

function ActivityEdit() {
  const navigate = useNavigate();
  const { companyId } = useParams();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [isPhoneSize, setIsPhoneSize] = useState(false);
  const { toolbar } = useEditorImageUpload();
  const { company } = useCompanyProfile(companyId);

  function onEditorStateChange(e) {
    setEditorState(e);
  }

  useEffect(() => {
    if (!company) return;

    const blocksFromHtml = htmlToDraft(company.description ?? "");
    const { contentBlocks, entityMap } = blocksFromHtml;
    const contentState = ContentState.createFromBlockArray(
      contentBlocks,
      entityMap,
    );
    setEditorState(EditorState.createWithContent(contentState));
  }, [company]);

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

  async function handleSend() {
    const uploadHtml = draftToHtml(
      convertToRaw(editorState.getCurrentContent()),
    );

    await updateCompany(companyId, {
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
          customBlockRenderFunc={renderEditorMediaBlock}
          toolbar={toolbar}
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
