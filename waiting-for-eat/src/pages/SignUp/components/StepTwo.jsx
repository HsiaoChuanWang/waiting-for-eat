import { Input } from "@nextui-org/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Bs2CircleFill } from "react-icons/bs";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Alert from "../../../components/Alert/index.jsx";
import {
  createAccountWithEmail,
  signInWithGoogle,
  signOutCurrentUser,
} from "../../../services/auth/authenticationService.js";
import { getUserById } from "../../../services/repositories/userRepository.js";
import useUserStore from "../../../stores/userStore.js";
import useSignupStore from "../../../stores/signupStore.js";
import { SIGNUP_STEPS, USER_ROLES } from "../../../constants/signup.js";
import googleLogo from "../../../assets/auth/google-logo.png";
import stepTwo from "../assets/step-two.jpg";

function StepTwo() {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const setUserId = useUserStore((state) => state.setUserId);
  const setIsLogout = useUserStore((state) => state.setIsLogout);
  const role = useSignupStore((state) => state.role);
  const setActiveStep = useSignupStore((state) => state.setActiveStep);

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  function goToProfileStep() {
    setActiveStep(
      role === USER_ROLES.DINER
        ? SIGNUP_STEPS.DINER_PROFILE
        : SIGNUP_STEPS.BOSS_PROFILE,
    );
  }

  async function nextStep() {
    try {
      const response = await createAccountWithEmail(email, password);
      setUserId(response.user.uid);
      goToProfileStep();
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("此email已經註冊");
      } else if (error.code === "auth/weak-password") {
        toast.error("密碼請至少填寫6碼");
      } else {
        toast.error("請確認email是否填寫正確");
      }
    }
  }

  async function googleSignUp() {
    try {
      const response = await signInWithGoogle();
      const googleUserId = response.user.uid;
      setUserId(googleUserId);

      const existingUser = await getUserById(googleUserId);
      if (existingUser) {
        toast.error("此google帳號已註冊");
        await signOutCurrentUser();
        setIsLogout();
        return;
      }

      goToProfileStep();
    } catch {
      toast.error("Google 註冊失敗，請稍後再試");
    }
  }

  return (
    <div className="relative flex h-[calc(100vh-96px)] w-screen">
      <Alert />
      <img
        src={stepTwo}
        alt=""
        className="h-full w-3/5 object-cover object-center phone:absolute phone:z-0 phone:w-full tablet:w-1/2"
      />

      <div className="flex h-full w-2/5 items-center justify-center phone:absolute phone:z-10 phone:w-full tablet:w-1/2">
        <div
          className={`flex h-[520px] w-[450px] flex-col items-center justify-center rounded-2xl bg-white`}
        >
          <div className="mb-12 flex items-center gap-2 text-3xl font-black text-[#ff850e]">
            <Bs2CircleFill />
            <h1>註冊帳號</h1>
          </div>

          <div className="flex h-11 w-80 items-center justify-center gap-2 rounded-lg bg-slate-100 shadow-sm hover:cursor-pointer hover:bg-slate-200">
            <img src={googleLogo} alt="Google" className="h-6 w-6" />
            <button onClick={googleSignUp} className=" font-semibold">
              使用Google註冊
            </button>
          </div>

          <div className="my-4 flex w-80 items-center">
            <div className="w-full border-t border-solid border-gray-800"></div>
            <span className="px-2 text-sm text-gray-500">or</span>
            <div className="w-full border-t border-solid border-gray-500"></div>
          </div>

          <div className="w-80">
            <Input
              type="email"
              variant="bordered"
              labelPlacement="outside"
              color={"warning"}
              label="Email"
              placeholder="test@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-12 hover:border-red-300"
            />

            <Input
              label="Password"
              variant="bordered"
              labelPlacement="outside"
              color={"warning"}
              placeholder="請輸入至少6碼"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <FiEye className="pointer-events-none text-xl text-default-400" />
                  ) : (
                    <FiEyeOff className="pointer-events-none text-xl text-default-400" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
              className="mb-8"
            />
          </div>

          <button
            className="mr-8 mt-8 h-10 w-20 self-end rounded-lg bg-[#ff850e] font-bold text-white hover:bg-[#ff850e]/80"
            onClick={nextStep}
          >
            下一步
          </button>
        </div>
      </div>
    </div>
  );
}

export default StepTwo;
