import { PushpinOutlined } from "@ant-design/icons";
import { Button, Card, ScrollShadow } from "@nextui-org/react";
import { Form, Input, Menu } from "antd";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
} from "firebase/firestore";
import { default as React, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrashCan } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import Alert from "../../components/Alert/index.jsx";
import IsLoading from "../../components/IsLoading/index.jsx";
import { db } from "../../services/firebase/firebaseClient.js";
import noTable from "./noTable.png";

const rootSubmenuKeys = [];

function Table() {
  const { companyId } = useParams();
  const [openKeys, setOpenKeys] = useState(["sub1"]);
  const [tables, setTables] = useState([]);
  const [addTable, setAddTable] = useState({ number: "", people: "" });
  const [isLoading, setIsLoading] = useState(true);
  const companyRef = collection(db, "company");
  const tableRef = query(collection(companyRef, companyId, "table"));

  useEffect(() => {
    onSnapshot(tableRef, (querySnapshot) => {
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
  }, []);

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  let tableList = tables.sort((firstItem, secondItem) =>
    firstItem.number > secondItem.number ? 1 : -1,
  );

  let items = [];
  tableList.map((tableInfo) => {
    const peopleItem = items.find((item) => {
      return item.label == tableInfo.people + "人桌";
    });

    if (peopleItem != undefined) {
      const children = {
        icon: tableInfo.number,
        key: tableInfo.number,
        label: (
          <FaTrashCan
            className="ml-36 phone:ml-20"
            onClick={() => {
              handleDelete(tableInfo.tableId);
            }}
          />
        ),
      };
      peopleItem.children.push(children);
    } else {
      const newItem = {
        label: tableInfo.people + "人桌",
        key: "sub" + tableInfo.people,
        icon: <PushpinOutlined />,
        children: [
          {
            icon: tableInfo.number,
            key: tableInfo.number,
            label: (
              <FaTrashCan
                className="ml-36 phone:ml-20"
                onClick={() => {
                  handleDelete(tableInfo.tableId);
                }}
              />
            ),
          },
        ],
      };
      items.push(newItem);
      rootSubmenuKeys.push("sub" + tableInfo.people);
    }
  });

  items = items.sort((firstItem, secondItem) =>
    firstItem.label > secondItem.label ? 1 : -1,
  );

  async function handleDelete(tableId) {
    await deleteDoc(doc(tableRef, tableId));
  }

  async function handleAddTable() {
    if (!Object.values(addTable).includes("")) {
      await addDoc(tableRef, addTable);
      setAddTable({ number: "", people: "" });
    } else {
      toast.error("請填寫完整資訊");
    }
  }

  if (isLoading) {
    return <IsLoading />;
  }

  return (
    <>
      <div className="my-12 flex justify-center phone:my-4">
        <Alert />
        <div className="flex w-full justify-center phone:flex-col phone:items-center">
          <Card className="ml-12 h-64 w-1/3 border-2 border-solid border-gray-400 shadow-[-4px_4px_4px_2px_rgba(0,0,0,0.2)] phone:mb-4 phone:ml-0 phone:h-64 phone:w-5/6 tablet:h-80">
            <div className="relative">
              <div className="flex h-16 items-center justify-center bg-[#292D4F]">
                <h1 className="text-2xl font-black text-white">新增桌位</h1>
              </div>

              <Form name="basic" autoComplete="off">
                <div className="mx-6 my-6 flex items-center tablet:flex-col">
                  <h1 className="mr-6 w-16 text-base font-bold [text-align-last:justify] tablet:mr-0">
                    桌號
                  </h1>
                  <Input
                    className="w-24"
                    name="number"
                    onChange={(e) =>
                      setAddTable({ ...addTable, number: e.target.value })
                    }
                    value={addTable.number}
                  />
                </div>

                <div className="mx-6 my-6 flex items-center  tablet:flex-col">
                  <h1 className="mr-6 w-16 text-base font-bold [text-align-last:justify] tablet:mr-0">
                    人數
                  </h1>
                  <Input
                    className="w-24"
                    type="text"
                    name="people"
                    onChange={(e) =>
                      setAddTable({ ...addTable, people: e.target.value })
                    }
                    value={addTable.people}
                  />
                </div>
              </Form>
            </div>

            <Button
              className="absolute bottom-6 right-6 mt-6 block h-10 rounded-lg bg-[#ff850e] px-4 text-center text-lg font-black text-white shadow-lg tablet:static tablet:mt-1 tablet:self-center"
              onClick={handleAddTable}
              type="primary"
              htmlType="button"
            >
              新增
            </Button>
          </Card>

          <Card className="mx-10 h-[calc(100vh-280px)] w-[400px] border-2 border-solid border-gray-400 pb-6 shadow-[-4px_4px_4px_2px_rgba(0,0,0,0.2)] phone:h-64 phone:w-5/6">
            <div className="flex h-16 items-center justify-center bg-[#292D4F]">
              <h1 className="border-gray-100 text-2xl font-black text-white">
                桌位列表
              </h1>
            </div>

            <ScrollShadow
              size={0}
              hideScrollBar
              className="mt-6 h-[100vh-400px] w-full justify-center phone:h-36"
            >
              <div className="flex justify-center">
                {items.length === 0 ? (
                  <div className="mt-4">
                    <img src={noTable} className="h-36" />
                    <h1 className="text-center text-lg font-bold text-gray-600">
                      尚未設定桌位
                    </h1>
                  </div>
                ) : (
                  <Menu
                    className="w-64 border-none text-base font-black phone:w-48"
                    mode="inline"
                    openKeys={openKeys}
                    onOpenChange={onOpenChange}
                    items={items}
                  />
                )}
              </div>
            </ScrollShadow>
          </Card>
        </div>
      </div>
    </>
  );
}

export default Table;
