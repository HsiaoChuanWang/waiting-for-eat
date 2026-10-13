const WEEKDAY_INDEX = Object.freeze({
  星期日: 0,
  星期一: 1,
  星期二: 2,
  星期三: 3,
  星期四: 4,
  星期五: 5,
  星期六: 6,
});

function getReservedTableNumbers(orders, start) {
  return new Set(
    orders
      .filter((order) => order.start === start)
      .flatMap((order) => order.tableNumber ?? []),
  );
}

function getAvailableTables(tables, orders, start) {
  const reservedTableNumbers = getReservedTableNumbers(orders, start);
  return tables.filter((table) => !reservedTableNumbers.has(table.number));
}

function getAvailableOpeningTimes(openingTimes, weekday, tables, orders) {
  return [...openingTimes]
    .sort((first, second) => first.start.localeCompare(second.start))
    .filter(
      (openingTime) =>
        WEEKDAY_INDEX[openingTime.day] === weekday &&
        getAvailableTables(tables, orders, openingTime.start).length > 0,
    );
}

function allocateTables(tables, orders, { people, start }) {
  const partySize = Number.parseInt(people, 10);
  if (!Number.isFinite(partySize) || partySize < 1) return null;

  const availableTables = getAvailableTables(tables, orders, start).sort(
    (first, second) => Number(first.people) - Number(second.people),
  );
  const singleTable = availableTables.find(
    (table) => Number(table.people) >= partySize,
  );
  if (singleTable) return [singleTable.number];

  const selectedTables = [];
  let capacity = 0;
  [...availableTables]
    .sort((first, second) => Number(second.people) - Number(first.people))
    .some((table) => {
      selectedTables.push(table.number);
      capacity += Number(table.people);
      return capacity >= partySize;
    });

  return capacity >= partySize ? selectedTables : null;
}

function formatReservationDate(date) {
  if (!date) return null;
  return `${date.year()}/${date.month() + 1}/${date.date()}`;
}

function isReservationComplete(reservation) {
  return Object.values(reservation).every(
    (value) => value !== "" && value !== null && value !== undefined,
  );
}

export {
  allocateTables,
  formatReservationDate,
  getAvailableOpeningTimes,
  isReservationComplete,
};
