import {
  Button,
  Card,
  Modal,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react";
import { DatePicker, Form, Input } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Alert from "../../components/Alert/index.jsx";
import {
  formatReservationDate,
  getAvailableOpeningTimes,
  isReservationComplete,
} from "../../features/reservation/reservationModel.js";
import { submitReservation } from "../../features/reservation/reservationService.js";
import useReservationData from "../../features/reservation/useReservationData.js";
import useDinerStore from "../../stores/dinerStore.js";
import useUserStore from "../../stores/userStore.js";
import success from "./success.png";

function Reserve() {
  const setSelectedDinerBar = useDinerStore(
    (state) => state.setSelectedDinerBar,
  );
  const navigate = useNavigate();
  const [isSelected, setIsSelected] = useState("");
  const userId = useUserStore((state) => state.userId);
  const { companyId } = useParams();
  const { company, loadOrders, openingTimes, orders, tables } =
    useReservationData(companyId);
  const [reservation, setReservation] = useState({
    companyId,
    userId,
    date: "",
    start: "",
    end: "",
    people: "",
    attend: "no",
  });
  const [selectedWeekday, setSelectedWeekday] = useState(null);
  const detailInfo = useUserStore((state) => state.detailInfo);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    if (userId !== "") {
      setReservation((current) => ({ ...current, userId }));
    }
  }, [userId]);

  const disabledDate = (current) => {
    return current && current <= dayjs().subtract(1, "day").endOf("day");
  };

  async function handleSend() {
    if (!isReservationComplete(reservation)) {
      toast.error("請填寫完整資訊");
      return;
    }

    const wasCreated = await submitReservation({
      orders,
      reservation,
      tables,
    });
    if (!wasCreated) {
      toast.error("座位不足");
      return;
    }

    onOpen();
    setIsSelected("");
  }

  const availableOpeningTimes = getAvailableOpeningTimes(
    openingTimes,
    selectedWeekday,
    tables,
    orders,
  );

  async function changeDate(dateValue) {
    const date = formatReservationDate(dateValue);
    setSelectedWeekday(dateValue?.day() ?? null);
    setIsSelected("");
    setReservation((current) => ({
      ...current,
      date,
      end: "",
      start: "",
    }));
    await loadOrders(date);
  }

  return (
    <div className="flex justify-center">
      <Alert />
      <div className="flex max-w-[1400px] justify-between phone:w-full phone:flex-col phone:items-center tablet:flex-col laptop:justify-around">
        <div className="mt-44 w-4/12 phone:mt-12 phone:flex phone:w-full phone:flex-col phone:items-center tablet:mt-12 tablet:flex tablet:w-full">
          <img
            src={company.picture}
            className="max-h-[400px] w-full rounded-2xl object-cover object-center phone:w-3/4 tablet:w-80"
          ></img>

          <div className="py-4 pl-6 phone:py-4 phone:pl-0 tablet:py-14">
            <h1 className="text-2xl font-black">{company.name}</h1>
            <h1 className="my-2 font-bold">
              {company.city}
              {company.district}
              {company.address}
            </h1>
            <h1 className="font-bold">{company.phone}</h1>
          </div>
        </div>

        <Card className="my-12 w-7/12 border-2 border-solid border-gray-300 phone:my-4 phone:w-5/6 tablet:w-full">
          <div>
            <div className="flex justify-center">
              <h2 className="p-6 text-center text-3xl font-black">
                填寫訂位資訊
              </h2>
            </div>

            <div className="flex justify-center">
              <div className="mt-2 phone:w-full">
                <div className="mx-6 mb-8 flex text-lg font-semibold phone:text-base">
                  <h1>姓名</h1>
                  <h1 className="mx-6">|</h1>
                  <h1>
                    {detailInfo.userName} {detailInfo.gender}
                  </h1>
                </div>

                <div className="mx-6 mb-8 flex text-lg font-semibold phone:text-base">
                  <h1>手機</h1>
                  <h1 className="mx-6">|</h1>
                  <h1>{detailInfo.phone}</h1>
                </div>

                <div className="mx-6 mb-8 flex items-baseline text-lg font-semibold phone:text-base">
                  <h1>人數</h1>
                  <h1 className="mx-6">|</h1>
                  <Form name="basic" autoComplete="off">
                    <Input
                      name="people"
                      className="h-10 w-20"
                      onChange={(e) =>
                        setReservation((current) => ({
                          ...current,
                          people: e.target.value,
                        }))
                      }
                      value={reservation.people}
                    />
                  </Form>
                  <h1 className="mx-2 text-lg font-semibold phone:text-base">
                    人
                  </h1>
                </div>

                <div className="mx-6 mb-8 flex items-baseline text-lg font-semibold phone:text-base">
                  <h1>日期</h1>
                  <h1 className="mx-6">|</h1>
                  <DatePicker
                    className="h-10 w-44 phone:w-36"
                    disabledDate={disabledDate}
                    onChange={changeDate}
                    placeholder=""
                  />
                </div>

                <div className="mx-6 mb-8 flex text-lg font-semibold phone:text-base">
                  <h1>時間</h1>
                  <h1 className="mx-6">|</h1>
                  <div className="flex w-96 flex-wrap phone:w-40">
                    {availableOpeningTimes.length === 0 ? (
                      <div
                        className={`mb-3 mr-3 h-10 w-36 rounded border border-solid border-gray-400 text-center leading-[40px] text-gray-500`}
                      >
                        <div>尚無可預約時段</div>
                      </div>
                    ) : (
                      availableOpeningTimes.map((time) => (
                        <button
                          type="button"
                          key={time.timeId}
                          className={`mb-3 mr-3 h-10 w-24 cursor-pointer rounded border border-solid border-gray-400 text-center leading-[40px] text-gray-500 ${
                            isSelected === time.timeId && "bg-[#ff850e]"
                          } ${isSelected === time.timeId && "text-white"}`}
                          onClick={() => {
                            setReservation((current) => ({
                              ...current,
                              end: time.end,
                              start: time.start,
                            }));
                            setIsSelected(time.timeId);
                          }}
                        >
                          {time.start}
                        </button>
                      ))
                    )}
                  </div>
                </div>

                <div className="mb-8 flex justify-end">
                  <Button
                    radius="full"
                    className="mr-6 block h-11 rounded-lg bg-[#b0aba5] px-4 text-center text-lg font-black text-white shadow-lg phone:mr-4 phone:text-base"
                    onClick={() => navigate(`/`)}
                  >
                    返回首頁
                  </Button>

                  <>
                    <Button
                      radius="full"
                      className="block h-11 rounded-lg bg-[#ff850e] px-4 text-center text-lg font-black text-white shadow-lg phone:mr-4 phone:text-base tablet:mr-4"
                      onClick={handleSend}
                    >
                      確認訂位
                    </Button>
                    <Modal
                      isOpen={isOpen}
                      onOpenChange={onOpenChange}
                      isDismissable={false}
                      hideCloseButton={true}
                      className="flex"
                    >
                      <ModalContent className="relative h-64 self-center phone:h-80 phone:w-5/6">
                        {(onClose) => (
                          <>
                            <div className="mx-10 my-auto font-bold phone:text-center">
                              <div className="flex items-center justify-center phone:flex-col">
                                <img className="h-auto w-28" src={success} />
                                <div className="px-4">
                                  <p className="mb-2 text-2xl phone:my-2">
                                    預約成功!
                                  </p>
                                  <p>請確認訂位資訊，</p>
                                  <p className="mb-2 phone:mb-10">
                                    若有任何疑問請洽電。
                                  </p>
                                </div>
                              </div>
                            </div>

                            <Button
                              className="absolute bottom-4 right-6 bg-[#ff850e] text-base font-bold"
                              color="primary"
                              onPress={onClose}
                              onClick={() => {
                                setSelectedDinerBar("reserved");
                                navigate(`/diner/reservedShop/${userId}`);
                              }}
                            >
                              前往
                            </Button>
                          </>
                        )}
                      </ModalContent>
                    </Modal>
                  </>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Reserve;
