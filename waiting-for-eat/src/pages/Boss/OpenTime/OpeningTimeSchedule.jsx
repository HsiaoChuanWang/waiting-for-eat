import { ScrollShadow } from "@nextui-org/react";
import PropTypes from "prop-types";
import { BsDashLg } from "react-icons/bs";
import { FaTrashCan } from "react-icons/fa6";

const DAYS = [
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六",
  "星期日",
];

function OpeningTimeSchedule({ openTimes, onDelete }) {
  const timesByDay = DAYS.map((day) => ({
    day,
    times: openTimes
      .filter((time) => time.day === day)
      .sort((a, b) => a.start.localeCompare(b.start)),
  }));

  return (
    <ScrollShadow
      size={0}
      hideScrollBar
      className="h-[calc(100vh-400px)] w-full justify-center tablet:h-[calc(100%-50px)]"
    >
      {timesByDay.map(({ day, times }) => (
        <div key={day}>
          <div className="mx-12 flex phone:mx-6 phone:flex-col">
            <h1 className="mr-4 mt-4 h-8 w-24 rounded-md bg-gray-400 text-center text-xl font-bold leading-8 text-white">
              {day}
            </h1>
            {times.length === 0 ? (
              <div className="mb-4 mt-4 text-lg font-bold leading-8">
                無用餐時段
              </div>
            ) : (
              <div className="mb-2">
                {times.map((time) => (
                  <div key={time.timeId} className="mt-2 flex items-center">
                    <h1 className="mr-2 text-lg font-black">{time.start}</h1>
                    <BsDashLg className="text-xl" />
                    <h1 className="ml-2 mr-6 text-lg font-black">{time.end}</h1>
                    <FaTrashCan
                      className="my-4 cursor-pointer"
                      onClick={() => onDelete(time.timeId)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-center">
            <div className="h-4" />
          </div>
        </div>
      ))}
    </ScrollShadow>
  );
}

OpeningTimeSchedule.propTypes = {
  openTimes: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
      start: PropTypes.string.isRequired,
      timeId: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default OpeningTimeSchedule;
