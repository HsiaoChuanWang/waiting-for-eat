import Comment from "../../../components/Comment/index.jsx";

function RestaurantReviewSection() {
  return (
    <div className="mt-2 border-t-2 border-solid border-gray-300 pb-6">
      <h1 className="text-2xl font-bold text-[#ff6e06]">相關評論</h1>
      <h1 className="text-base font-bold text-gray-400">點選評論以展開內容</h1>

      <Comment />
    </div>
  );
}

export default RestaurantReviewSection;
