import { Button, Card, Image, ScrollShadow, User } from "@nextui-org/react";
import dateFormat from "dateformat";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdFastfood } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import Alert from "../../components/Alert/index.jsx";
import NoItem from "../../components/NoItem/index.jsx";
import { getCompanyById } from "../../services/repositories/companyRepository.js";
import {
  getPostById,
  getPostsByCompanyId,
} from "../../services/repositories/postRepository.js";
import { getUserById } from "../../services/repositories/userRepository.js";
import useUserStore from "../../stores/userStore.js";

function Post() {
  const navigation = useNavigate();
  const { postId } = useParams();
  const [companyData, setCompanyData] = useState({});
  const [post, setPost] = useState({});
  const [postList, setPostList] = useState([]);
  const [mainPoster, setMainPoster] = useState({});
  const [mainTime, setMainTime] = useState("");
  const [isShowPosts, setIsShowPosts] = useState(true);
  const userId = useUserStore((state) => state.userId);

  useEffect(() => {
    let isActive = true;

    getPostById(postId).then(async (postData) => {
      if (!postData) return;

      const [company, companyPosts, author] = await Promise.all([
        getCompanyById(postData.companyId),
        getPostsByCompanyId(postData.companyId),
        getUserById(postData.userId),
      ]);
      const relatedPosts = await Promise.all(
        companyPosts
          .filter((item) => item.postId !== postId)
          .map(async (item) => {
            const itemAuthor = await getUserById(item.userId);
            return {
              ...item,
              picture: itemAuthor?.picture ?? "",
              userName: itemAuthor?.userName ?? "",
            };
          }),
      );

      if (!isActive) return;
      setPost(postData);
      setCompanyData({ ...company, companyId: postData.companyId });
      setPostList(relatedPosts);
      setMainPoster({
        ...postData,
        picture: author?.picture ?? "",
        userName: author?.userName ?? "",
      });
      setMainTime(dateFormat(postData.createTime.toDate(), "yyyy/mm/dd HH:MM"));
    });

    return () => {
      isActive = false;
    };
  }, [postId]);

  const posts = postList
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
          className="my-4 cursor-pointer"
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

              <div className="mx-2 w-44 py-2">
                <div className="flex justify-end">
                  <p className="text-tiny font-bold">
                    {dateFormat(item.createTime.toDate(), "yyyy/mm/dd HH:MM")}
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

                <h1 className="line-clamp-2 text-xl font-bold">{item.title}</h1>
              </div>
            </div>
          </Card>
        </motion.div>
      );
    });

  const handleShowPosts = () => {
    setIsShowPosts(!isShowPosts);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1023) {
        setIsShowPosts(true);
      }

      if (window.innerWidth <= 1023) {
        setIsShowPosts(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex justify-center">
      <Alert />
      <div className="m-8 flex w-full max-w-[1400px] justify-between">
        <div className="w-3/4 pr-10 phone:w-full phone:p-4 tablet:w-full tablet:p-4">
          <h2 className="text-5xl font-black text-[#134f6c] phone:text-4xl">
            {post.title}
          </h2>

          <div className="my-4 flex items-center">
            <div className="mr-4 rounded border-2 border-solid border-lime-400  bg-lime-200 px-1 text-lg font-bold phone:text-base">
              {mainPoster.userName}
            </div>
            <p className="text-base font-bold phone:text-sm">{mainTime}</p>
          </div>

          <img
            src={mainPoster.mainPicture}
            alt={post.title ?? "文章主圖"}
            className="h-[500px] w-full object-cover object-center"
          />

          <div
            className="mt-4"
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>

          <Card className=" mt-8 w-[78%] bg-gradient-to-tr from-gray-300 to-stone-200 p-4 shadow-lg phone:w-full tablet:w-full laptop:w-full">
            <div className="flex justify-between phone:flex-col phone:items-center">
              <div className="flex phone:flex-col">
                <img
                  onClick={() => {
                    navigation(`/restaurant/${companyData.companyId}`);
                  }}
                  className="h-full w-[250px] cursor-pointer rounded-2xl object-cover object-center"
                  src={companyData.picture}
                  alt={`${companyData.name ?? "餐廳"}店面`}
                />

                <div className="py-4 pl-6 phone:pl-2">
                  <h1 className="text-2xl font-black ">{companyData.name}</h1>
                  <h1 className="my-2 font-bold">
                    {companyData.city}
                    {companyData.district}
                    {companyData.address}
                  </h1>
                  <h1 className="font-bold">{companyData.phone}</h1>
                </div>
              </div>

              <div className="mr-8 phone:mr-0 phone:flex phone:w-64 phone:justify-between laptop:mr-2">
                <Button
                  radius="full"
                  className="my-6 block h-11 rounded-lg bg-[#ff850e] px-4 text-center text-lg font-black text-white shadow-lg phone:my-0"
                  onClick={() => {
                    if (userId === "") {
                      toast.error("請登入以進行預約");
                    } else {
                      navigation(`/reserve/${companyData.companyId}`);
                    }
                  }}
                >
                  前往訂位
                </Button>
                <Button
                  radius="full"
                  className="block h-11 rounded-lg bg-[#b0aba5] px-4 text-center text-lg font-black text-white shadow-lg"
                  onClick={() => navigation(`/`)}
                >
                  返回首頁
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div
          className={`${
            isShowPosts === false
              ? "fixed right-2 top-24"
              : "fixed right-[304px] top-24"
          } flex w-7 flex-col items-center bg-gray-500 py-2 text-white laptop:hidden desktop:hidden`}
          onClick={handleShowPosts}
        >
          <MdFastfood />
          <h3 className={`${isShowPosts === true && "hidden"} text-center`}>
            查看相關食記
          </h3>
          <h3 className={`${isShowPosts === false && "hidden"} text-center`}>
            隱藏食記
          </h3>
        </div>

        <motion.div
          animate={{ x: isShowPosts === true ? 0 : 1000 }}
          className={`${
            isShowPosts === false && "hidden"
          } sticky top-28 mx-2 h-[calc(100vh-148px)] w-1/4 bg-white px-2 shadow-[-4px_0_4px_2px_rgba(0,0,0,0.16)]  phone:fixed phone:right-2 phone:top-24 phone:w-72 tablet:fixed tablet:right-2 tablet:top-24 tablet:w-72`}
        >
          <h2 className="mt-2 text-2xl font-bold text-gray-500">相關食記</h2>
          <ScrollShadow hideScrollBar className="h-[calc(100vh-196px)] w-full">
            {posts[0] === undefined ? (
              <NoItem
                content="暫無相關食記"
                distance="w-[calc(100%-24px)]"
                pictureWidth="w-36"
                textSize="text-lg"
              />
            ) : (
              posts
            )}
          </ScrollShadow>
        </motion.div>
      </div>
    </div>
  );
}

export default Post;
