const REQUIRED_DINER_FIELDS = ["userName", "gender", "phone"];

function isDinerFormComplete(userForm) {
  return REQUIRED_DINER_FIELDS.every((field) => userForm[field] !== "");
}

export { isDinerFormComplete };
