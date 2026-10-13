import { BsPersonFill } from "react-icons/bs";
import { FaRegCalendarCheck } from "react-icons/fa6";
import { GiMeal } from "react-icons/gi";
import { IoTime } from "react-icons/io5";
import { MdNotificationsActive, MdPhotoLibrary } from "react-icons/md";
import { useParams } from "react-router-dom";
import DashboardSidebar from "../../../components/DashboardSidebar/index.jsx";

const items = [
  {
    activeRoutes: ["bossInfo", "bossInfoEdit"],
    icon: BsPersonFill,
    label: "業者資訊",
    path: "/boss/bossInfo",
  },
  {
    activeRoutes: ["photo", "photoUpload"],
    icon: MdPhotoLibrary,
    label: "編輯照片",
    path: "/boss/photo",
  },
  {
    activeRoutes: ["activity", "activityEdit"],
    icon: MdNotificationsActive,
    label: "編輯活動",
    path: "/boss/activity",
  },
  {
    activeRoutes: ["openTime"],
    icon: IoTime,
    label: "用餐時間設定",
    path: "/boss/openTime",
  },
  {
    activeRoutes: ["table"],
    icon: GiMeal,
    label: "桌位設定",
    path: "/boss/table",
  },
  {
    activeRoutes: ["schedule"],
    icon: FaRegCalendarCheck,
    label: "預約現況",
    path: "/boss/schedule",
  },
];

function BossSidebar() {
  const { companyId } = useParams();

  return (
    <DashboardSidebar
      items={items}
      ownerId={companyId}
      itemHeightClass="h-[calc((100vh-176px)/6)]"
      mobileWidthClass={{
        active: "phone:w-[calc(100%/6*2)]",
        idle: "phone:w-[calc(100%/6)]",
      }}
    />
  );
}

export default BossSidebar;
