import { BsPersonFill } from "react-icons/bs";
import { FaRegCalendarCheck } from "react-icons/fa6";
import { GiMeal } from "react-icons/gi";
import { IoTime } from "react-icons/io5";
import { MdNotificationsActive, MdPhotoLibrary } from "react-icons/md";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function BossSidebar() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const selectedBossBar = pathname.split("/")[2];

  return (
    <>
      <div className="w-full">
        <div className="flex flex-wrap bg-zinc-600/70 phone:w-full phone:flex-nowrap">
          <div
            className={`flex h-[calc((100vh-176px)/6)] w-full cursor-pointer items-center justify-center border-b border-solid border-gray-400 font-black text-white phone:h-20 ${
              selectedBossBar === "bossInfo" ||
              selectedBossBar === "bossInfoEdit"
                ? "bg-zinc-800/80 phone:w-[calc(100%/6*2)]"
                : "duration-150 hover:bg-zinc-500 phone:w-[calc(100%/6)]"
            }`}
            onClick={() => {
              navigate(`/boss/bossInfo/${companyId}`);
            }}
          >
            <div>
              <BsPersonFill
                className={`mx-auto mb-1 text-4xl ${
                  selectedBossBar === "bossInfo" ||
                  selectedBossBar === "bossInfoEdit"
                    ? "phone:text-2xl"
                    : "phone:text-xl"
                }`}
              />
              <button
                className={`text-sm ${
                  selectedBossBar === "bossInfo" ||
                  selectedBossBar === "bossInfoEdit"
                    ? "phone:text-xs"
                    : "phone:hidden"
                }`}
              >
                業者資訊
              </button>
            </div>
          </div>

          <div
            className={`flex h-[calc((100vh-176px)/6)] w-full cursor-pointer items-center justify-center border-b border-solid border-gray-400 font-black text-white phone:h-20 ${
              selectedBossBar === "photo" || selectedBossBar === "photoUpload"
                ? "bg-zinc-800/80 phone:w-[calc(100%/6*2)]"
                : "duration-150 hover:bg-zinc-500 phone:w-[calc(100%/6)]"
            }`}
            onClick={() => {
              navigate(`/boss/photo/${companyId}`);
            }}
          >
            <div>
              <MdPhotoLibrary
                className={`mx-auto mb-1 text-4xl ${
                  selectedBossBar === "photo" ||
                  selectedBossBar === "photoUpload"
                    ? "phone:text-2xl"
                    : "phone:text-xl"
                }`}
              />
              <button
                className={`text-sm ${
                  selectedBossBar === "photo" ||
                  selectedBossBar === "photoUpload"
                    ? "phone:text-xs"
                    : "phone:hidden"
                }`}
              >
                編輯照片
              </button>
            </div>
          </div>

          <div
            className={`flex h-[calc((100vh-176px)/6)] w-full cursor-pointer items-center justify-center border-b border-solid border-gray-400 font-black text-white phone:h-20 ${
              selectedBossBar === "activity" ||
              selectedBossBar === "activityEdit"
                ? "bg-zinc-800/80 phone:w-[calc(100%/6*2)]"
                : "duration-150 hover:bg-zinc-500 phone:w-[calc(100%/6)]"
            }`}
            onClick={() => {
              navigate(`/boss/activity/${companyId}`);
            }}
          >
            <div>
              <MdNotificationsActive
                className={`mx-auto mb-1 text-4xl ${
                  selectedBossBar === "activity" ||
                  selectedBossBar === "activityEdit"
                    ? "phone:text-2xl"
                    : "phone:text-xl"
                }`}
              />
              <button
                className={`text-sm ${
                  selectedBossBar === "activity" ||
                  selectedBossBar === "activityEdit"
                    ? "phone:text-xs"
                    : "phone:hidden"
                }`}
              >
                編輯活動
              </button>
            </div>
          </div>

          <div
            className={`flex h-[calc((100vh-176px)/6)] w-full cursor-pointer items-center justify-center border-b border-solid border-gray-400 font-black text-white phone:h-20 ${
              selectedBossBar === "openTime"
                ? "bg-zinc-800/80 phone:w-[calc(100%/6*2)]"
                : "duration-150 hover:bg-zinc-500 phone:w-[calc(100%/6)]"
            }`}
            onClick={() => {
              navigate(`/boss/openTime/${companyId}`);
            }}
          >
            <div>
              <IoTime
                className={`mx-auto mb-1 text-4xl ${
                  selectedBossBar === "openTime"
                    ? "phone:text-2xl"
                    : "phone:text-xl"
                }`}
              />
              <button
                className={`text-sm ${
                  selectedBossBar === "openTime"
                    ? "phone:text-xs"
                    : "phone:hidden"
                }`}
              >
                用餐時間設定
              </button>
            </div>
          </div>

          <div
            className={`flex h-[calc((100vh-176px)/6)] w-full cursor-pointer items-center justify-center border-b border-solid border-gray-400 font-black text-white phone:h-20 ${
              selectedBossBar === "table"
                ? "bg-zinc-800/80 phone:w-[calc(100%/6*2)]"
                : "duration-150 hover:bg-zinc-500 phone:w-[calc(100%/6)]"
            }`}
            onClick={() => {
              navigate(`/boss/table/${companyId}`);
            }}
          >
            <div>
              <GiMeal
                className={`mx-auto mb-1 text-4xl ${
                  selectedBossBar === "table"
                    ? "phone:text-2xl"
                    : "phone:text-xl"
                }`}
              />
              <button
                className={`text-sm ${
                  selectedBossBar === "table" ? "phone:text-xs" : "phone:hidden"
                }`}
              >
                桌位設定
              </button>
            </div>
          </div>

          <div
            className={`flex h-[calc((100vh-176px)/6)] w-full cursor-pointer items-center justify-center border-b border-solid border-gray-400 font-black text-white phone:h-20 ${
              selectedBossBar === "schedule"
                ? "bg-zinc-800/80 phone:w-[calc(100%/6*2)]"
                : "duration-150 hover:bg-zinc-500 phone:w-[calc(100%/6)]"
            }`}
            onClick={() => {
              navigate(`/boss/schedule/${companyId}`);
            }}
          >
            <div>
              <FaRegCalendarCheck
                className={`mx-auto mb-1 text-4xl ${
                  selectedBossBar === "schedule"
                    ? "phone:text-2xl"
                    : "phone:text-xl"
                }`}
              />
              <button
                className={`text-sm ${
                  selectedBossBar === "schedule"
                    ? "phone:text-xs"
                    : "phone:hidden"
                }`}
              >
                預約現況
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BossSidebar;
