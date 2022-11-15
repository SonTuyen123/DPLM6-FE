import Http from "../http/http";

async function getDataUSer(data) {
  return await Http.post("/user/board-data-user", data);
}

export default getDataUSer;
