import { BiSolidCommentDetail } from "react-icons/bi";
import { BsPersonFill } from "react-icons/bs";
import { CgNotes } from "react-icons/cg";
import { FaCalendarCheck } from "react-icons/fa";
import { HiThumbDown, HiThumbUp } from "react-icons/hi";
import { PiForkKnifeFill } from "react-icons/pi";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function DinerSidebar() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const selectedDinerBar = pathname.split("/")[2];

  return (
    <>
      <div className="w-full">
        <div className="flex flex-wrap bg-zinc-600/70 phone:w-full phone:flex-nowrap">
          <div
            className={`flex h-[calc((100vh-176px)/7)] w-full cursor-pointer items-center justify-center border-b border-solid border-gray-400 font-black text-white phone:h-20 ${
              selectedDinerBar === "dinerInfo" ||
              selectedDinerBar === "dinerInfoEdit"
                ? "bg-zinc-800/80 phone:w-[calc(100%/8*2)]"
                : "duration-150 hover:bg-zinc-500 phone:w-[calc(100%/8)]"
            }`}
            onClick={() => {
              navigate(`/diner/dinerInfo/${userId}`);
            }}
          >
            <div>
              <BsPersonFill
                className={`mx-auto mb-1 text-4xl ${
                  selectedDinerBar === "dinerInfo" ||
                  selectedDinerBar === "dinerInfoEdit"
                    ? "phone:text-2xl"
                    : "phone:text-xl"
                }`}
              />
              <button
                className={`text-sm ${
                  selectedDinerBar === "dinerInfo" ||
                  selectedDinerBar === "dinerInfoEdit"
                    ? "phone:text-xs"
                    : "phone:hidden"
                }`}
              >
                食客資訊
              </button>
            </div>
          </div>

          <div
            className={`flex h-[calc((100vh-176px)/7)] w-full cursor-pointer items-center justify-center border-b border-solid border-gray-400 font-black text-white phone:h-20 ${
              selectedDinerBar === "reservedShop"
                ? "bg-zinc-800/80 phone:w-[calc(100%/8*2)]"
                : "duration-150 hover:bg-zinc-500 phone:w-[calc(100%/8)]"
            }`}
            onClick={() => {
              navigate(`/diner/reservedShop/${userId}`);
            }}
          >
            <div>
              <FaCalendarCheck
                className={`mx-auto mb-1 text-4xl ${
                  selectedDinerBar === "reservedShop"
                    ? "phone:text-2xl"
                    : "phone:text-xl"
                }`}
              />
              <button
                className={`text-sm ${
                  selectedDinerBar === "reservedShop"
                    ? "phone:text-xs"
                    : "phone:hidden"
                }`}
              >
                已預約餐廳
              </button>
            </div>
          </div>

          <div
            className={`flex h-[calc((100vh-176px)/7)] w-full cursor-pointer items-center justify-center border-b border-solid border-gray-400 font-black text-white phone:h-20 ${
              selectedDinerBar === "eatenShop" || selectedDinerBar === "addStar"
                ? "bg-zinc-800/80 phone:w-[calc(100%/8*2)]"
                : "duration-150 hover:bg-zinc-500 phone:w-[calc(100%/8)]"
            }`}
            onClick={() => {
              navigate(`/diner/eatenShop/${userId}`);
            }}
          >
            <div>
              <PiForkKnifeFill
                className={`mx-auto mb-1 text-4xl ${
                  selectedDinerBar === "eatenShop" ||
                  selectedDinerBar === "addStar"
                    ? "phone:text-2xl"
                    : "phone:text-xl"
                }`}
              />
              <button
                className={`text-sm ${
                  selectedDinerBar === "eatenShop" ||
                  selectedDinerBar === "addStar"
                    ? "phone:text-xs"
                    : "phone:hidden"
                }`}
              >
                吃過的餐廳
              </button>
            </div>
          </div>

          <div
            className={`flex h-[calc((100vh-176px)/7)] w-full cursor-pointer items-center justify-center border-b border-solid border-gray-400 font-black text-white phone:h-20 ${
              selectedDinerBar === "likeShop"
                ? "bg-zinc-800/80 phone:w-[calc(100%/8*2)]"
                : "duration-150 hover:bg-zinc-500 phone:w-[calc(100%/8)]"
            }`}
            onClick={() => {
              navigate(`/diner/likeShop/${userId}`);
            }}
          >
            <div>
              <HiThumbUp
                className={`mx-auto mb-1 text-4xl ${
                  selectedDinerBar === "likeShop"
                    ? "phone:text-2xl"
                    : "phone:text-xl"
                }`}
              />
              <button
                className={`text-sm ${
                  selectedDinerBar === "likeShop"
                    ? "phone:text-xs"
                    : "phone:hidden"
                }`}
              >
                狠讚的餐廳
              </button>
            </div>
          </div>

          <div
            className={`flex h-[calc((100vh-176px)/7)] w-full cursor-pointer items-center justify-center border-b border-solid border-gray-400 font-black text-white phone:h-20 ${
              selectedDinerBar === "dislikeShop"
                ? "bg-zinc-800/80 phone:w-[calc(100%/8*2)]"
                : "duration-150 hover:bg-zinc-500 phone:w-[calc(100%/8)]"
            }`}
            onClick={() => {
              navigate(`/diner/dislikeShop/${userId}`);
            }}
          >
            <div>
              <HiThumbDown
                className={`mx-auto mb-1 text-4xl ${
                  selectedDinerBar === "dislikeShop"
                    ? "phone:text-2xl"
                    : "phone:text-xl"
                }`}
              />
              <button
                className={`text-sm ${
                  selectedDinerBar === "dislikeShop"
                    ? "phone:text-xs"
                    : "phone:hidden"
                }`}
              >
                黑名單餐廳
              </button>
            </div>
          </div>

          <div
            className={`flex h-[calc((100vh-176px)/7)] w-full cursor-pointer items-center justify-center border-b border-solid border-gray-400 font-black text-white phone:h-20 ${
              selectedDinerBar === "posted"
                ? "bg-zinc-800/80 phone:w-[calc(100%/8*2)]"
                : "duration-150 hover:bg-zinc-500 phone:w-[calc(100%/8)]"
            }`}
            onClick={() => {
              navigate(`/diner/posted/${userId}`);
            }}
          >
            <div>
              <CgNotes
                className={`mx-auto mb-1 text-4xl ${
                  selectedDinerBar === "posted"
                    ? "phone:text-2xl"
                    : "phone:text-xl"
                }`}
              />
              <button
                className={`text-sm ${
                  selectedDinerBar === "posted"
                    ? "phone:text-xs"
                    : "phone:hidden"
                }`}
              >
                我的食記
              </button>
            </div>
          </div>

          <div
            className={`flex h-[calc((100vh-176px)/7)] w-full cursor-pointer items-center justify-center border-b border-solid border-gray-400 font-black text-white phone:h-20 ${
              selectedDinerBar === "commented" ||
              selectedDinerBar === "starEdit"
                ? "bg-zinc-800/80 phone:w-[calc(100%/8*2)]"
                : "duration-150 hover:bg-zinc-500 phone:w-[calc(100%/8)]"
            }`}
            onClick={() => {
              navigate(`/diner/commented/${userId}`);
            }}
          >
            <div>
              <BiSolidCommentDetail
                className={`mx-auto mb-1 text-4xl ${
                  selectedDinerBar === "commented" ||
                  selectedDinerBar === "starEdit"
                    ? "phone:text-2xl"
                    : "phone:text-xl"
                }`}
              />
              <button
                className={`text-sm ${
                  selectedDinerBar === "commented" ||
                  selectedDinerBar === "starEdit"
                    ? "phone:text-xs"
                    : "phone:hidden"
                }`}
              >
                我的評論
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DinerSidebar;
