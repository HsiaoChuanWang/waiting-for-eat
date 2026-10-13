import { useEffect } from "react";
import useSignupStore from "../../stores/signupStore.js";
import { SIGNUP_STEPS } from "../../constants/signup.js";
import StepFourBoss from "./components/StepFourBoss.jsx";
import StepFourDiner from "./components/StepFourDiner.jsx";
import StepOne from "./components/StepOne.jsx";
import StepThreeBoss from "./components/StepThreeBoss.jsx";
import StepThreeDiner from "./components/StepThreeDiner.jsx";
import StepTwo from "./components/StepTwo.jsx";

function SignUp() {
  const activeStep = useSignupStore((state) => state.activeStep);
  const resetSignup = useSignupStore((state) => state.resetSignup);

  useEffect(() => resetSignup, [resetSignup]);

  const signUpComponents = {
    [SIGNUP_STEPS.ROLE]: <StepOne />,
    [SIGNUP_STEPS.ACCOUNT]: <StepTwo />,
    [SIGNUP_STEPS.DINER_PROFILE]: <StepThreeDiner />,
    [SIGNUP_STEPS.BOSS_PROFILE]: <StepThreeBoss />,
    [SIGNUP_STEPS.DINER_COMPLETE]: <StepFourDiner />,
    [SIGNUP_STEPS.BOSS_COMPLETE]: <StepFourBoss />,
  };

  return (
    <>
      <div>{signUpComponents[activeStep]}</div>
    </>
  );
}

export default SignUp;
