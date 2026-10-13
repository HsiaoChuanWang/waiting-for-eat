import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { BsTelephoneFill } from "react-icons/bs";
import { IoMdPin } from "react-icons/io";
import { IoRestaurant } from "react-icons/io5";
import { MdAdsClick, MdFastfood } from "react-icons/md";
import { PiPhoneCallFill } from "react-icons/pi";
import { TbGenderFemale } from "react-icons/tb";
import { useNavigate, useParams } from "react-router-dom";
import IsLoading from "../../components/IsLoading/index.jsx";
import useCompanyProfile from "../../features/boss/useCompanyProfile.js";
import useDinerProfile from "../../features/diner/useDinerProfile.js";
import { getCompanyCategoryType } from "../../services/repositories/companyRepository.js";
import useUserStore from "../../stores/userStore.js";
import boss from "../SignUp/signUpPictures/boss.png";

function BossInfo() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [type, setType] = useState("");
  const userId = useUserStore((state) => state.userId);
  const { isLoading: isUserLoading, profile: userData = {} } =
    useDinerProfile(userId);
  const { company: companyData = {}, isLoading: isCompanyLoading } =
    useCompanyProfile(companyId);

  useEffect(() => {
    if (!companyData.category) return;

    let isActive = true;
    getCompanyCategoryType(companyData.category).then((categoryType) => {
      if (isActive) setType(categoryType);
    });

    return () => {
      isActive = false;
    };
  }, [companyData.category]);

  if (isUserLoading || isCompanyLoading) {
    return <IsLoading />;
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <label className="swap swap-flip text-9xl phone:mt-6">
        <input type="checkbox" />

        <div className="swap-off flex flex-col">
          <div className="mb-2 mr-2 flex items-center gap-2 self-end phone:mr-8">
            <MdAdsClick className="text-3xl phone:text-xl" />
            <h1 className="text-base phone:text-xs">點擊名片以查看餐廳資訊</h1>
          </div>

          <div className="relative flex h-[380px] w-[640px] items-center self-center rounded-3xl border-8 border-solid border-black/50 bg-[url('/src/pages/Diner/contentBg.png')] phone:h-[400px] phone:w-5/6 tablet:w-[550px]">
            <h1 className="absolute right-4 top-2 text-4xl font-black text-black/50 phone:text-2xl">
              Owner
            </h1>
            <div className="relative flex h-2/3 w-full items-center justify-center bg-[#ece0ca] phone:h-3/4 phone:flex-col">
              <div className="ml-12 flex h-48 w-48 items-center justify-center rounded-full border-8 border-double border-gray-200 bg-white phone:ml-0 phone:h-24 phone:w-24">
                {userData.picture === "" ? (
                  <img
                    className="h-full w-full rounded-full object-cover object-center"
                    src={boss}
                  />
                ) : (
                  <img
                    className="h-full w-full rounded-full object-cover object-center"
                    src={userData.picture}
                  />
                )}
              </div>

              <div className="mr-6 w-1/2 phone:w-full">
                <div className="ml-12 mt-2 flex">
                  <p className="text-3xl font-bold phone:text-xl">
                    {userData.userName}
                  </p>
                </div>

                <div className="ml-12 mt-6">
                  <div className="mb-4 flex">
                    <div className="mb-2 mr-2 flex h-8 w-8 items-center justify-center rounded bg-black text-white phone:h-6 phone:w-6">
                      <TbGenderFemale className="text-4xl text-[#ece0ca] phone:text-lg" />
                    </div>
                    <p className="text-2xl font-bold phone:text-lg">
                      {userData.gender === "小姐" ? "女" : "男"}
                    </p>
                  </div>

                  <div className="mb-4 flex font-bold">
                    <div className="mb-2 mr-2 flex h-8 w-8 items-center justify-center rounded bg-black text-white phone:h-6 phone:w-6">
                      <BsTelephoneFill className="text-xl text-[#ece0ca] phone:text-sm" />
                    </div>
                    <p className="text-2xl phone:text-lg">{userData.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="swap-on flex flex-col items-center">
          <div className="mb-2 mr-2 flex gap-2 self-end phone:mr-8">
            <MdAdsClick className="text-3xl phone:text-xl" />
            <h1 className="phone: text-base phone:text-xs">
              點擊名片以查看個人資訊
            </h1>
          </div>

          <div className="relative flex h-[380px] w-[640px] items-center rounded-3xl border-8 border-solid border-black/50 bg-[url('/src/pages/Diner/contentBg.png')]  phone:h-[400px] phone:w-5/6 tablet:w-[550px]">
            <h1 className="absolute right-4 top-2 text-4xl font-black text-black/50 phone:text-2xl">
              Restaurant
            </h1>

            <div className="absolute top-14 h-12 w-full bg-black/50"></div>
            <div className="absolute top-28 h-1 w-full bg-black/50"></div>

            <div className="ml-12 mt-28 rounded-2xl bg-[#ece0ca] px-6 py-4 phone:mx-4 phone:h-1/2 phone:px-4 phone:py-2">
              <div className="mb-4 flex items-center text-black">
                <IoRestaurant className="mr-4 text-2xl phone:mr-2 phone:text-base" />
                <p className="text-xl font-black phone:text-base">
                  {companyData.name}
                </p>
              </div>

              <div className="my-4 flex items-center text-black">
                <PiPhoneCallFill className="mr-4 text-2xl phone:mr-2 phone:text-base" />
                <p className="text-xl font-black phone:text-base">
                  {companyData.phone}
                </p>
              </div>

              <div className="my-4 flex items-center text-black">
                <IoMdPin className="mr-4 text-2xl phone:mr-2 phone:self-start" />
                <p className="text-xl font-black phone:text-base">
                  {companyData.city}
                  {companyData.district}
                  {companyData.address}
                </p>
              </div>

              <div className="mt-4 flex items-center text-black">
                <MdFastfood className="mr-4 text-2xl phone:mr-2 phone:text-base" />
                <p className="text-xl font-black phone:text-base">{type}</p>
              </div>
            </div>
          </div>
        </div>
      </label>
      <div className="absolute bottom-16 right-20 phone:right-8 tablet:right-10">
        <Button
          radius="full"
          className="mt-6 block h-11 rounded-lg bg-[#ff850e] px-4 text-center text-lg font-black text-white shadow-lg"
          onClick={() => navigate(`/boss/bossInfoEdit/${companyId}`)}
        >
          編輯
        </Button>
      </div>
    </div>
  );
}

export default BossInfo;
