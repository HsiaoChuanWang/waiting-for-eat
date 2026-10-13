import toast from "react-hot-toast";
import { Bs1CircleFill } from "react-icons/bs";
import Alert from "../../components/Alert/index.jsx";
import boss from "../../assets/roles/boss.png";
import diner from "../../assets/roles/diner.png";
import useSignupStore from "../../stores/signupStore.js";
import QuickLogin from "../../features/auth/components/QuickLogin.jsx";
import { SIGNUP_STEPS, USER_ROLES } from "./signupConstants.js";
import stepOne from "./signUpPictures/stepOne.jpg";

function StepOne() {
  const role = useSignupStore((state) => state.role);
  const setRole = useSignupStore((state) => state.setRole);
  const setActiveStep = useSignupStore((state) => state.setActiveStep);

  function nextStep() {
    if (role === "") {
      toast.error("請點選註冊身份");
    } else {
      setActiveStep(SIGNUP_STEPS.ACCOUNT);
    }
  }

  return (
    <div className="relative flex h-[calc(100vh-96px)] w-screen">
      <Alert />
      <QuickLogin />
      <img
        src={stepOne}
        alt=""
        className="h-full w-3/5 object-cover object-center phone:absolute phone:z-0 phone:w-full tablet:w-1/2"
      />

      <div className="flex h-full w-2/5 items-center justify-center phone:absolute phone:z-10 phone:w-full phone:bg-black/40 tablet:w-1/2">
        <div
          className={`flex h-[520px] w-[450px] flex-col items-center justify-center rounded-2xl`}
        >
          <div className="mb-12 flex items-center gap-2 text-3xl font-black text-[#ff850e] phone:text-white">
            <Bs1CircleFill />
            <h1>請選擇註冊身份</h1>
          </div>
          <div
            onClick={() => setRole(USER_ROLES.DINER)}
            className={`${
              role === USER_ROLES.DINER && "bg-slate-300"
            } mb-8 flex cursor-pointer items-center rounded-lg bg-slate-100 hover:bg-slate-200 hover:text-gray-600`}
          >
            <img src={diner} alt="食客" className="h-32" />
            <div className="mr-8 w-32 text-center">
              <h2 className="text-2xl font-bold">食客</h2>
              <h3 className=" text-base font-bold">Foodie</h3>
            </div>
          </div>

          <div
            onClick={() => setRole(USER_ROLES.BOSS)}
            className={`${
              role === USER_ROLES.BOSS && "bg-slate-300"
            } flex cursor-pointer items-center rounded-lg bg-slate-100 hover:bg-slate-200 hover:text-gray-600`}
          >
            <div className="ml-8 w-32 text-center">
              <h2 className="text-2xl font-bold">餐廳業者</h2>
              <h3 className=" text-base font-bold">Owner</h3>
            </div>
            <img src={boss} alt="餐廳業者" className="h-32" />
          </div>

          <button
            className="mr-8 mt-16 h-10 w-20 self-end rounded-lg bg-[#ff850e] font-bold text-white hover:bg-[#ff850e]/80"
            onClick={nextStep}
          >
            下一步
          </button>
        </div>
      </div>
    </div>
  );
}

export default StepOne;
