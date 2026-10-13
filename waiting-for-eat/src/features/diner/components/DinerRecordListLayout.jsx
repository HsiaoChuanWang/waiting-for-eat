import { ScrollShadow } from "@nextui-org/react";
import PropTypes from "prop-types";
import noData from "../../../assets/placeholders/no-data.png";

function DinerRecordListLayout({ children, isEmpty, scrollClassName = "" }) {
  return (
    <div className="flex h-full items-center justify-center">
      <ScrollShadow
        size={0}
        hideScrollBar
        className={`flex h-[calc(100vh-300px)] w-full justify-center ${scrollClassName}`}
      >
        <div className="flex h-full w-3/4 flex-col gap-12 phone:mt-12 phone:w-[90%] tablet:w-[90%] laptop:w-5/6">
          {isEmpty ? (
            <div className="mr-8 flex h-full items-center justify-center">
              <img className="w-72" src={noData} alt="" />
              <h1 className="text-2xl font-bold text-gray-600">尚無相關資訊</h1>
            </div>
          ) : (
            children
          )}
        </div>
      </ScrollShadow>
    </div>
  );
}

DinerRecordListLayout.propTypes = {
  children: PropTypes.node,
  isEmpty: PropTypes.bool.isRequired,
  scrollClassName: PropTypes.string,
};

export default DinerRecordListLayout;
