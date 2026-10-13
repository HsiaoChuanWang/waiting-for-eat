import { Link } from "react-router-dom";
import useUserStore from "../../stores/userStore.js";
import cook from "../../assets/auth/cook.png";
import stepFour from "./signUpPictures/stepFour.jpg";

function StepFourDiner() {
  const userId = useUserStore((state) => state.userId);

  return (
    <div className="relative flex h-[calc(100vh-96px)] w-screen">
      <img
        src={stepFour}
        className="h-full w-3/5 object-cover object-center phone:absolute phone:z-0 phone:w-full tablet:w-2/5 laptop:w-1/2"
      />

      <div className="flex h-full w-2/5 items-center justify-center phone:absolute phone:z-0 phone:w-full tablet:w-3/5 laptop:w-1/2">
        <div
          className={`flex h-[520px] w-[480px] flex-col items-center justify-center rounded-2xl bg-white phone:w-full`}
        >
          <h2 className="mb-8 animate-bounce text-4xl font-bold text-[#ff850e] phone:text-2xl">
            \ 歡迎您加入「痴吃等待」! /
          </h2>
          <div className="mb-8 flex items-center">
            <img src={cook} className="w-72 phone:w-52 laptop:w-64" />
            <div className="text-3xl font-black phone:text-xl tablet:text-2xl">
              <h2>We are</h2>
              <h2>waiting for</h2>
              <h2>you!</h2>
            </div>
          </div>

          <div className="flex w-full justify-between px-16 phone:px-6">
            <Link
              to={`/diner/dinerInfo/${userId}`}
              className="h-10 w-36 rounded-lg bg-[#ff850e] text-center font-bold leading-10 text-white hover:bg-[#ff850e]/80"
            >
              前往食客專區
            </Link>
            <Link
              to="/"
              className="h-10 w-36 rounded-lg bg-[#ff850e] text-center font-bold leading-10 text-white hover:bg-[#ff850e]/80"
            >
              返回首頁
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StepFourDiner;
