import dateFormat from "dateformat";

function createScheduleResources(tables) {
  return tables
    .map((table) => ({
      id: table.number,
      title: `${table.number} (${table.people}人桌)`,
    }))
    .sort((first, second) => (first.id > second.id ? 1 : -1));
}

function createScheduleEvents(orders) {
  return orders.flatMap((order) =>
    order.tableNumber.map((tableNumber) => ({
      color: "#e0effc",
      display: "auto",
      end: new Date(`${order.date} ${order.end}`),
      id: `${order.orderId}$${tableNumber}`,
      resourceId: tableNumber,
      start: new Date(`${order.date} ${order.start}`),
      title: `${order.userName}\n${order.phone}$${order.people}$${order.orderId}$${order.userId}$${order.attend}`,
    })),
  );
}

function recordScheduleMove(currentMoves, orders, event) {
  const [orderId, oldTableNumber] = event.id.split("$");
  const existingMove = currentMoves.find((move) => move.eventId === event.id);
  const movedData = {
    end: dateFormat(event.end, "HH:MM"),
    eventId: event.id,
    newTableNumber: event._def.resourceIds[0],
    orderId,
    start: dateFormat(event.start, "HH:MM"),
  };

  if (existingMove) {
    return currentMoves.map((move) =>
      move.eventId === event.id ? { ...move, ...movedData } : move,
    );
  }

  const order = orders.find((item) => item.orderId === orderId);
  const tableNumberIndex = order?.tableNumber.indexOf(oldTableNumber) ?? -1;
  if (tableNumberIndex === -1) return currentMoves;

  return [...currentMoves, { ...movedData, tableNumberIndex }];
}

function applyScheduleMoves(orders, moves) {
  const updatedOrders = new Map();

  moves.forEach((move) => {
    const source =
      updatedOrders.get(move.orderId) ??
      orders.find((order) => order.orderId === move.orderId);
    if (!source) return;

    const tableNumber = [...source.tableNumber];
    tableNumber[move.tableNumberIndex] = move.newTableNumber;
    updatedOrders.set(move.orderId, {
      ...source,
      end: move.end,
      start: move.start,
      tableNumber,
    });
  });

  return [...updatedOrders.values()];
}

export {
  applyScheduleMoves,
  createScheduleEvents,
  createScheduleResources,
  recordScheduleMove,
};
