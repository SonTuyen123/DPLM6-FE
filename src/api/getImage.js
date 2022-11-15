import axios from 'axios'

export default async function getImage(idUser) {
  return await axios.get(`http://localhost:8080/user/image/` + idUser)
}
