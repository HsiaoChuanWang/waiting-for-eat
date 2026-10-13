import { Button, ScrollShadow } from "@nextui-org/react";
import { useNavigate, useParams } from "react-router-dom";
import IsLoading from "../../components/IsLoading/index.jsx";
import useCompanyProfile from "../../features/boss/useCompanyProfile.js";
import noMenu from "../Restaurant/restaurantPictures/noMenu.png";
import boss from "../../assets/roles/boss.png";

function Photo() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const { company: companyData = {}, isLoading } = useCompanyProfile(companyId);

  const mainPicture = companyData.picture ? (
    <img
      className="ml-6 w-80 phone:ml-0"
      src={companyData.picture}
      alt={`${companyData.name ?? "餐廳"}封面`}
    />
  ) : (
    <div className="mb-8 flex items-center">
      <img className="w-48" src={boss} alt="" />
      <h1 className="text-xl font-bold text-gray-600">尚未上傳封面照片</h1>
    </div>
  );

  if (isLoading) {
    return <IsLoading />;
  }

  return (
    <div className="relative my-16 flex justify-center phone:my-12">
      <ScrollShadow
        size={0}
        hideScrollBar
        className="flex h-[calc(100vh-300px)] w-full justify-center phone:h-[calc(100vh-360px)]"
      >
        <div className="h-5/6 w-5/6">
          <div className="ml-8 phone:ml-0">
            <h1 className="text-2xl font-bold phone:text-xl">封面照片</h1>
            <div className="w-full border-t-2 border-solid border-gray-300 pb-4"></div>
            <div>{mainPicture}</div>

            <h1 className="mt-6 text-2xl font-bold phone:text-xl">菜單照片</h1>

            <div className="w-full border-t-2 border-solid border-gray-300 pb-6">
              <ScrollShadow
                orientation="horizontal"
                className="w-[700px] phone:w-64 tablet:w-[500px]"
              >
                <div className=" flex w-[1000px] p-4 phone:w-72 tablet:w-[600px]">
                  {companyData.menu ? (
                    companyData.menu.map((picture, index) => (
                      <div
                        className="w-[180px] min-w-[180px] phone:w-64"
                        key={index}
                      >
                        <img
                          className="px-2"
                          src={picture}
                          alt={`菜單照片 ${index + 1}`}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center">
                      <img className="w-48" src={noMenu} alt="" />
                      <h1 className="text-xl font-bold text-gray-600">
                        尚無上傳菜單照片
                      </h1>
                    </div>
                  )}
                </div>
              </ScrollShadow>
            </div>
          </div>

          <Button
            radius="full"
            className="absolute bottom-2 right-24 mt-6 block h-11 rounded-lg bg-[#ff850e] px-4 text-center text-lg font-black text-white shadow-lg phone:bottom-0 phone:right-8 tablet:bottom-0 tablet:right-8"
            onClick={() => navigate(`/boss/photoUpload/${companyId}`)}
          >
            編輯
          </Button>
        </div>
      </ScrollShadow>
    </div>
  );
}

export default Photo;
