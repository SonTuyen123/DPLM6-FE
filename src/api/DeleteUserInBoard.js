import Http from "../http/http";

async function DeleteUserInBoard(data) {
  return await Http.post("/user/delete-user-board", data);
}

export default DeleteUserInBoard;
