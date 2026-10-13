import { BiSolidCommentDetail } from "react-icons/bi";
import { BsPersonFill } from "react-icons/bs";
import { CgNotes } from "react-icons/cg";
import { FaCalendarCheck } from "react-icons/fa";
import { HiThumbDown, HiThumbUp } from "react-icons/hi";
import { PiForkKnifeFill } from "react-icons/pi";
import { useParams } from "react-router-dom";
import DashboardSidebar from "../../components/DashboardSidebar/index.jsx";

const items = [
  {
    activeRoutes: ["dinerInfo", "dinerInfoEdit"],
    icon: BsPersonFill,
    label: "食客資訊",
    path: "/diner/dinerInfo",
  },
  {
    activeRoutes: ["reservedShop"],
    icon: FaCalendarCheck,
    label: "已預約餐廳",
    path: "/diner/reservedShop",
  },
  {
    activeRoutes: ["eatenShop", "addStar"],
    icon: PiForkKnifeFill,
    label: "吃過的餐廳",
    path: "/diner/eatenShop",
  },
  {
    activeRoutes: ["likeShop"],
    icon: HiThumbUp,
    label: "狠讚的餐廳",
    path: "/diner/likeShop",
  },
  {
    activeRoutes: ["dislikeShop"],
    icon: HiThumbDown,
    label: "黑名單餐廳",
    path: "/diner/dislikeShop",
  },
  {
    activeRoutes: ["posted"],
    icon: CgNotes,
    label: "我的食記",
    path: "/diner/posted",
  },
  {
    activeRoutes: ["commented", "starEdit"],
    icon: BiSolidCommentDetail,
    label: "我的評論",
    path: "/diner/commented",
  },
];

function DinerSidebar() {
  const { userId } = useParams();

  return (
    <DashboardSidebar
      items={items}
      ownerId={userId}
      itemHeightClass="h-[calc((100vh-176px)/7)]"
      mobileWidthClass={{
        active: "phone:w-[calc(100%/8*2)]",
        idle: "phone:w-[calc(100%/8)]",
      }}
    />
  );
}

export default DinerSidebar;
