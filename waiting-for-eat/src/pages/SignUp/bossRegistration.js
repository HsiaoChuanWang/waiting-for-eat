const REQUIRED_USER_FIELDS = ["userName", "gender", "phone"];
const REQUIRED_COMPANY_FIELDS = [
  "name",
  "city",
  "district",
  "address",
  "phone",
  "category",
];

function hasRequiredFields(data, fields) {
  return fields.every((field) => data[field] !== "");
}

function isBossFormComplete(userForm, companyForm) {
  return (
    hasRequiredFields(userForm, REQUIRED_USER_FIELDS) &&
    hasRequiredFields(companyForm, REQUIRED_COMPANY_FIELDS)
  );
}

function getCompanyAddress(companyForm) {
  return companyForm.city + companyForm.district + companyForm.address;
}

export { getCompanyAddress, isBossFormComplete };
