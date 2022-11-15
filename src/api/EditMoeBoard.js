import Http from "../http/http";

async function EditModeBoard(data) {
  return await Http.post("/user/edit-mode-board/", data);
}

export default EditModeBoard;
