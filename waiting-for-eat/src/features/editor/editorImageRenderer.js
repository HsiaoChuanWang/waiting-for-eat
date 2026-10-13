import EditorMedia from "./EditorMedia.jsx";

function renderEditorMediaBlock(contentBlock) {
  if (contentBlock.getType() !== "atomic") return undefined;

  return {
    component: EditorMedia,
    editable: false,
    props: {
      foo: "bar",
    },
  };
}

export { renderEditorMediaBlock };
