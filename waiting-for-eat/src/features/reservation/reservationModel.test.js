import { describe, expect, it, vi } from "vitest";
import {
  allocateTables,
  formatReservationDate,
  getAvailableOpeningTimes,
  isReservationComplete,
} from "./reservationModel.js";

const tables = [
  { number: "A1", people: 2 },
  { number: "A2", people: 4 },
  { number: "A3", people: 6 },
];

describe("reservationModel", () => {
  describe("getAvailableOpeningTimes", () => {
    it("keeps matching weekdays with available tables and sorts by time", () => {
      const openingTimes = [
        { day: "星期一", start: "18:00" },
        { day: "星期二", start: "12:00" },
        { day: "星期一", start: "12:00" },
      ];
      const orders = [{ start: "18:00", tableNumber: ["A1", "A2", "A3"] }];

      expect(getAvailableOpeningTimes(openingTimes, 1, tables, orders)).toEqual(
        [{ day: "星期一", start: "12:00" }],
      );
    });
  });

  describe("allocateTables", () => {
    it("excludes tables reserved for the selected time", () => {
      const orders = [{ start: "12:00", tableNumber: ["A2"] }];

      expect(
        allocateTables(tables, orders, { people: 4, start: "12:00" }),
      ).toEqual(["A3"]);
    });

    it("prefers the smallest single table that fits the party", () => {
      expect(
        allocateTables(tables, [], { people: "3", start: "12:00" }),
      ).toEqual(["A2"]);
    });

    it("combines available tables when no single table is large enough", () => {
      expect(
        allocateTables(tables, [], { people: 10, start: "12:00" }),
      ).toEqual(["A3", "A2"]);
    });

    it("returns null when capacity is insufficient or party size is invalid", () => {
      expect(
        allocateTables(tables, [], { people: 20, start: "12:00" }),
      ).toBeNull();
      expect(
        allocateTables(tables, [], { people: 0, start: "12:00" }),
      ).toBeNull();
    });
  });

  describe("reservation values", () => {
    it("formats the selected date", () => {
      const date = {
        date: vi.fn(() => 9),
        month: vi.fn(() => 6),
        year: vi.fn(() => 2026),
      };

      expect(formatReservationDate(date)).toBe("2026/7/9");
      expect(formatReservationDate(null)).toBeNull();
    });

    it("recognizes complete and incomplete reservations", () => {
      expect(
        isReservationComplete({ date: "2026/7/9", people: 2, start: "12:00" }),
      ).toBe(true);
      expect(
        isReservationComplete({ date: "", people: 2, start: "12:00" }),
      ).toBe(false);
      expect(isReservationComplete({ date: "2026/7/9", people: null })).toBe(
        false,
      );
    });
  });
});
