import { useEffect, useState } from "react";
import { subscribeOrdersByCompanyId } from "../../services/repositories/orderRepository.js";
import { subscribeTables } from "../../services/repositories/tableRepository.js";
import { getUserById } from "../../services/repositories/userRepository.js";

function useScheduleData(companyId) {
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [areTablesLoading, setAreTablesLoading] = useState(true);
  const [areOrdersLoading, setAreOrdersLoading] = useState(true);

  useEffect(() => {
    let isActive = true;
    setAreTablesLoading(true);
    setAreOrdersLoading(true);

    const unsubscribeTables = subscribeTables(companyId, (items) => {
      if (!isActive) return;
      setTables(items);
      setAreTablesLoading(false);
    });
    const unsubscribeOrders = subscribeOrdersByCompanyId(
      companyId,
      async (items) => {
        const enrichedOrders = await Promise.all(
          items.map(async (order) => {
            const user = await getUserById(order.userId);
            return {
              ...order,
              phone: user?.phone ?? "",
              userName: user?.userName ?? "",
            };
          }),
        );

        if (!isActive) return;
        setOrders(enrichedOrders);
        setAreOrdersLoading(false);
      },
    );

    return () => {
      isActive = false;
      unsubscribeTables();
      unsubscribeOrders();
    };
  }, [companyId]);

  return {
    isLoading: areTablesLoading || areOrdersLoading,
    orders,
    tables,
  };
}

export default useScheduleData;
