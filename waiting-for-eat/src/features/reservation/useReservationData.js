import { useEffect, useState } from "react";
import { subscribeCompanyById } from "../../services/repositories/companyRepository.js";
import { subscribeOpeningTimes } from "../../services/repositories/openingTimeRepository.js";
import { getOrdersByCompanyAndDate } from "../../services/repositories/orderRepository.js";
import { subscribeTables } from "../../services/repositories/tableRepository.js";

function useReservationData(companyId) {
  const [company, setCompany] = useState({});
  const [openingTimes, setOpeningTimes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);

  useEffect(() => {
    const unsubscribeCompany = subscribeCompanyById(companyId, (data) =>
      setCompany(data ?? {}),
    );
    const unsubscribeOpeningTimes = subscribeOpeningTimes(
      companyId,
      setOpeningTimes,
    );
    const unsubscribeTables = subscribeTables(companyId, setTables);

    return () => {
      unsubscribeCompany();
      unsubscribeOpeningTimes();
      unsubscribeTables();
    };
  }, [companyId]);

  async function loadOrders(date) {
    if (!date) {
      setOrders([]);
      return;
    }

    setOrders(await getOrdersByCompanyAndDate(companyId, date));
  }

  return { company, loadOrders, openingTimes, orders, tables };
}

export default useReservationData;
