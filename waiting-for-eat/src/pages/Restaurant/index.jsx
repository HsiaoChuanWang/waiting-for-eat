import { Button, Card, Image, ScrollShadow, User } from "@nextui-org/react";
import dateFormat from "dateformat";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Alert from "../../components/Alert/index.jsx";
import Comment from "../../components/Comment";
import IsLoading from "../../components/IsLoading/index.jsx";
import NoItem from "../../components/NoItem/index.jsx";
import { getRestaurantPageData } from "../../services/repositories/restaurantRepository.js";
import useUserStore from "../../stores/userStore.js";
import tasty from "../Search/tasty.jpg";
import Like from "./Like";
import Menu from "./Menu";
import noActivity from "./restaurantPictures/noActivity.png";
import noMenu from "./restaurantPictures/noMenu.png";

function Restaurant() {
  const navigation = useNavigate();
  const { companyId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});
  const [menu, setMenu] = useState([]);
  const [post, setPost] = useState([]);
  const [position, setPosition] = useState(0);
  const [display, setDisplay] = useState(false);
  const userId = useUserStore((state) => state.userId);
  useEffect(() => {
    let isActive = true;

    getRestaurantPageData(companyId)
      .then(({ restaurant, menu, posts }) => {
        if (!isActive) return;
        setData(restaurant ?? {});
        setMenu(menu);
        setPost(posts);
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [companyId]);

  const posts =
    post.length > 0 ? (
      post
        .sort((a, b) => (a.createTime > b.createTime ? -1 : 1))
        .map((item) => {
          return (
            <motion.div
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.15 },
              }}
              whileTap={{ scale: 0.9 }}
              key={item.userId}
              className="my-4 cursor-pointer phone:w-full tablet:w-[calc(50%-8px)]"
              onClick={() => {
                navigation(`/post/${item.postId}`);
              }}
            >
              <Card className="scale-95 border border-solid border-gray-400 shadow-xl">
                <div className="flex items-center justify-center p-2">
                  <Image
                    alt="Card background"
                    style={{ width: "100px", height: "100px" }}
                    className="rounded-xl object-cover object-center"
                    src={item.mainPicture}
                  />

                  <div className="mx-2 w-44 py-2 phone:w-64">
                    <div className="flex justify-end">
                      <p className="text-tiny font-bold">
                        {dateFormat(
                          item.createTime.toDate(),
                          "yyyy/mm/dd HH:MM",
                        )}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <User
                        avatarProps={{
                          src: item.picture,
                          className: "border-2 border-solid border-gray-400",
                        }}
                      />
                      <h3 className="font-bold">{item.userName}</h3>
                    </div>

                    <h1 className="line-clamp-2 text-xl font-bold">
                      {item.title}
                    </h1>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })
    ) : (
      <NoItem
        content="暫無相關食記"
        distance="w-[calc(100%-24px)]"
        pictureWidth="w-36"
        textSize="text-lg"
      />
    );

  if (isLoading) {
    return <IsLoading />;
  }

  return (
    <div className=" mb-4 flex justify-center">
      <Alert />
      <div className="m-8 flex w-full max-w-[1400px] justify-between phone:block phone:px-8 tablet:block tablet:px-8">
        <div className="mr-8 w-3/4 phone:w-full tablet:w-full">
          <div className="pb-6">
            <div>
              <img
                src={data.picture !== "" ? data.picture : tasty}
                className="h-96 w-full object-cover object-center"
              />
            </div>

            <div className="flex justify-between">
              <div className="mt-8">
                <h2 className="text-4xl font-black">{data.name}</h2>
                <h4 className="mt-2">
                  {data.city}
                  {data.district}
                  {data.address}
                </h4>
                <h2 className="mt-2">{data.phone}</h2>
              </div>

              <div className={`mt-8 flex ${userId === "" && "hidden"}`}>
                <Like />
              </div>
            </div>
          </div>

          <div className="border-t-2 border-solid border-gray-300 pb-6">
            <h3 className="text-2xl font-bold text-[#ff6e06]">菜單</h3>
            <ScrollShadow orientation="horizontal" className="w-full">
              <div className=" flex w-[1000px] p-4">
                {data.menu ? (
                  data.menu.map((picture, index) => (
                    <div className="w-[200px] min-w-[200px]" key={index}>
                      <motion.img
                        whileHover={{
                          scale: 1.1,
                          transition: { duration: 0.15 },
                        }}
                        whileTap={{ scale: 0.9 }}
                        className="cursor-pointer px-2"
                        src={picture}
                        onClick={() => {
                          setPosition(index);
                          setDisplay(true);
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <div className="flex h-32 items-center">
                    <img src={noMenu} className="h-28" />
                    <h4 className="text-lg font-bold text-gray-600">
                      暫無上傳菜單
                    </h4>
                  </div>
                )}
              </div>
            </ScrollShadow>
          </div>

          <div className={`${display === false && "hidden"}`}>
            <Menu images={menu} position={position} setDisplay={setDisplay} />
          </div>

          <div className="mt-2 border-t-2 border-solid border-gray-300 pb-6">
            <h1 className="text-2xl font-bold text-[#ff6e06]">現熱活動</h1>
            {data.description ? (
              <div
                className="mx-4 mt-4"
                dangerouslySetInnerHTML={{ __html: data.description }}
              ></div>
            ) : (
              <div className="mx-4 mb-2 mt-8 flex h-32 items-center">
                <img src={noActivity} className="h-28" />
                <h1 className="text-lg font-bold text-gray-600">暫無活動</h1>
              </div>
            )}
          </div>

          <div className="mt-2 border-t-2 border-solid border-gray-300 pb-6">
            <h1 className="text-2xl font-bold text-[#ff6e06]">相關評論</h1>
            <h1 className="text-base font-bold text-gray-400">
              點選評論以展開內容
            </h1>

            <Comment />
          </div>
        </div>

        <div className="sticky top-28 mx-2 h-[calc(100vh-148px)] w-1/4 px-2 shadow-[-4px_0_4px_2px_rgba(0,0,0,0.16)] phone:h-[760px] phone:w-full phone:border-t-2 phone:border-solid phone:border-gray-300 phone:px-0 phone:shadow-none tablet:h-[760px] tablet:w-full tablet:border-t-2 tablet:border-solid tablet:border-gray-300 tablet:px-0 tablet:shadow-none">
          <h2 className="mt-4 text-2xl font-bold text-gray-400 phone:mt-0 phone:text-[#ff6e06] tablet:mt-0 tablet:text-[#ff6e06]">
            相關食記
          </h2>
          <ScrollShadow
            hideScrollBar
            className="h-[calc(100vh-196px)] w-full phone:flex phone:h-[680px] phone:flex-wrap tablet:flex tablet:h-[680px] tablet:flex-wrap"
          >
            {posts}
          </ScrollShadow>
        </div>
      </div>

      <div className="fixed bottom-4 w-full max-w-[1400px] phone:flex phone:justify-center tablet:flex tablet:justify-center">
        <div className="h-12 w-[calc(75%-24px)] bg-white phone:w-5/6 tablet:w-5/6">
          <Button
            onClick={() => {
              if (userId === "") {
                toast.error("請登入以進行預約");
              } else {
                navigation(`/reserve/${companyId}`);
              }
            }}
            radius="full"
            className=" h-12 w-full rounded-lg bg-[#ff850e] text-center text-2xl font-black text-white shadow-lg"
          >
            線上預約
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Restaurant;
