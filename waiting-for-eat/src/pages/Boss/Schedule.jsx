import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import { ScrollShadow } from "@nextui-org/react";
import { DatePicker } from "antd";
import dateFormat from "dateformat";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import IsLoading from "../../components/IsLoading/index.jsx";
import { db } from "../../services/firebase/firebaseClient.js";
import { saveEatenFavorite } from "../../services/repositories/favoriteRepository.js";
import noSchedule from "./noSchedule.png";
import "./schedule.css";

function Schedule() {
  const [editable, setEditable] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const myRef = useRef();
  const { companyId } = useParams();
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [updateOrders, setUpdateOrders] = useState([]);
  const [finalUpdateOrders, setFinalUpdateOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const companyRef = collection(db, "company");
  const tableRef = query(collection(companyRef, companyId, "table"));
  const orderRef = query(collection(db, "order"));
  const orderq = query(orderRef, where("companyId", "==", companyId));

  async function setUserInfo(userId) {
    const docRef = doc(db, "user", userId);
    const docSnap = await getDoc(docRef);

    const resultUser = docSnap.data();
    return resultUser;
  }

  useEffect(() => {
    getDocs(tableRef).then((result) => {
      let seats = [];
      result.forEach((doc) => {
        const data = doc.data();
        const dataId = doc.id;
        const combine = { ...data, tableId: dataId };
        seats.push(combine);
      });
      setTables(seats);
    });

    getDocs(orderq)
      .then((result) => {
        let orderList = [];
        result.forEach((doc) => {
          const data = doc.data();
          const dataId = doc.id;
          const combine = { ...data, orderId: dataId };
          orderList.push(combine);
        });
        return orderList;
      })
      .then((orderList) => {
        let combineOrder = [];
        orderList.forEach((order) => {
          setUserInfo(order.userId)
            .then((data) => {
              const newData = {
                ...order,
                userName: data.userName,
                phone: data.phone,
              };
              combineOrder.push(newData);
            })
            .then(() => {
              setOrders([...combineOrder]);
            });
        });
      });

    const tableSnap = onSnapshot(tableRef, (querySnapshot) => {
      let seats = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const dataId = doc.id;
        const combine = { ...data, tableId: dataId };
        seats.push(combine);
      });
      setTables(seats);
      setIsLoading(false);
    });

    const orderSnap = onSnapshot(orderq, (querySnapshot) => {
      let orderList = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const dataId = doc.id;
        const combine = { ...data, orderId: dataId };
        orderList.push(combine);
      });

      Promise.all(
        orderList.map((item) => {
          return Promise.all([setUserInfo(item.userId)]).then(([userInfo]) => {
            const newItem = {
              ...item,
              userName: userInfo.userName,
              phone: userInfo.phone,
            };
            return newItem;
          });
        }),
      ).then((value) => {
        setOrders(value);
      });
    });

    return tableSnap, orderSnap;
  }, []);

  let resources = [];
  tables.map((table) => {
    resources.push({
      id: table.number,
      title: table.number + " (" + table.people + "人桌)",
    });
  });
  resources = resources.sort((firstItem, secondItem) =>
    firstItem.id > secondItem.id ? 1 : -1,
  );

  let events = [];
  orders.map((order) => {
    order.tableNumber.map((orderTableNumber) => {
      events.push({
        title:
          order.userName +
          "\n" +
          order.phone +
          "$" +
          order.people +
          "$" +
          order.orderId +
          "$" +
          order.userId +
          "$" +
          order.attend,
        start: new Date(order.date + " " + order.start),
        end: new Date(order.date + " " + order.end),
        id: order.orderId + "$" + orderTableNumber,
        resourceId: orderTableNumber,
        display: "auto",
        color: "#e0effc",
      });
    });
  });

  async function updateOrder(orderId, tableNumber, startTime, endTime) {
    const OrderRef = doc(db, "order", orderId);
    await updateDoc(OrderRef, {
      tableNumber: tableNumber,
      start: startTime,
      end: endTime,
    });
  }

  async function getOrder(orderId) {
    const docRef = doc(db, "order", orderId);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    const oldTableNumber = data.tableNumber;
  }

  function MyDropEvent(info) {
    const startDay = dateFormat(info.event.start, "yyyy/mm/dd");
    const startTime = dateFormat(info.event.start, "HH:MM");
    const endDay = dateFormat(info.event.end, "yyyy/mm/dd");
    const endTime = dateFormat(info.event.end, "HH:MM");
    const eventID = info.event.id;
    const idSplit = info.event.id.split("$");
    const orderId = idSplit[0];
    const oldTableNumber = idSplit[1];
    const newtableNumber = info.event._def.resourceIds[0];

    let updateOrder = updateOrders.find((p) => p.eventID == eventID);

    if (updateOrder == undefined) {
      let order = orders.find((p) => p.orderId == orderId);
      let orderTableNumber = order.tableNumber;
      const tableNumberIndex = orderTableNumber.indexOf(oldTableNumber);
      if (tableNumberIndex != -1) {
        updateOrder = {
          eventID: eventID,
          start: startTime,
          end: endTime,
          orderId: orderId,
          newtableNumber: newtableNumber,
          tableNumberIndex: tableNumberIndex,
        };
        updateOrders.push(updateOrder);
      }
    } else {
      updateOrder.start = startTime;
      updateOrder.end = endTime;
      updateOrder.newtableNumber = newtableNumber;
    }
  }

  function changeStartDate(date, dateString) {
    if (date != null) myRef.current.getApi().gotoDate(dateString);
    setSelectedDate(dateFormat(dateString, "yyyy/mm/dd"));
  }

  async function updateFirestore(finalUpdateOrders) {
    const orderRef = doc(db, "order", finalUpdateOrders.orderId);

    await updateDoc(orderRef, {
      start: finalUpdateOrders.start,
      end: finalUpdateOrders.end,
      tableNumber: finalUpdateOrders.tableNumber,
    });
  }

  function save(e) {
    setFinalUpdateOrders([]);
    updateOrders.forEach((updateOrder) => {
      let order = orders.find((p) => p.orderId == updateOrder.orderId);
      order.start = updateOrder.start;
      order.end = updateOrder.end;
      let orderTableNumber = order.tableNumber;
      orderTableNumber[updateOrder.tableNumberIndex] =
        updateOrder.newtableNumber;

      let finalUpdateOrder = finalUpdateOrders.find(
        (p) => p.orderId == updateOrder.orderId,
      );
      if (finalUpdateOrder == undefined) {
        finalUpdateOrders.push(order);
      } else {
        finalUpdateOrder = order;
      }
    });

    finalUpdateOrders.forEach((item) => {
      updateFirestore(item);
    });

    setUpdateOrders([]);
    setEditable(false);
    setIsSelected(false);
  }

  async function AddFavorite(orderId, userId) {
    await saveEatenFavorite({ companyId, orderId, userId });
  }

  async function DeleteOrder(orderId) {
    await deleteDoc(doc(db, "order", orderId));
  }

  async function UpdateAttend(orderId) {
    const OrderRef = doc(db, "order", orderId);
    await updateDoc(OrderRef, {
      attend: "yes",
    });
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
                AddFavorite(orderId, userId);
                UpdateAttend(orderId);
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
                DeleteOrder(orderId);
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

  const phoneArrangedOrders = orders.sort((a, b) => {
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
                        return <p>{item}</p>;
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
                              AddFavorite(order.orderId, order.userId);
                              UpdateAttend(order.orderId);
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
                              DeleteOrder(order.orderId);
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
