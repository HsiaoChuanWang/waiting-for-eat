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

const COMPANY_CATEGORY_OPTIONS = [
  { value: "0", label: "火鍋" },
  { value: "1", label: "燒烤" },
  { value: "2", label: "牛排" },
  { value: "3", label: "甜點" },
  { value: "4", label: "小吃" },
  { value: "5", label: "早餐" },
];

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

export {
  COMPANY_CATEGORY_OPTIONS,
  INITIAL_COMPANY_FORM,
  INITIAL_USER_FORM,
  SIGNUP_STEPS,
  USER_ROLES,
};
