const SIGNUP_STEPS = {
  ROLE: "StepOne",
  ACCOUNT: "StepTwo",
  DINER_PROFILE: "StepThreeDiner",
  BOSS_PROFILE: "StepThreeBoss",
  DINER_COMPLETE: "StepFourDiner",
  BOSS_COMPLETE: "StepFourBoss",
};

const USER_ROLES = {
  DINER: "diner",
  BOSS: "boss",
};

const INITIAL_USER_FORM = {
  userName: "",
  address: "",
  companyId: "",
  gender: "",
  phone: "",
  picture: "",
  status: "active",
};

const INITIAL_COMPANY_FORM = {
  name: "",
  city: "",
  district: "",
  address: "",
  phone: "",
  category: "",
  totalStar: 0,
};

export { INITIAL_COMPANY_FORM, INITIAL_USER_FORM, SIGNUP_STEPS, USER_ROLES };
