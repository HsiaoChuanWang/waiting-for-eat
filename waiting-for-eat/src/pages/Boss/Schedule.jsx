import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import { ScrollShadow } from "@nextui-org/react";
import { DatePicker } from "antd";
import dateFormat from "dateformat";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import IsLoading from "../../components/IsLoading/index.jsx";
import {
  applyScheduleMoves,
  createScheduleEvents,
  createScheduleResources,
  recordScheduleMove,
} from "../../features/boss/scheduleModel.js";
import useScheduleData from "../../features/boss/useScheduleData.js";
import { saveEatenFavorite } from "../../services/repositories/favoriteRepository.js";
import {
  deleteOrder,
  markOrderAttended,
  updateOrderSchedule,
} from "../../services/repositories/orderRepository.js";
import noSchedule from "./noSchedule.png";
import "./schedule.css";

function Schedule() {
  const [editable, setEditable] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const myRef = useRef();
  const { companyId } = useParams();
  const { isLoading, orders, tables } = useScheduleData(companyId);
  const [updateOrders, setUpdateOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const resources = createScheduleResources(tables);
  const events = createScheduleEvents(orders);

  function MyDropEvent(info) {
    setUpdateOrders((current) =>
      recordScheduleMove(current, orders, info.event),
    );
  }

  function changeStartDate(date, dateString) {
    if (date != null) myRef.current.getApi().gotoDate(dateString);
    setSelectedDate(dateFormat(dateString, "yyyy/mm/dd"));
  }

  async function save() {
    const updatedOrders = applyScheduleMoves(orders, updateOrders);
    await Promise.all(
      updatedOrders.map((order) => updateOrderSchedule(order.orderId, order)),
    );

    setUpdateOrders([]);
    setEditable(false);
    setIsSelected(false);
  }

  async function completeOrder(orderId, userId) {
    await Promise.all([
      saveEatenFavorite({ companyId, orderId, userId }),
      markOrderAttended(orderId),
    ]);
  }

  function eventContent(arg) {
    let stringArray = arg.event.title.split("$");
    let titleArray = stringArray[0].split("\n");
    let name = titleArray[0];
    let tel = titleArray[1];
    let people = stringArray[1];
    let orderId = stringArray[2];
    let userId = stringArray[3];
    let attend = stringArray[4];

    return (
      <div className="flex justify-between border">
        <div className="ml-2 mt-4 text-base font-bold text-black">
          {name}
          <br />
          {tel}
        </div>

        <div className="flex w-[80px] items-center justify-center">
          <div className="flex h-[60px] w-[60px] items-center justify-center rounded bg-[#8ba9ee] text-center">
            <h1> {people}人</h1>
          </div>
        </div>

        <div>
          <div>
            <button
              className={`my-1 mr-4 h-8 rounded	bg-[#082567] px-2 ${
                attend === "no" && "cursor-pointer"
              }`}
              onClick={() => {
                completeOrder(orderId, userId);
              }}
              disabled={attend === "yes"}
            >
              {attend === "no" ? "入席" : "已出席"}
            </button>
          </div>

          <div>
            <button
              className={`absolute h-8 cursor-pointer rounded bg-gray-400 px-2 ${
                attend === "yes" && "hidden"
              } `}
              onClick={() => {
                deleteOrder(orderId);
              }}
              disabled={attend === "yes"}
            >
              取消
            </button>
          </div>
        </div>
      </div>
    );
  }

  const phoneArrangedOrders = [...orders].sort((a, b) => {
    const timeA = new Date(a.date + " " + a.start);
    const timeB = new Date(b.date + " " + b.start);
    return timeA - timeB;
  });

  const phoneSelectedOrders = phoneArrangedOrders.filter((order) => {
    const orderTime = dateFormat(order.date, "yyyy/mm/dd");
    return orderTime === selectedDate;
  });

  if (isLoading) {
    return <IsLoading />;
  }

  return (
    <div className="flex h-full justify-center">
      {tables.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <div>
            <img src={noSchedule} className="h-52" />
            <h1 className="text-center text-xl font-bold text-gray-600">
              請先設定桌位以顯示預約內容
            </h1>
          </div>
        </div>
      ) : (
        <div className="mt-8 w-5/6">
          <div className="flex items-center justify-between phone:flex-col">
            <div>
              <h1 className="font-bold">選擇日期</h1>
              <DatePicker
                className="mb-4 border border-solid border-black"
                onChange={changeStartDate}
              />
            </div>

            <div className="mt-4 h-96 overflow-y-auto tablet:hidden laptop:hidden desktop:hidden">
              {phoneSelectedOrders.map((order) => {
                return (
                  <div
                    key={order.orderId}
                    className="mb-6 h-36 w-[278px] rounded bg-[#e0effc] px-4 py-2 font-bold"
                  >
                    <div className="mb-2 flex w-full justify-between">
                      <p>{order.date}</p>
                      <p>{order.start}</p>
                    </div>

                    <div className="flex gap-2">
                      <p>桌號 | </p>
                      {order.tableNumber.map((item) => {
                        return <p key={item}>{item}</p>;
                      })}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center bg-[#8ba9ee]">
                        <p>{order.people}人</p>
                      </div>

                      <div>
                        <p>{order.userName}</p>
                        <p>{order.phone}</p>
                      </div>

                      <div className="text-white">
                        <div>
                          <button
                            className={`mb-2 h-8 rounded bg-[#082567] px-2 ${
                              order.attend === "no" && "cursor-pointer"
                            }`}
                            onClick={() => {
                              completeOrder(order.orderId, order.userId);
                            }}
                            disabled={order.attend === "yes"}
                          >
                            {order.attend === "no" ? "入席" : "已出席"}
                          </button>
                        </div>

                        <div>
                          <button
                            className={`h-8 cursor-pointer rounded bg-gray-400 px-2 ${
                              order.attend === "yes" && "hidden"
                            } `}
                            onClick={() => {
                              deleteOrder(order.orderId);
                            }}
                            disabled={order.attend === "yes"}
                          >
                            取消
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mr-4 phone:hidden tablet:mr-0">
              <button
                onClick={() => {
                  setEditable(true);
                  setIsSelected(true);
                }}
                className={`${
                  isSelected === true && "bg-gray-300"
                } mr-4 rounded bg-[#ff850e] px-4 font-semibold leading-10 text-white hover:opacity-80`}
              >
                移動
              </button>

              <button
                onClick={save}
                className={`${
                  isSelected === false && "bg-gray-300"
                } rounded bg-[#ff850e] px-4 font-semibold leading-10 text-white hover:opacity-80`}
              >
                保存
              </button>
            </div>
          </div>

          <div className="phone:hidden">
            <ScrollShadow
              size={0}
              hideScrollBar
              orientation="horizontal"
              className="flex h-[calc(100vh-300px)] w-[850px] justify-center tablet:w-full laptop:w-full"
            >
              <FullCalendar
                resourceAreaWidth={110}
                contentHeight={"auto"}
                slotMinWidth={80}
                height={"auto"}
                ref={myRef}
                schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
                plugins={[resourceTimelinePlugin, interactionPlugin]}
                initialView="resourceTimeline"
                editable={editable}
                events={events}
                eventContent={eventContent}
                eventDrop={MyDropEvent}
                resources={resources}
                resourceAreaHeaderContent={"桌位/時間"}
              />
            </ScrollShadow>
          </div>
        </div>
      )}
    </div>
  );
}

export default Schedule;
