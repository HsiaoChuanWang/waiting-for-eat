/* eslint-disable react/prop-types */
import noItem from "./noItem.png";

function NoItem({ content, distance, pictureWidth, textSize, optional }) {
  return (
    <div
      className={`m-4 flex ${distance} ${optional} h-32 items-center justify-center rounded-2xl border-2 border-solid border-gray-200 bg-white`}
    >
      <div className={`${pictureWidth}`}>
        <img src={noItem} alt="" />
      </div>
      <h1 className={`${textSize} font-bold text-gray-600`}>{content}</h1>
    </div>
  );
}

export default NoItem;
