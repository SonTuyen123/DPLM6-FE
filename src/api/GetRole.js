import Http from "../http/http";

async function getRole(data) {
  return await Http.get("/user/boar/find-role"+data);
}

export default getRole;
