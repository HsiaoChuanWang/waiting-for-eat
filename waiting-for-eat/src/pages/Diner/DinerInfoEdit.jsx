import { Card } from "@nextui-org/react";
import { Button, Form, Input, Radio } from "antd";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../services/firebase/firebaseClient.js";
import { uploadImage } from "../../services/storage/imageStorage.js";
import useUserStore from "../../stores/userStore.js";

function DinerInfoEdit() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const detailInfo = useUserStore((state) => state.detailInfo);
  const [updateData, setUpdateData] = useState({
    userName: detailInfo.userName,
    gender: detailInfo.gender,
    phone: detailInfo.phone,
  });

  async function handlePicture(picture) {
    const downloadURL = await uploadImage(userId, picture);
    setUpdateData({ ...updateData, picture: downloadURL });
  }

  async function handleUpdate() {
    const userRef = doc(db, "user", userId);
    await updateDoc(userRef, updateData);
    navigate(`/diner/dinerInfo/${userId}`);
  }

  return (
    <div className="flex h-full items-center justify-center ">
      <Card className="w-2/3 phone:my-8 phone:w-5/6 tablet:w-5/6">
        <div className="relative mt-8">
          <h2 className="mb-2 ml-20 text-2xl font-bold phone:text-xl">
            個人資訊
          </h2>
          <div className="mx-auto w-4/5 border-t-2 border-solid border-gray-400 pb-2"></div>
          <Form className="ml-20 phone:mx-8">
            <div className="flex items-center phone:flex-col phone:items-start">
              <h1 className="my-4 mr-6 w-28 text-base font-semibold [text-align-last:justify] phone:my-2 phone:w-20 phone:text-xs phone:[text-align-last:auto]">
                姓名
              </h1>
              <Input
                className="h-8 w-28 phone:mb-4 phone:w-20 phone:text-xs"
                name="userName"
                onChange={(e) =>
                  setUpdateData({ ...updateData, userName: e.target.value })
                }
                value={updateData.userName}
              />
            </div>

            <div className="flex items-center phone:flex-col phone:items-start">
              <h1 className="my-4 mr-6 w-28 text-base font-semibold [text-align-last:justify] phone:my-2 phone:w-20 phone:text-xs phone:[text-align-last:auto]">
                性別
              </h1>
              <Radio.Group
                className="font-black phone:mb-4"
                name="gender"
                onChange={(e) =>
                  setUpdateData({ ...updateData, gender: e.target.value })
                }
                value={updateData.gender}
              >
                <Radio value="小姐">
                  <span className="text-xs">女</span>
                </Radio>

                <Radio value="先生">
                  <span className="text-xs">男</span>
                </Radio>
              </Radio.Group>
            </div>

            <div className="flex items-center phone:flex-col phone:items-start">
              <h1 className="my-4 mr-6 w-28 text-base font-semibold [text-align-last:justify] phone:my-2 phone:w-20 phone:text-xs phone:[text-align-last:auto]">
                手機
              </h1>
              <Input
                className="h-8 w-64 phone:mb-4 phone:w-44 phone:text-xs"
                name="phone"
                onChange={(e) =>
                  setUpdateData({ ...updateData, phone: e.target.value })
                }
                value={updateData.phone}
              />
            </div>

            <div className="mb-24 flex items-center phone:flex-col phone:items-start ">
              <h1 className="my-4 mr-6 w-28 text-base font-semibold [text-align-last:justify] phone:my-2 phone:w-20 phone:text-xs phone:[text-align-last:auto]">
                上傳大頭照
              </h1>
              <Input
                className="h-8 w-64 text-xs phone:w-44"
                type="file"
                accept="image/*"
                name="picture"
                onChange={(e) => handlePicture(e.target.files[0])}
              />
            </div>

            <Form.Item
              className="absolute bottom-0 right-0"
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button
                style={{ background: "#b0aba5", cursor: "pointer" }}
                className="absolute bottom-0 right-36 font-bold phone:right-28 tablet:right-28"
                onClick={() => navigate(`/diner/dinerInfo/${userId}`)}
                type="primary"
                htmlType="button"
              >
                返回
              </Button>

              <Button
                className="absolute bottom-0 right-16 font-bold phone:right-8 tablet:right-8"
                onClick={handleUpdate}
                type="primary"
                htmlType="button"
              >
                更新
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </div>
  );
}

export default DinerInfoEdit;
