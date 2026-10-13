import { ScrollShadow } from "@nextui-org/react";
import { Form, Input, Radio, Select } from "antd";
import { Bs3CircleFill } from "react-icons/bs";
import Alert from "../../components/Alert/index.jsx";
import { RESTAURANT_CATEGORY_OPTIONS } from "../../constants/restaurant.js";
import stepThree from "./signUpPictures/stepThree.jpg";
import useBossRegistration from "./useBossRegistration.js";

function StepThreeBoss() {
  const {
    companyForm,
    submitBossRegistration,
    updateCompanyField,
    updateCompanyForm,
    updateUserField,
    uploadProfilePicture,
    userForm,
  } = useBossRegistration();

  return (
    <div className="relative flex h-[calc(100vh-96px)] w-screen items-center">
      <Alert />
      <img
        src={stepThree}
        alt=""
        className="h-full w-3/5 object-cover object-center phone:absolute phone:z-0 phone:w-full tablet:w-2/5  laptop:w-1/2"
      />

      <div className="flex w-2/5 flex-col items-center justify-center bg-white py-8 phone:absolute phone:z-10 phone:w-full tablet:w-3/5 laptop:w-1/2">
        <div className="mb-8 flex items-center gap-2 text-3xl font-black text-[#ff850e] phone:text-2xl">
          <Bs3CircleFill />
          <h1>填寫資訊，上架你的餐廳。</h1>
        </div>

        <ScrollShadow
          size={0}
          className="h-[450px] w-[500px] phone:w-full tablet:w-full"
        >
          <div
            className={`flex flex-col items-center justify-center rounded-2xl`}
          >
            <h2 className="mb-2 text-2xl font-bold">負責人資訊</h2>
            <div className="mx-auto w-4/5 border-t-2 border-solid border-gray-400 pb-2"></div>
            <Form autoComplete="off" className="mb-8">
              <div className="flex items-center phone:flex-col phone:items-start">
                <h1 className="my-4 mr-6 w-28 text-base font-semibold [text-align-last:justify] phone:mb-0 phone:[text-align-last:auto]">
                  姓名
                </h1>
                <Input
                  className="h-8 w-28"
                  name="userName"
                  onChange={updateUserField}
                  value={userForm.userName}
                />
              </div>

              <div className="flex items-center phone:flex-col phone:items-start">
                <h1 className="my-4 mr-6 w-28 text-base font-semibold [text-align-last:justify] phone:mb-0 phone:[text-align-last:auto]">
                  性別
                </h1>

                <Radio.Group
                  name="gender"
                  onChange={updateUserField}
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
                  onChange={updateUserField}
                  value={userForm.phone}
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

            <h2 className="mb-2 text-2xl font-bold">餐廳資訊</h2>
            <div className="mx-auto w-4/5 border-t-2 border-solid border-gray-400 pb-2"></div>
            <Form autoComplete="off" className="mb-8">
              <div className="flex items-center phone:flex-col phone:items-start">
                <h1 className="my-4 mr-6 w-28 text-base font-semibold [text-align-last:justify] phone:mb-0 phone:[text-align-last:auto]">
                  店名
                </h1>
                <Input
                  className="h-8 w-64"
                  name="name"
                  onChange={updateCompanyField}
                  value={companyForm.name}
                />
              </div>

              <div className="my-4 flex  phone:flex-col phone:items-start">
                <h1 className="mr-6 w-28 text-base font-semibold [text-align-last:justify] phone:mb-0 phone:[text-align-last:auto]">
                  地址
                </h1>

                <div className="flex flex-col gap-4">
                  <div>
                    <h2 className="text-xs text-gray-400">縣市</h2>
                    <Input
                      className="w-20"
                      name="city"
                      onChange={updateCompanyField}
                      value={companyForm.city}
                      placeholder="台北市"
                    />
                  </div>

                  <div>
                    <h2 className="text-xs text-gray-400">鄉鎮市區</h2>
                    <Input
                      className="w-20"
                      name="district"
                      onChange={updateCompanyField}
                      value={companyForm.district}
                      placeholder="中山區"
                    />
                  </div>

                  <div>
                    <h2 className="text-xs text-gray-400">詳細地址</h2>

                    <Input
                      className="w-44"
                      name="address"
                      onChange={updateCompanyField}
                      value={companyForm.address}
                      placeholder="南京西路12巷13弄9號"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center phone:flex-col phone:items-start">
                <h1 className="my-4 mr-6 w-28 text-base font-semibold [text-align-last:justify] phone:mb-0 phone:[text-align-last:auto]">
                  餐廳電話
                </h1>
                <Input
                  className="h-8 w-64"
                  name="telephone"
                  onChange={updateCompanyField}
                  value={companyForm.phone}
                  placeholder="02-2556-5354"
                />
              </div>

              <div className="flex items-center phone:flex-col phone:items-start">
                <h1 className="my-4 mr-6 w-28 text-base font-semibold [text-align-last:justify] phone:mb-0 phone:[text-align-last:auto]">
                  類別
                </h1>
                <Select
                  name="category"
                  onChange={(category) =>
                    updateCompanyForm("category", category)
                  }
                  value={companyForm.category}
                  showSearch
                  style={{
                    width: 200,
                  }}
                  placeholder="點選類別"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "").includes(input)
                  }
                  options={RESTAURANT_CATEGORY_OPTIONS}
                />
              </div>
            </Form>

            <button
              className="mr-8 h-10 w-20 self-end rounded-lg bg-[#ff850e] font-bold text-white hover:bg-[#ff850e]/80"
              onClick={submitBossRegistration}
            >
              下一步
            </button>
          </div>
        </ScrollShadow>
      </div>
    </div>
  );
}

export default StepThreeBoss;
