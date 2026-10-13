import { Form, Input, Radio } from "antd";
import { Bs3CircleFill } from "react-icons/bs";
import Alert from "../../components/Alert/index.jsx";
import stepThree from "./signUpPictures/stepThree.jpg";
import useDinerRegistration from "./useDinerRegistration.js";

function StepThreeDiner() {
  const {
    submitDinerRegistration,
    updateField,
    uploadProfilePicture,
    userForm,
  } = useDinerRegistration();

  return (
    <div className="relative flex h-[calc(100vh-96px)] w-screen justify-center">
      <Alert />
      <img
        src={stepThree}
        className="h-full w-3/5 object-cover object-center phone:absolute phone:z-0  phone:w-full tablet:w-2/5 laptop:w-1/2"
      />

      <div className="flex h-full w-2/5 flex-col items-center justify-center phone:absolute phone:z-10 phone:w-full tablet:w-3/5 laptop:w-1/2">
        <div
          className={`flex h-[520px] w-[450px] flex-col items-center justify-center rounded-2xl bg-white phone:w-full`}
        >
          <div className="mb-8 flex items-center gap-2 text-3xl font-black text-[#ff850e] phone:mb-4">
            <Bs3CircleFill />
            <h1>填寫基本資訊</h1>
          </div>

          <Form autoComplete="off" className="mb-8">
            <div className="flex items-center phone:flex-col phone:items-start">
              <h1 className="my-4 mr-6 w-28 text-base font-semibold [text-align-last:justify] phone:mb-0 phone:[text-align-last:auto]">
                姓名
              </h1>
              <Input
                className="h-8 w-28"
                name="userName"
                onChange={updateField}
                value={userForm.userName}
              />
            </div>

            <div className="flex items-center phone:flex-col phone:items-start">
              <h1 className="my-4 mr-6 w-28 text-base font-semibold [text-align-last:justify] phone:mb-0 phone:[text-align-last:auto]">
                性別
              </h1>

              <Radio.Group
                name="gender"
                onChange={updateField}
                value={userForm.gender}
              >
                <Radio value="小姐">女</Radio>
                <Radio value="先生">男</Radio>
              </Radio.Group>
            </div>

            <div className="flex items-center phone:flex-col phone:items-start">
              <h1 className="my-4 mr-6 w-28 text-base font-semibold [text-align-last:justify] phone:mb-0 phone:[text-align-last:auto]">
                手機
              </h1>
              <Input
                className="h-8 w-64"
                name="phone"
                onChange={updateField}
                value={userForm.phone}
                placeholder="0911-654-987"
              />
            </div>

            <div className="mb-4 flex items-center phone:flex-col phone:items-start">
              <h1 className="my-4 mr-6 w-28 text-base font-semibold [text-align-last:justify] phone:mb-0 phone:[text-align-last:auto]">
                上傳大頭照
              </h1>
              <Input
                className="h-8 w-64 text-xs"
                type="file"
                accept="image/*"
                name="picture"
                onChange={(event) =>
                  uploadProfilePicture(event.target.files[0])
                }
              />
            </div>
          </Form>

          <button
            className="mr-8 h-10 w-20 self-end rounded-lg bg-[#ff850e] font-bold text-white hover:bg-[#ff850e]/80"
            onClick={submitDinerRegistration}
          >
            下一步
          </button>
        </div>
      </div>
    </div>
  );
}

export default StepThreeDiner;
