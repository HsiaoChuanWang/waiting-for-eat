import { Button, Card, ScrollShadow } from "@nextui-org/react";
import { useNavigate, useParams } from "react-router-dom";
import IsLoading from "../../components/IsLoading/index.jsx";
import useCompanyProfile from "../../features/boss/useCompanyProfile.js";
import noActivity from "../Restaurant/restaurantPictures/noActivity.png";

function Activity() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const { company: activity = {}, isLoading } = useCompanyProfile(companyId);

  if (isLoading) {
    return <IsLoading />;
  }

  return (
    <div className="relative my-16 flex justify-center phone:my-12 phone:h-full phone:flex-col phone:items-center phone:justify-start">
      <Card className="h-4/5 w-2/3 border border-solid border-gray-200 py-12 shadow-[-4px_4px_4px_2px_rgba(0,0,0,0.2)] phone:h-[calc(100vh-420px)] phone:w-5/6 phone:py-6">
        <ScrollShadow
          size={0}
          hideScrollBar
          className="flex h-[calc(100vh-400px)] w-full justify-center phone:h-full"
        >
          {activity.description ? (
            <div
              className="p-8 phone:p-6"
              dangerouslySetInnerHTML={{ __html: activity.description }}
            ></div>
          ) : (
            <div className="flex items-center">
              <div>
                <img className="w-48" src={noActivity} />
                <h1 className="text-center text-xl font-bold text-gray-600">
                  尚無活動
                </h1>
              </div>
            </div>
          )}
        </ScrollShadow>
      </Card>

      <Button
        radius="full"
        className="absolute bottom-0 right-16 mt-6 block h-11 rounded-lg bg-[#ff850e] px-4 text-center text-lg font-black text-white shadow-lg phone:static phone:mr-8 phone:self-end tablet:static tablet:ml-8 tablet:self-end laptop:right-8"
        onClick={() => navigate(`/boss/activityEdit/${companyId}`)}
      >
        編輯
      </Button>
    </div>
  );
}

export default Activity;
