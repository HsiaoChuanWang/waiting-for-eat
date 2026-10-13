import { useEffect } from "react";
import useSignupStore from "../../stores/signupStore.js";
import { SIGNUP_STEPS } from "../../constants/signup.js";
import StepFourBoss from "./StepFourBoss";
import StepFourDiner from "./StepFourDiner";
import StepOne from "./StepOne";
import StepThreeBoss from "./StepThreeBoss";
import StepThreeDiner from "./StepThreeDiner";
import StepTwo from "./StepTwo";

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
