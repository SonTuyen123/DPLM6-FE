import React, { useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import getDatAWorkSpace from "../../api/GetDataAWorkSpace";
import { useState } from "react";
import Member from "../../api/DataMember";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import FolderIcon from "@mui/icons-material/Folder";
import CircularProgress from "@mui/material/CircularProgress";
import GetUserInBoard from "../../api/GetUserInBoard";

export default function MemberList() {
  const id = useParams().id;
  const dispatch = useDispatch();
  const [data, setData] = useState();
  const [user, setUser] = useState("");
  const [InfoUser, setInfoUser] = useState();
  const [userAdminWorkSpace, setUserAdminWorkSpace] = useState();

  const token = localStorage.getItem("token");
  const decode = jwtDecode(token)["email"];

  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */

    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }
  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(" ")[0][0]}`,
    };
  }

  function unique(arr) {
    var newArr = [];
    for (var i = 0; i < arr.length; i++) {
      if (newArr.indexOf(arr[i]) === -1) {
        newArr.push(arr[i]);
      }
    }
    return newArr;
  }

  useEffect(() => {
    getDatAWorkSpace(id)
      .then((res) => {
        setUserAdminWorkSpace(res.data.User_admin);
        let arr = [];

        for (let index = 0; index < res.data.User.length; index++) {
          for (let i = 0; i < res.data.User[index].length; i++) {
            arr.push(res.data.User[index][i].email);
          }
        }

        setUser(unique(arr));
        setData(res.data.data);
      })
      .catch((e) => console.log(e));
  }, []);

  useEffect(() => {
    if (user.length > 0) {
      GetUserInBoard({ data: user })
        .then((res) => {
          setInfoUser(res.data.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [user]);

  return (
    <div className="p-10 bg-white ">
      <div className="mx-20 flex flex-col">
        <div className=" h-36 flex flex-row bg-white ">
          <div className="w-1/2 p-2 my-auto flex flex-row ">
            <div className="w-1/3"></div>
            <div className="w-2/3 flex gap-4">
              <div>
                {data ? (
                  <Avatar
                  style={{ height: 65 + "px", width: 65 + "px",fontSize:35+'px'}}
                    variant="rounded"
                    {...stringAvatar(data.name)}
                  />
                ) : (
                  <CircularProgress color="inherit" />
                )}
              </div>
              <div className="my-auto">
                <div className="text-2xl font-bold">{data && data.name}</div>
                <div className="text-xs">Ch??? ?????</div>
              </div>
            </div>
          </div>

          <div className="w-1/2 my-auto">
            <button className="bg-sky-500 hover:bg-sky-400 ml-64 p-2 flex gap-2 rounded text-white">
              <PersonAddAlt1Icon />
              M???i c??c th??nh vi??n v??o kh??ng gian l??m vi???c
            </button>
          </div>
        </div>
        <hr className="font-black "></hr>
        <div className="w-full flex flex-col mt-4 ">
          <div className="w-1/6 text-center mb-2 font-bold text-3xl">
            Th??nh vi??n
          </div>
          <div className="w-full flex">
            <div className=" w-1/6 text-left text-xs ml-2 text-gray-400 font-bold">
              Th??nh vi??n c???a c??c b???ng kh??ng gian l??m vi???c
            </div>
            <div className="ml-10 w-full">
              <div className=" text-2xl mb-2">
                C??c th??nh vi??n Kh??ng gian l??m vi???c ({user.length})
              </div>
              <div className="text-xs">
                C??c th??nh vi??n trong Kh??ng gian l??m vi???c c?? th??? xem v?? tham gia
                t???t c??? c??c b???ng Kh??ng gian l??m vi???c hi???n th??? v?? t???o ra c??c b???ng
                m???i trong Kh??ng gian l??m vi???c.
              </div>
              <hr className="my-6"></hr>
              <div>
                <TextField size="small" label={"L???c theo  t??n"} />
              </div>
              <div>
                {InfoUser &&
                  InfoUser.map((item) => (
                    <div className="text-xs w-full">
                      <hr className="my-6"></hr>
                      <div className="flex w-full">
                        <div className="w-9/12 my-auto flex gap-3 ">
                          {" "}
                          <div>
                            {item.image ? (
                              <Avatar alt="Cindy Baker" src={item.image} />
                            ) : (
                              <Avatar {...stringAvatar(item.name)} />
                            )}
                          </div>
                          <div className="my-auto">
                            <div className="mb-1"> {item.name}</div>
                            <div>{item.email}</div>
                          </div>
                        </div>
                        <div>
                          {decode === userAdminWorkSpace ? (
                            <div>
                              {userAdminWorkSpace &&
                              userAdminWorkSpace === item.email ? (
                                <div className="w-3/12 my-auto flex gap-4 text-center w-fit">
                                  {" "}
                                  <Button variant="outlined" disabled>
                                    Admin
                                  </Button>
                                </div>
                              ) : (
                                <div className="w-3/12 my-auto flex gap-4 text-center w-fit">
                                  <Button variant="outlined" disabled>
                                    Member
                                  </Button>
                                  <Button
                                    variant="outlined"
                                    startIcon={<DeleteIcon />}
                                  >
                                    X??a
                                  </Button>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div>
                              {userAdminWorkSpace &&
                              userAdminWorkSpace === item.email ? (
                                <div className="w-3/12 my-auto flex gap-4 text-center w-fit">
                                  {" "}
                                  <Button variant="outlined" disabled>
                                    Admin
                                  </Button>
                                </div>
                              ) : (
                                <div className="w-3/12 my-auto flex gap-4 text-center w-fit">
                                  <Button variant="outlined" disabled>
                                    Member
                                  </Button>
                                  <Button
                                    variant="outlined"
                                    disabled
                                    startIcon={<DeleteIcon />}
                                  >
                                    X??a
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      {/* <hr className="my-4"></hr> */}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
