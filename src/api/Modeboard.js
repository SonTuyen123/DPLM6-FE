import Http from "../http/http";

async function ModeBroad(data) {
  return await Http.post("/user/mode-board/" + data);
}

export default ModeBroad;
