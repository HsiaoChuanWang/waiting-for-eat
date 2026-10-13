import { createOrder } from "../../services/repositories/orderRepository.js";
import { allocateTables } from "./reservationModel.js";

async function submitReservation({ orders, reservation, tables }) {
  const tableNumbers = allocateTables(tables, orders, reservation);
  if (!tableNumbers) return false;

  await createOrder({ ...reservation, tableNumber: tableNumbers });
  return true;
}

export { submitReservation };
