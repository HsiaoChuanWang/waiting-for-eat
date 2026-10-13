import { Card, ScrollShadow, User } from "@nextui-org/react";
import { Rate } from "antd";
import dateFormat from "dateformat";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getReviewsByCompanyId } from "../../services/repositories/reviewRepository.js";
import { getUserById } from "../../services/repositories/userRepository.js";
import noComment from "./noComment.png";

function Comment() {
  const { companyId } = useParams();
  const [comment, setComment] = useState([]);
  const [show, setShow] = useState(false);
  useEffect(() => {
    let isActive = true;

    getReviewsByCompanyId(companyId).then(async (reviews) => {
      const comments = await Promise.all(
        reviews.map(async (review) => {
          const user = await getUserById(review.userId);
          return {
            ...review,
            picture: user?.picture ?? "",
            userName: user?.userName ?? "",
          };
        }),
      );

      if (isActive) {
        setComment(comments);
      }
    });

    return () => {
      isActive = false;
    };
  }, [companyId]);

  const comments = comment
    .sort((a, b) => (a.createTime > b.createTime ? -1 : 1))
    .map((item) => {
      return (
        <motion.div
          key={item.starId}
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.15 },
          }}
          whileTap={{ scale: 0.9 }}
          className="cursor-pointer p-4 phone:w-full tablet:w-1/2"
          onClick={() => {
            if (show === false) {
              setShow(true);
            } else {
              setShow(false);
            }
          }}
        >
          <Card className="min-h-[190px] w-72 p-4 phone:w-full tablet:w-full">
            <div className="flex justify-between">
              <div className="flex items-center">
                <User
                  avatarProps={{
                    src: item.picture,
                    className:
                      "border-2 border-solid border-gray-400 border-opacity-100",
                  }}
                />
                <h3 className="font-bold">{item.userName}</h3>
              </div>

              <p className="text-tiny font-bold">
                {dateFormat(item.createTime.toDate(), "yyyy/mm/dd HH:MM")}
              </p>
            </div>

            <Rate
              disabled
              allowHalf
              defaultValue={item.star}
              className="my-2"
            />

            <h2 className={`${show === false && "line-clamp-4"} text-base`}>
              {item.content}
            </h2>
          </Card>
        </motion.div>
      );
    });

  return (
    <div className="flex w-full">
      {comment.length > 0 ? (
        <ScrollShadow hideScrollBar className="h-[720px] w-full">
          <div className="flex flex-wrap">{comments}</div>
        </ScrollShadow>
      ) : (
        <div className="flex h-52 items-center self-start">
          <img src={noComment} className="h-32" />
          <h1 className="text-lg font-bold text-gray-600">暫無相關評論</h1>
        </div>
      )}
    </div>
  );
}

export default Comment;
