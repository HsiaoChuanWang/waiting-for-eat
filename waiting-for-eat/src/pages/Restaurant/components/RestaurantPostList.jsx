/* eslint-disable react/prop-types */
import { Card, Image, ScrollShadow, User } from "@nextui-org/react";
import dateFormat from "dateformat";
import { motion } from "framer-motion";
import NoItem from "../../../components/NoItem/index.jsx";

function RestaurantPostList({ onPostSelect, posts }) {
  const postItems =
    posts.length > 0 ? (
      [...posts]
        .sort((a, b) => (a.createTime > b.createTime ? -1 : 1))
        .map((post) => (
          <motion.div
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.15 },
            }}
            whileTap={{ scale: 0.9 }}
            key={post.postId}
            className="my-4 cursor-pointer phone:w-full tablet:w-[calc(50%-8px)]"
            onClick={() => onPostSelect(post.postId)}
          >
            <Card className="scale-95 border border-solid border-gray-400 shadow-xl">
              <div className="flex items-center justify-center p-2">
                <Image
                  alt="Card background"
                  style={{ width: "100px", height: "100px" }}
                  className="rounded-xl object-cover object-center"
                  src={post.mainPicture}
                />

                <div className="mx-2 w-44 py-2 phone:w-64">
                  <div className="flex justify-end">
                    <p className="text-tiny font-bold">
                      {dateFormat(post.createTime.toDate(), "yyyy/mm/dd HH:MM")}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <User
                      avatarProps={{
                        src: post.picture,
                        className: "border-2 border-solid border-gray-400",
                      }}
                    />
                    <h3 className="font-bold">{post.userName}</h3>
                  </div>

                  <h1 className="line-clamp-2 text-xl font-bold">
                    {post.title}
                  </h1>
                </div>
              </div>
            </Card>
          </motion.div>
        ))
    ) : (
      <NoItem
        content="暫無相關食記"
        distance="w-[calc(100%-24px)]"
        pictureWidth="w-36"
        textSize="text-lg"
      />
    );

  return (
    <div className="sticky top-28 mx-2 h-[calc(100vh-148px)] w-1/4 px-2 shadow-[-4px_0_4px_2px_rgba(0,0,0,0.16)] phone:h-[760px] phone:w-full phone:border-t-2 phone:border-solid phone:border-gray-300 phone:px-0 phone:shadow-none tablet:h-[760px] tablet:w-full tablet:border-t-2 tablet:border-solid tablet:border-gray-300 tablet:px-0 tablet:shadow-none">
      <h2 className="mt-4 text-2xl font-bold text-gray-400 phone:mt-0 phone:text-[#ff6e06] tablet:mt-0 tablet:text-[#ff6e06]">
        相關食記
      </h2>
      <ScrollShadow
        hideScrollBar
        className="h-[calc(100vh-196px)] w-full phone:flex phone:h-[680px] phone:flex-wrap tablet:flex tablet:h-[680px] tablet:flex-wrap"
      >
        {postItems}
      </ScrollShadow>
    </div>
  );
}

export default RestaurantPostList;
