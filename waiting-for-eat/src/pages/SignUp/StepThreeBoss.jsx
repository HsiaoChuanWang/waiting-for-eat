import { ScrollShadow } from "@nextui-org/react";
import { useLoadScript } from "@react-google-maps/api";
import { Form, Input, Radio, Select } from "antd";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Bs3CircleFill } from "react-icons/bs";
import Alert from "../../components/Alert/index.jsx";
import { uploadImage } from "../../services/storage/imageStorage.js";
import useUserStore from "../../stores/userStore.js";
import stepThree from "./signUpPictures/stepThree.jpg";

function StepThreeBoss({ setActive }) {
  useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  });
  const userId = useUserStore((state) => state.userId);
  const setDetailInfo = useUserStore((state) => state.setDetailInfo);
  const sendUserInfoToFirestore = useUserStore(
    (state) => state.sendUserInfoToFirestore,
  );
  const setCompanyInfo = useUserStore((state) => state.setCompanyInfo);
  const sendCompanyInfoToFirestore = useUserStore(
    (state) => state.sendCompanyInfoToFirestore,
  );

  const checkRef = useRef(false);

  const [detail, setDetail] = useState({
    userName: "",
    address: "",
    companyId: "",
    gender: "",
    phone: "",
    picture: "",
    status: "active",
  });

  const [company, setCompany] = useState({
    name: "",
    city: "",
    district: "",
    address: "",
    phone: "",
    category: "",
    totalStar: 0,
  });

  async function handlePicture(picture) {
    const downloadURL = await uploadImage(userId, picture);
    setDetail({ ...detail, picture: downloadURL });
  }

  async function getLocation() {
    const location = company.city + company.district + company.address;
    const Geocoder = new window.google.maps.Geocoder();
    const GeocoderRequest = {
      address: location,
      region: "TW",
    };
    let lat;
    let lng;
    Geocoder.geocode(GeocoderRequest, (results, status) => {
      if (status === "OK" && results.length > 0) {
        lat = results[0].geometry.location.lat();
        lng = results[0].geometry.location.lng();
        let obj = company;
        obj.lat = lat;
        obj.lng = lng;
        setCompanyInfo(company);
        sendCompanyInfoToFirestore();
      } else {
        toast.error("請確認地址已填寫且地址正確");
      }
    });
  }

  const handleData = (e) => {
    let target = e.target.name;
    let value = e.target.value;

    switch (target) {
      case "userName":
        setDetail({ ...detail, userName: value });
        break;
      case "gender":
        setDetail({ ...detail, gender: value });
        break;
      case "phone":
        setDetail({ ...detail, phone: value });
        break;
      case "picture":
        handlePicture(e.target.files[0]);
        break;
    }
  };

  const handleCompany = (e) => {
    let target = e.target.name;
    let value = e.target.value;
    switch (target) {
      case "name":
        setCompany({ ...company, name: value });
        break;
      case "city":
        setCompany({ ...company, city: value });
        break;
      case "district":
        setCompany({ ...company, district: value });
        break;
      case "address":
        setCompany({ ...company, address: value });
        break;
      case "telephone":
        setCompany({ ...company, phone: value });
        break;
    }
  };

  async function nextStep() {
    if (
      detail.userName != "" &&
      detail.gender != "" &&
      detail.phone != "" &&
      !Object.values(company).includes("")
    ) {
      checkRef.current = false;
      await getLocation();
      if (company.lat !== "") {
        await setDetailInfo(detail);
        await sendUserInfoToFirestore();
        setActive("StepFourBoss");
      }
    } else {
      toast.error("請填寫完整資訊");
    }
  }

  return (
    <div className="relative flex h-[calc(100vh-96px)] w-screen items-center">
      <Alert />
      <img
        src={stepThree}
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
                  onChange={(e) => handleData(e)}
                  value={detail.userName}
                />
              </div>

              <div className="flex items-center phone:flex-col phone:items-start">
                <h1 className="my-4 mr-6 w-28 text-base font-semibold [text-align-last:justify] phone:mb-0 phone:[text-align-last:auto]">
                  性別
                </h1>

                <Radio.Group
                  name="gender"
                  onChange={(e) => handleData(e)}
                  value={detail.gender}
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
                  onChange={(e) => handleData(e)}
                  value={detail.phone}
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
                  onChange={(e) => handleData(e)}
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
                  onChange={(e) => handleCompany(e)}
                  value={company.name}
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
                      onChange={(e) => handleCompany(e)}
                      value={company.city}
                      placeholder="台北市"
                    />
                  </div>

                  <div>
                    <h2 className="text-xs text-gray-400">鄉鎮市區</h2>
                    <Input
                      className="w-20"
                      name="district"
                      onChange={(e) => handleCompany(e)}
                      value={company.district}
                      placeholder="中山區"
                    />
                  </div>

                  <div>
                    <h2 className="text-xs text-gray-400">詳細地址</h2>

                    <Input
                      className="w-44"
                      name="address"
                      onChange={(e) => handleCompany(e)}
                      value={company.address}
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
                  onChange={(e) => handleCompany(e)}
                  value={company.phone}
                  placeholder="02-2556-5354"
                />
              </div>

              <div className="flex items-center phone:flex-col phone:items-start">
                <h1 className="my-4 mr-6 w-28 text-base font-semibold [text-align-last:justify] phone:mb-0 phone:[text-align-last:auto]">
                  類別
                </h1>
                <Select
                  name="category"
                  onChange={(e) => setCompany({ ...company, category: e })}
                  value={company.category}
                  showSearch
                  style={{
                    width: 200,
                  }}
                  placeholder="點選類別"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "").includes(input)
                  }
                  options={[
                    {
                      value: "0",
                      label: "火鍋",
                    },
                    {
                      value: "1",
                      label: "燒烤",
                    },
                    {
                      value: "2",
                      label: "牛排",
                    },
                    {
                      value: "3",
                      label: "甜點",
                    },
                    {
                      value: "4",
                      label: "小吃",
                    },
                    {
                      value: "5",
                      label: "早餐",
                    },
                  ]}
                />
              </div>
            </Form>

            <button
              className="mr-8 h-10 w-20 self-end rounded-lg bg-[#ff850e] font-bold text-white hover:bg-[#ff850e]/80"
              onClick={nextStep}
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
