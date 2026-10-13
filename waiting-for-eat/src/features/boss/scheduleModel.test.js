import { describe, expect, it } from "vitest";
import {
  applyScheduleMoves,
  createScheduleEvents,
  createScheduleResources,
  recordScheduleMove,
} from "./scheduleModel.js";

describe("店家排程模型", () => {
  it("converts and sorts tables as calendar resources", () => {
    expect(
      createScheduleResources([
        { number: "B2", people: 4 },
        { number: "A1", people: 2 },
      ]),
    ).toEqual([
      { id: "A1", title: "A1 (2人桌)" },
      { id: "B2", title: "B2 (4人桌)" },
    ]);
  });

  it("creates one calendar event for every assigned table", () => {
    const events = createScheduleEvents([
      {
        attend: false,
        date: "2026/10/13",
        end: "19:00",
        orderId: "order-1",
        people: 4,
        phone: "0912345678",
        start: "18:00",
        tableNumber: ["A1", "A2"],
        userId: "user-1",
        userName: "王小明",
      },
    ]);

    expect(events).toHaveLength(2);
    expect(events.map(({ id, resourceId }) => ({ id, resourceId }))).toEqual([
      { id: "order-1$A1", resourceId: "A1" },
      { id: "order-1$A2", resourceId: "A2" },
    ]);
    expect(events[0].start).toBeInstanceOf(Date);
    expect(events[0].end).toBeInstanceOf(Date);
  });

  describe("記錄排程移動", () => {
    const orders = [{ orderId: "order-1", tableNumber: ["A1", "A2"] }];
    const event = {
      _def: { resourceIds: ["B1"] },
      end: new Date(2026, 9, 13, 19, 30),
      id: "order-1$A2",
      start: new Date(2026, 9, 13, 18, 30),
    };

    it("records the original table index on the first move", () => {
      expect(recordScheduleMove([], orders, event)).toEqual([
        {
          end: "19:30",
          eventId: "order-1$A2",
          newTableNumber: "B1",
          orderId: "order-1",
          start: "18:30",
          tableNumberIndex: 1,
        },
      ]);
    });

    it("updates an existing move instead of adding a duplicate", () => {
      const existingMoves = [
        {
          end: "19:00",
          eventId: "order-1$A2",
          newTableNumber: "B1",
          orderId: "order-1",
          start: "18:00",
          tableNumberIndex: 1,
        },
      ];
      const movedAgain = {
        ...event,
        _def: { resourceIds: ["C1"] },
      };

      const result = recordScheduleMove(existingMoves, orders, movedAgain);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        eventId: "order-1$A2",
        newTableNumber: "C1",
        tableNumberIndex: 1,
      });
    });
  });

  it("applies moves without mutating the source orders", () => {
    const orders = [
      {
        end: "19:00",
        orderId: "order-1",
        start: "18:00",
        tableNumber: ["A1", "A2"],
      },
    ];
    const moves = [
      {
        end: "20:00",
        newTableNumber: "B1",
        orderId: "order-1",
        start: "19:00",
        tableNumberIndex: 1,
      },
    ];

    expect(applyScheduleMoves(orders, moves)).toEqual([
      {
        end: "20:00",
        orderId: "order-1",
        start: "19:00",
        tableNumber: ["A1", "B1"],
      },
    ]);
    expect(orders[0].tableNumber).toEqual(["A1", "A2"]);
  });
});
