import { Button, Card } from "@nextui-org/react";
import { Rate } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getReviewById,
  updateReview,
} from "../../services/repositories/reviewRepository.js";
import useStarStore from "../../stores/starStore.js";

function StarEdit() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [star, setStar] = useState(0);
  const [content, setContent] = useState("");
  const starId = useStarStore((state) => state.starId);
  const companyName = useStarStore((state) => state.companyName);
  const companyId = useStarStore((state) => state.companyId);
  useEffect(() => {
    if (starId) {
      getReviewById(starId).then((data) => {
        setStar(data.star);
        setContent(data.content);
      });
    }
  }, [starId]);

  const handleUpdate = () => updateReview(starId, companyId, { content, star });

  return (
    <div className="mt-12 flex h-full w-full justify-center">
      <Card className="flex h-[450px] w-1/2 justify-center border-2 border-solid border-gray-300 shadow-2xl phone:w-[90%] tablet:w-2/3">
        <div className="h-full p-12">
          <h1 className="mb-4 text-xl font-bold phone:mb-2 phone:text-lg">
            {companyName}
          </h1>
          <Rate
            className="mb-4 block text-4xl phone:mb-2 phone:text-2xl"
            onChange={(e) => {
              setStar(e);
            }}
            value={star}
          />

          <textarea
            className="h-44 w-full rounded-lg border-2 border-solid border-gray-200 p-4"
            size="lg"
            onChange={(e) => {
              setContent(e.target.value);
            }}
            value={content}
          />

          <div>
            <Button
              className="absolute bottom-12 right-8 mt-6 block h-10 rounded-lg bg-[#ff850e] px-4 text-center text-lg font-black text-white shadow-lg"
              onClick={() => {
                navigate(`/diner/commented/${userId}`);
                handleUpdate();
              }}
            >
              送出
            </Button>
            <Button
              className="absolute bottom-12 right-32 mt-6 block h-10 rounded-lg bg-[#b0aba5] px-4 text-center text-lg font-black text-white shadow-lg"
              onClick={() => {
                setStar("");
                setContent("");
                navigate(`/diner/commented/${userId}`);
              }}
            >
              取消
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default StarEdit;
