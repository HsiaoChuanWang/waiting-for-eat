import { UploadOutlined } from "@ant-design/icons";
import { Card, ScrollShadow } from "@nextui-org/react";
import { Button, Upload } from "antd";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { updateCompany } from "../../services/repositories/companyRepository.js";
import { uploadImage } from "../../services/storage/imageStorage.js";

function PhotoUpload() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [mainPictures, setMainpictures] = useState([]);
  const [menuPictures, setMenuPictures] = useState([]);

  const mainProps = {
    onRemove: (file) => {
      const index = mainPictures.indexOf(file);
      const newFileList = mainPictures.slice();
      newFileList.splice(index, 1);
      setMainpictures(newFileList);
    },
    beforeUpload: (file) => {
      setMainpictures([file]);
      return false;
    },
    fileList: mainPictures,
    maxCount: 1,
  };

  async function getUrl(picture) {
    const uuid = uuidv4();
    return uploadImage(uuid, picture);
  }

  const handleMain = async () => {
    const picture = await getUrl(mainPictures[0]);
    await updateCompany(companyId, { picture });
    navigate(`/boss/photo/${companyId}`);
  };

  const menuProps = {
    onRemove: (file) => {
      const index = menuPictures.indexOf(file);
      const newFileList = menuPictures.slice();
      newFileList.splice(index, 1);
      setMenuPictures(newFileList);
    },
    beforeUpload: (file) => {
      setMenuPictures([...menuPictures, file]);
      return false;
    },
    fileList: menuPictures,
  };

  const handleMenu = async () => {
    const menu = await Promise.all(menuPictures.map(getUrl));
    await updateCompany(companyId, { menu });
    navigate(`/boss/photo/${companyId}`);
  };

  return (
    <div className="flex h-full items-center justify-center">
      <Card className="h-3/5 w-2/3 py-4 phone:my-4 phone:h-[calc(100%-96px)] phone:w-5/6 tablet:w-5/6">
        <div className="flex h-1/3 phone:mb-10 phone:h-36 phone:flex-col">
          <div className="flex w-1/3 flex-col items-center justify-center gap-2 phone:w-full">
            <h2 className="text-xl font-bold">上傳封面照片</h2>
            <p className="font-black text-red-600">*僅限單張</p>
          </div>

          <div className="flex w-2/3 phone:w-full phone:flex-col">
            <div className="flex w-2/3 items-center justify-center phone:my-4 phone:w-full">
              <Upload {...mainProps}>
                <Button
                  icon={<UploadOutlined />}
                  className="text-amber-600"
                  style={{ background: "#ffedd5" }}
                >
                  選擇檔案
                </Button>
              </Upload>
            </div>

            <div className="relative w-1/3 self-end phone:flex phone:w-full phone:justify-center">
              <Button
                type="primary"
                onClick={handleMain}
                disabled={mainPictures.length === 0}
                className="absolute bottom-2 right-8 w-24 phone:static"
              >
                上傳封面
              </Button>
            </div>
          </div>
        </div>

        <div className="w-[calc(100%-24px)] self-center border-b border-solid border-gray-300 py-2"></div>
        <div className="w-[calc(100%-24px)] self-center border-t border-solid border-gray-300 py-2"></div>

        <div className="flex h-[calc(67%-24px)] phone:h-[calc(100%-192px)] phone:flex-col">
          <div className="flex w-1/3 flex-col items-center justify-center gap-2 phone:w-full">
            <h2 className="text-xl font-bold">上傳菜單照片</h2>
            <p className="font-black text-red-600">*可選擇多張上傳</p>
          </div>

          <div className="flex w-2/3 phone:h-56 phone:w-full phone:flex-col">
            <div className="flex w-2/3 items-center justify-center phone:my-4 phone:h-24 phone:w-full phone:items-start">
              <ScrollShadow
                size={0}
                hideScrollBar
                className="h-[calc(100%-12px)] phone:h-24"
              >
                <Upload {...menuProps}>
                  <Button
                    icon={<UploadOutlined />}
                    className="text-amber-600"
                    style={{ background: "#ffedd5" }}
                  >
                    選擇檔案
                  </Button>
                </Upload>
              </ScrollShadow>
            </div>

            <div className="relative w-1/3 self-end phone:flex phone:w-full phone:justify-center">
              <Button
                className="absolute bottom-4 right-8 w-24 phone:static"
                type="primary"
                onClick={handleMenu}
                disabled={menuPictures.length === 0}
              >
                上傳菜單
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default PhotoUpload;
