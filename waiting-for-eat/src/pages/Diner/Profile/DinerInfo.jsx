import { Button } from "@nextui-org/react";
import { BsTelephoneFill } from "react-icons/bs";
import { TbGenderFemale } from "react-icons/tb";
import { useNavigate, useParams } from "react-router-dom";
import IsLoading from "../../../components/IsLoading/index.jsx";
import useDinerProfile from "../../../features/diner/useDinerProfile.js";
import diner from "../../../assets/roles/diner.png";

function DinerInfo() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { isLoading, profile: userData = {} } = useDinerProfile(userId);

  if (isLoading) {
    return <IsLoading />;
  }

  return (
    <div className="flex h-full justify-center">
      <div className="relative flex h-[380px] w-[640px] items-center self-center rounded-3xl border-8 border-solid border-black/50 bg-[url('/src/assets/backgrounds/profile-card.png')] phone:mt-12 phone:h-[400px] phone:w-5/6 tablet:w-[550px]">
        <h1 className="absolute right-4 top-2 text-4xl font-black text-black/50 phone:text-2xl">
          Foodies
        </h1>

        <div className="relative flex h-2/3 w-full items-center justify-center bg-[#ece0ca] phone:h-3/4 phone:flex-col">
          <div className="ml-12 flex h-48 w-48 items-center justify-center rounded-full border-8 border-double border-gray-200 bg-white phone:ml-0 phone:h-24 phone:w-24">
            {!userData?.picture ? (
              <img
                className="h-full w-full rounded-full object-cover object-left"
                src={diner}
                alt="食客"
              />
            ) : (
              <img
                className="h-full w-full rounded-full object-cover object-right"
                src={userData.picture}
                alt={`${userData.userName ?? "食客"}的大頭照`}
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

              <div className="mb-4 flex ">
                <div className="mb-2 mr-2 flex h-8 w-8 items-center justify-center rounded bg-black text-white phone:h-6 phone:w-6">
                  <BsTelephoneFill className="text-xl text-[#ece0ca] phone:text-sm" />
                </div>
                <p className="text-2xl font-bold phone:text-lg">
                  {userData.phone}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-16 right-20 phone:right-8 tablet:right-8">
        <Button
          radius="full"
          className="mt-6 block h-11 rounded-lg bg-[#ff850e] px-4 text-center text-lg font-black text-white shadow-lg"
          onClick={() => navigate(`/diner/dinerInfoEdit/${userId}`)}
        >
          編輯
        </Button>
      </div>
    </div>
  );
}

export default DinerInfo;
