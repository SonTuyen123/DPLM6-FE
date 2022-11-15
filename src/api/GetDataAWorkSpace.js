import axios from "axios";
import Http from "../http/http";

async function getDatAWorkSpace(idWorkSpace) {
  return await Http.get("/user/data-a-workspace/" + idWorkSpace);
}

export default getDatAWorkSpace;