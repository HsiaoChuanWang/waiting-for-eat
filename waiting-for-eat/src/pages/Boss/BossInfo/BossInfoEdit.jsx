import { Card, ScrollShadow } from "@nextui-org/react";
import { useLoadScript } from "@react-google-maps/api";
import { Button, Form, Input, Radio, Select } from "antd";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Alert from "../../../components/Alert/index.jsx";
import IsLoading from "../../../components/IsLoading/index.jsx";
import useCompanyProfile from "../../../features/boss/useCompanyProfile.js";
import useDinerProfile from "../../../features/diner/useDinerProfile.js";
import { updateCompany as saveCompany } from "../../../services/repositories/companyRepository.js";
import { updateUser as saveUser } from "../../../services/repositories/userRepository.js";
import { uploadImage } from "../../../services/storage/imageStorage.js";
import useUserStore from "../../../stores/userStore.js";

function BossInfoEdit() {
  useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  });
  const { companyId } = useParams();
  const navigate = useNavigate();
  const userId = useUserStore((state) => state.userId);
  const { isLoading: isUserLoading, profile } = useDinerProfile(userId);
  const { company, isLoading: isCompanyLoading } = useCompanyProfile(companyId);
  const [updateUser, setUpdateUser] = useState({});
  const [updateCompany, setUpdateCompany] = useState({});

  useEffect(() => {
    if (!profile) return;
    setUpdateUser({
      gender: profile.gender,
      phone: profile.phone,
      userName: profile.userName,
    });
  }, [profile]);

  useEffect(() => {
    if (!company) return;
    setUpdateCompany({
      address: company.address,
      category: company.category,
      city: company.city,
      district: company.district,
      name: company.name,
      phone: company.phone,
    });
  }, [company]);

  async function handlePicture(picture) {
    const downloadURL = await uploadImage(userId, picture);
    setUpdateUser((current) => ({ ...current, picture: downloadURL }));
  }

  async function handleUserUpdate() {
    await saveUser(userId, updateUser);
    navigate(`/boss/bossInfo/${companyId}`);
  }

  async function getLocation() {
    const location =
      updateCompany.city + updateCompany.district + updateCompany.address;
    const Geocoder = new window.google.maps.Geocoder();
    const GeocoderRequest = {
      address: location,
      region: "TW",
    };
    let lat;
    let lng;
    Geocoder.geocode(GeocoderRequest, async (results, status) => {
      if (status === "OK" && results.length > 0) {
        lat = results[0].geometry.location.lat();
        lng = results[0].geometry.location.lng();
        await saveCompany(companyId, { ...updateCompany, lat, lng });
        navigate(`/boss/bossInfo/${companyId}`);
      } else {
        toast.error("請確認地址已填寫且地址正確");
      }
    });
  }

  async function handleCompanyUpdate() {
    await getLocation();
  }

  if (isUserLoading || isCompanyLoading) {
    return <IsLoading />;
  }

  return (
    <div className="flex h-full items-center justify-center">
      <Alert />
      <Card className="w-2/3 phone:mt-6 phone:w-5/6 tablet:w-5/6">
        <ScrollShadow
          size={0}
          hideScrollBar
          className=" h-[calc(100vh-300px)] w-full"
        >
          <div className="relative mt-8">
            <h2 className="mb-2 ml-20 text-2xl font-bold phone:text-xl">
              負責人資訊
            </h2>
            <div className="mx-auto w-4/5 border-t-2 border-solid border-gray-400 pb-2"></div>
            <Form className="ml-20 phone:mx-8">
              <div className="flex items-center phone:flex-col phone:items-start">
                <h1 className="my-4 mr-6 w-28 text-base font-semibold [text-align-last:justify] phone:my-2 phone:w-20 phone:text-xs phone:[text-align-last:auto]">
                  姓名
                </h1>
                <Input
                  className="h-8 w-28 phone:mb-4 phone:w-20 phone:text-xs"
                  onChange={(e) =>
                    setUpdateUser({
                      ...updateUser,
                      userName: e.target.value,
                    })
                  }
                  value={updateUser.userName}
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
                    setUpdateUser({
                      ...updateUser,
                      gender: e.target.value,
                    })
                  }
                  value={updateUser.gender}
                >
                  <Radio value="小姐">女</Radio>
                  <Radio value="先生">男</Radio>
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
                    setUpdateUser({
                      ...updateUser,
                      phone: e.target.value,
                    })
                  }
                  value={updateUser.phone}
                />
              </div>

              <div className="mb-4 flex items-center phone:flex-col phone:items-start">
                <h1 className="my-4 mr-6 w-28 text-base font-semibold [text-align-last:justify] phone:my-2 phone:w-20 phone:text-xs phone:[text-align-last:auto]">
                  上傳大頭照
                </h1>
                <Input
                  className="h-8 w-64 text-xs phone:w-44"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePicture(e)}
                />
              </div>

              <Form.Item
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
              >
                <Button
                  style={{ background: "#b0aba5", cursor: "pointer" }}
                  className="absolute bottom-0 right-36  font-bold phone:right-32 tablet:right-28"
                  onClick={() => navigate(`/boss/bossInfo/${companyId}`)}
                  type="primary"
                  htmlType="button"
                >
                  返回
                </Button>

                <Button
                  className="absolute bottom-0 right-16 font-bold phone:right-12 tablet:right-8"
                  onClick={handleUserUpdate}
                  type="primary"
                  htmlType="button"
                >
                  更新
                </Button>
              </Form.Item>
            </Form>
          </div>

          <div className="relative">
            <h2 className="mb-2 ml-20 text-2xl font-bold phone:text-xl">
              餐廳資訊
            </h2>
            <div className="mx-auto w-4/5 border-t-2 border-solid border-gray-400 pb-2"></div>
            <Form className="ml-20 phone:mx-8">
              <div className="flex items-center phone:flex-col phone:items-start">
                <h1 className="my-4 mr-6 w-28 text-base font-semibold [text-align-last:justify] phone:my-2 phone:w-20 phone:text-xs phone:[text-align-last:auto]">
                  店名
                </h1>
                <Input
                  className="h-8 w-64 phone:mb-4 phone:w-44 phone:text-xs"
                  name="name"
                  onChange={(e) =>
                    setUpdateCompany({ ...updateCompany, name: e.target.value })
                  }
                  value={updateCompany.name}
                />
              </div>

              <div className="flex items-start phone:flex-col phone:items-start">
                <h1 className="my-4 mr-6 w-28 text-base font-semibold [text-align-last:justify] phone:my-2 phone:w-20 phone:text-xs phone:[text-align-last:auto]">
                  地址
                </h1>

                <div className="flex phone:mb-4 phone:flex-wrap tablet:w-[calc(100%-136px)] tablet:flex-wrap laptop:w-[calc(100%-136px)] laptop:flex-wrap">
                  <div className="mr-4">
                    <h2 className="text-xs text-gray-400 phone:text-[10px]">
                      縣市
                    </h2>
                    <Input
                      className="w-20 phone:h-8 phone:w-16 phone:text-xs"
                      name="city"
                      onChange={(e) =>
                        setUpdateCompany({
                          ...updateCompany,
                          city: e.target.value,
                        })
                      }
                      value={updateCompany.city}
                    />
                  </div>

                  <div className="mr-4">
                    <h2 className="text-xs text-gray-400 phone:text-[10px]">
                      鄉鎮市區
                    </h2>
                    <Input
                      className="w-20 phone:h-8 phone:w-16 phone:text-xs"
                      name="district"
                      onChange={(e) =>
                        setUpdateCompany({
                          ...updateCompany,
                          district: e.target.value,
                        })
                      }
                      value={updateCompany.district}
                    />
                  </div>

                  <div>
                    <h2 className="text-xs text-gray-400 phone:text-[10px]">
                      詳細地址
                    </h2>

                    <Input
                      className="w-44 phone:h-8 phone:text-xs"
                      name="address"
                      onChange={(e) =>
                        setUpdateCompany({
                          ...updateCompany,
                          address: e.target.value,
                        })
                      }
                      value={updateCompany.address}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center phone:flex-col phone:items-start">
                <h1 className="my-4 mr-6 w-28 text-base font-semibold [text-align-last:justify] phone:my-2 phone:w-20 phone:text-xs phone:[text-align-last:auto]">
                  餐廳電話
                </h1>
                <Input
                  className="h-8 w-64 phone:mb-4 phone:w-44 phone:text-xs"
                  name="telephone"
                  onChange={(e) =>
                    setUpdateCompany({
                      ...updateCompany,
                      phone: e.target.value,
                    })
                  }
                  value={updateCompany.phone}
                />
              </div>

              <div className="mb-4 flex items-center phone:flex-col phone:items-start">
                <h1 className="my-4 mr-6 w-28 text-base font-semibold [text-align-last:justify] phone:my-2 phone:w-20 phone:text-xs phone:[text-align-last:auto]">
                  類別
                </h1>
                <Select
                  name="category"
                  onChange={(e) =>
                    setUpdateCompany({ ...updateCompany, category: e })
                  }
                  value={updateCompany.category}
                  showSearch
                  className="w-48 phone:mb-4 phone:w-44 phone:text-xs"
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

              <Form.Item
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
              >
                <Button
                  style={{ background: "#b0aba5", cursor: "pointer" }}
                  className="absolute bottom-0 right-36 font-bold phone:right-32 tablet:right-28"
                  onClick={() => navigate(`/boss/bossInfo/${companyId}`)}
                  type="primary"
                  htmlType="button"
                >
                  返回
                </Button>

                <Button
                  className="absolute bottom-0 right-16 font-bold phone:right-12 tablet:right-8"
                  onClick={handleCompanyUpdate}
                  type="primary"
                  htmlType="button"
                >
                  更新
                </Button>
              </Form.Item>
            </Form>
          </div>
        </ScrollShadow>
      </Card>
    </div>
  );
}

export default BossInfoEdit;
