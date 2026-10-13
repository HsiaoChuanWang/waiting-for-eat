/* eslint-disable react/prop-types */
function EditorMedia({ block, contentState }) {
  const data = contentState.getEntity(block.getEntityAt(0)).getData();

  return (
    <div>
      {" "}
      <img
        src={data.src}
        alt={data.alt || ""}
        style={{
          height: data.height || "auto",
          width: data.width || "auto",
        }}
      />
    </div>
  );
}

export default EditorMedia;
