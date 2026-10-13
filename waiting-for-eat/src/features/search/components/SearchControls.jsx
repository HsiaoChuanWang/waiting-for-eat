/* eslint-disable react/prop-types */
import { Button } from "@nextui-org/react";
import { Form, Select } from "antd";
import { RESTAURANT_CATEGORY_OPTIONS } from "../../../constants/restaurant.js";

const selectClassName =
  "h-10 rounded-lg border-2 border-solid border-[#ff6e06] map:h-8";
const buttonClassName =
  "ml-1 h-10 rounded-lg border bg-[#ff6e06] px-4 py-1 text-center text-xl font-semibold text-white map:h-8 map:text-sm";

function SearchControl({
  buttonText,
  formClassName,
  onChange,
  onSubmit,
  options,
  selectClassName: customSelectClassName = selectClassName,
  value,
}) {
  return (
    <div>
      <Form className={formClassName}>
        <Form.Item className="w-48 map:w-36">
          <Select
            className={customSelectClassName}
            onChange={onChange}
            value={value}
            showSearch
            placeholder="搜尋餐廳"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").includes(input)
            }
            options={options}
          />
        </Form.Item>
        <Button className={buttonClassName} onClick={onSubmit}>
          {buttonText}
        </Button>
      </Form>
    </div>
  );
}

function SearchControls({
  categoryOptions = RESTAURANT_CATEGORY_OPTIONS,
  cityOptions,
  isVisible,
  nameOptions,
  onCategoryChange,
  onCategorySubmit,
  onCityChange,
  onCitySubmit,
  onNameChange,
  onNameSubmit,
  values,
}) {
  return (
    <div
      className={`${
        !isVisible && "hidden"
      } mb-2 mt-8 flex map:absolute map:z-30 map:flex-col`}
    >
      <SearchControl
        buttonText="搜尋餐廳"
        formClassName="ml-10 mr-4 flex map:ml-4"
        onChange={onNameChange}
        onSubmit={onNameSubmit}
        options={nameOptions}
        value={values.name}
      />
      <SearchControl
        buttonText="搜尋地區"
        formClassName="mx-4 flex"
        onChange={onCityChange}
        onSubmit={onCitySubmit}
        options={cityOptions}
        value={values.city}
      />
      <SearchControl
        buttonText="搜尋類別"
        formClassName="mx-4 flex"
        onChange={onCategoryChange}
        onSubmit={onCategorySubmit}
        options={categoryOptions}
        selectClassName={`${selectClassName} map:leading-4`}
        value={values.category}
      />
    </div>
  );
}

export default SearchControls;
