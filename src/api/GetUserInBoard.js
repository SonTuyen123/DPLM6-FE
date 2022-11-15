import Http from "../http/http";

async function GetUserInBoard(data) {
  return await Http.post("/user/member-in-board", data);
}

export default GetUserInBoard;
