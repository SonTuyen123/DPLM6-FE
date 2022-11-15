import React from "react";
import Card from "../../components/Column/Column";
import { useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import Column from "../../components/Column/Column";
import { reorderList } from "../../reorderList/reorderList";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import UpdateBroad from "../../api/UpdateBroad";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setDataBroad } from "../../redux/features/broad.slice";
import { Button } from "@mui/material";
import Navbar from "../../components/navbar/Navbar";
import { useLocation } from "react-router";
import getDataBroad from "./../../api/getDataBroad";
import getUser from "../../api/GetUser";
import sendEmailUser from "../../api/SendEmailUser";
import Member from "../../api/DataMember";
import jwtDecode from "jwt-decode";
import EditModeBoard from "../../api/EditMoeBoard";
import { setModeBoard } from "../../redux/features/showModal.slice";
import ModeBroad from "../../api/Modeboard";
import getDataUSer from "../../api/GetDataUserInBoard";
import Snackbar from "@mui/material/Snackbar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Avatar from "@mui/material/Avatar";
import DeleteUserInBoard from "../../api/DeleteUserInBoard";
import { useNavigate } from "react-router-dom";

function Broad(props) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decode = jwtDecode(token);
  const initial = useSelector((state) => state.broad.data);
  const location = useLocation();
  const idBroad = location.state.broad._id;
  const bgImg = location.state.broad.img;
  const mode = location.state.broad.mode;
  const dataByStore = useSelector((state) => state.broad.data);
  const idWorkSpace = location.state.idWorkSpace;
  const emailIdUser = jwtDecode(token)["email"];
  const dispatch = useDispatch();
  const [isTitleColumn, setIseTitleColumn] = useState(true);
  const [titleColumn, setTitleColumn] = useState();
  const [data, setData] = useState(initial);
  const [showModal, setShowModal] = useState(false);
  const [ValueShare, setValueShare] = useState();
  const [valuesUserEmail, setValueUserEmail] = useState([]);
  const [dataSearch, setDataSearch] = useState([]);
  const [a, setA] = useState([]);
  const [flagImg, setFlagImg] = useState([]);
  const [role, setRole] = useState("");
  const [modeBoard, setModeBoard] = useState();
  const [FlagModeBoard, setFlagModeBoard] = useState();
  const [roleMember, setRoleMember] = useState();
  const [valueMember, setValueMember] = useState();
  const [message, setMessage] = useState();
  const [flagDeleteUserInBoard, setFlagDeleteUserInBoard] = useState();
  const [deleteUser, setDeleteUser] = useState();

  const [stateAlert, setStateAlert] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, open } = stateAlert;

  const handleCloseAlert = () => {
    setStateAlert({ ...stateAlert, open: false });
  };
  const handleDeleUser = (e) => {
    setDeleteUser(e);
  };
  const name = decode.name.split("");
  const emailUser = decode["email"];
  const handleEditMode = () => {
    let data = {
      idBroad: idBroad,
      email: emailUser,
    };
    EditModeBoard(data)
      .then((res) => {
        setModeBoard("public");
        setFlagModeBoard(res);
      })
      .catch((e) => console.log(e));
  };

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

  useEffect(() => {
    getDataUSer(valueMember)
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  useEffect(() => {
    ModeBroad(idBroad)
      .then((res) => {
        setModeBoard(res.data.mode);
        setValueMember(res.data.userId);
        for (let index = 0; index < res.data.userId.length; index++) {
          if (res.data.userId[index].email === decode["email"]) {
            setRoleMember(res.data.userId[index].role);
            break;
          }
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, [FlagModeBoard]);

  useEffect(() => {
    Member(idBroad)
      .then((res) => {
        setA(res.data.user);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [flagImg, modeBoard, flagDeleteUserInBoard]);
  function onDragEnd(result) {
    if (!result.destination) {
      return;
    }
    if (result.type === "column") {
      const columnOrder = reorderList(
        dataByStore.columnOrder,
        result.source.index,
        result.destination.index
      );
      dispatch(
        setDataBroad({
          ...dataByStore,
          columnOrder,
        })
      );
      return;
    }

    // reordering in same list
    if (result.source.droppableId === result.destination.droppableId) {
      const column = dataByStore.columns[result.source.droppableId];
      const items = reorderList(
        column.items,
        result.source.index,
        result.destination.index
      );
      // updating column entry
      const newState = {
        ...dataByStore,
        columns: {
          ...dataByStore.columns,
          [column.id]: {
            ...column,
            items,
          },
        },
      };
      dispatch(setDataBroad(newState));
      return;
    }

    // moving between lists
    const sourceColumn = dataByStore.columns[result.source.droppableId];
    const destinationColumn =
      dataByStore.columns[result.destination.droppableId];
    const item = sourceColumn.items[result.source.index];

    // 1. remove item from source column
    const newSourceColumn = {
      ...sourceColumn,
      items: [...sourceColumn.items],
    };
    newSourceColumn.items.splice(result.source.index, 1);

    // 2. insert into destination column
    const newDestinationColumn = {
      ...destinationColumn,
      items: [...destinationColumn.items],
    };
    // in line modification of items
    newDestinationColumn.items.splice(result.destination.index, 0, item);
    const newState = {
      ...dataByStore,
      columns: {
        ...dataByStore.columns,
        [newSourceColumn.id]: newSourceColumn,
        [newDestinationColumn.id]: newDestinationColumn,
      },
    };
    dispatch(setDataBroad(newState));
  }
  const handleShowCreateColumn = () => {
    setIseTitleColumn(false);
  };

  const handleGetTitleColunn = (e) => {
    setTitleColumn(e.target.value);
  };
  const handleCreateColumn = () => {
    setIseTitleColumn(true);
    if (titleColumn) {
      const idColum = uuidv4();
      let newData = {
        ...dataByStore,
        columns: {
          ...dataByStore.columns,
          [`${idColum}`]: {
            id: idColum,
            title: titleColumn,
            items: [],
          },
        },
        columnOrder: [...dataByStore.columnOrder, `${idColum}`],
      };
      dispatch(setDataBroad(newData));
      setTitleColumn("");
    }
  };

  const handlShowModalShare = () => {
    setShowModal(true);
  };
  // useEffect(() =>{
  //   UpdateBroad(data)
  //   .then(res => console.log(res))
  //   .catch(e => console.log(e.message))
  // },[data.columnOrder])
  useEffect(() => {
    getDataBroad(idBroad)
      .then((res) => {
        dispatch(setDataBroad(res.data.broad));
      })
      .catch((e) => console.log(e.message));
  }, []);
  useEffect(() => {
    if (dataByStore && dataByStore.columnOrder.length > 0) {
      UpdateBroad(dataByStore)
        .then((res) => console.log(res))
        .catch((e) => console.log(e.message));
    }
  }, [dataByStore]);
  const handleShare = (e) => {
    let email = [];
    setValueShare(e.target.value);
    valuesUserEmail.forEach((element) => {
      let Share = e.target.value.toLowerCase();
      let data = element.toLowerCase();
      if (data.includes(Share)) {
        email.push(element);
      }
    });
    setDataSearch(email);
  };

  useEffect(() => {
    getUser()
      .then((res) => {
        setValueUserEmail(res.data.email);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [ValueShare]);

  let member = {
    email: ValueShare,
    idbroad: idBroad,
    idWorkSpace: idWorkSpace,
    emailIdUser: emailIdUser,
    role: role,
  };
  console.log("🚀 ~ file: Broad.jsx ~ line 303 ~ Broad ~ member", member);

  const handleSendEmail = () => {
    if (!role) {
      setStateAlert({ open: true, vertical: "bottom", horizontal: "center" });
      setMessage("Các ô giá trị không được bỏ trống !");
    } else {
      sendEmailUser(member)
        .then((res) => {
          if (res.data.message === "Tài khoản đã tồn tại trong bảng") {
            setStateAlert({
              open: true,
              vertical: "bottom",
              horizontal: "center",
            });
            setMessage(res.data.message);
          } else {
            setValueShare("");
            setShowModal(false);
            setFlagImg(res);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };
  const handleOutBoard = () => {
    let data = {
      email: emailIdUser,
      idboard: idBroad,
      idWorkSpace: idWorkSpace,
    };
    DeleteUserInBoard(data)
      .then((res) => {
        console.log(res);
        navigate("/");
      })
      .catch((e) => console.log(e));
  };
  const handleDeleteUserBoard = (email) => {
    let data = {
      email: email,
      idboard: idBroad,
      idWorkSpace: idWorkSpace,
    };
    DeleteUserInBoard(data)
      .then((res) => {
        console.log(res);
        setShowModal(false);
        setFlagDeleteUserInBoard(res);
      })
      .catch((e) => console.log(e));
  };
  // const handleDeleteUserBoard = () => {
  //   if (emailDeleteUser) {
  //     let data = {
  //       email: emailDeleteUser,
  //       idboard: idBroad,
  //       idWorkSpace: idWorkSpace,
  //     };
  //     DeleteUserInBoard(data)
  //       .then((res) => {
  //         console.log(res);
  //         navigate("/");
  //       })
  //       .catch((e) => console.log(e));
  //   }
  // };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        style={{ backgroundImage: `url(${bgImg})`, backgroundSize: "cover" }}
        className="Broad w-full !h-screen"
      >
        <Navbar></Navbar>
        <div>
          <div className="flex w-full ">
            {!roleMember || roleMember === "admin" ? (
              <div
                className="add-column w-7/12"
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "8px",
                }}
              >
                {isTitleColumn ? (
                  <button
                    className="asslsss"
                    style={{
                      margin: "4px 10px",
                      padding: "6px",
                      width: "300px",
                      backgroundColor: "#b2b2b2",
                      color: "black",
                      borderRadius: "6px",
                    }}
                    onClick={handleShowCreateColumn}
                  >
                    Thêm cột
                  </button>
                ) : (
                  <>
                    <input
                      type="text"
                      name="title"
                      onChange={handleGetTitleColunn}
                      style={{
                        border: "1px solid #ccc",
                        height: "40px",
                        paddingLeft: "4px",
                        borderRadius: "4px",
                        marginLeft: "14px",
                      }}
                      placeholder={"Tiêu đề cột"}
                    />
                    <button
                      className="asslsss"
                      style={{
                        margin: "20px 0",
                        padding: "8px",
                        width: "104px",
                        backgroundColor: "white",
                        color: "black",
                        borderRadius: "6px",
                        marginLeft: "8px",
                      }}
                      onClick={handleCreateColumn}
                      disabled={titleColumn ? false : true}
                    >
                      Tạo
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="w-7/12"></div>
            )}
            <div className=" w-2/12 my-auto">
              {modeBoard === "private" ? (
                <Button
                  sx={{ background: "blue" }}
                  variant="contained"
                  onClick={handleEditMode}
                >
                  Riêng tư
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  style={{ background: "gray", color: "white" }}
                  disabled
                >
                  Công khai
                </Button>
              )}
            </div>
            <div className=" w-2/12 flex my-auto">
              <AvatarGroup max={4}>
                {a.length > 0 &&
                  a.map((user) => (
                    <div>
                      {user.image ? (
                        <Avatar
                          title={user.name}
                          style={{ height: 30 + "px", width: 30 + "px" }}
                          src={`${user.image}`}
                        />
                      ) : (
                        <Avatar
                          title={user.name}
                          style={{
                            height: 30 + "px",
                            width: 30 + "px",
                            fontSize: 13 + "px",
                          }}
                          {...stringAvatar(user.name)}
                        />
                      )}
                    </div>
                  ))}
              </AvatarGroup>
            </div>

            <div className="text-center my-auto  w-1/12">
              {modeBoard === "public" ? (
                <div>
                  <a
                    className="bg-sky-500 py-1 px-1 hover:cursor-pointer rounded text-white hover:bg-sky-400"
                    onClick={handlShowModalShare}
                  >
                    <i class="fa-solid fa-user-plus "></i> Chia sẻ
                  </a>
                </div>
              ) : null}
            </div>

            <Snackbar
              anchorOrigin={{ vertical, horizontal }}
              open={open}
              onClose={handleCloseAlert}
              message={message}
              key={vertical + horizontal}
              autoHideDuration={6000}
            />

            {showModal ? (
              <>
                <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                  <div className="relative w-auto my-6 mx-auto max-w-3xl">
                    {/*content*/}
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                      {/*header*/}
                      <div className="flex items-start justify-between p-3 border-b border-solid border-slate-200 rounded-t">
                        <h6 className="text-2xl font-semibold ">
                          Chia sẻ bảng
                        </h6>
                        <a
                          onClick={() => {
                            setShowModal(false);
                          }}
                        >
                          <i class="fa-solid fa-x hover:cursor-pointer hover:text-gray-300 text-400"></i>
                        </a>
                      </div>
                      <div
                        className="relative p-6 flex-auto"
                        style={{ width: "600px" }}
                      >
                        <form
                          novalidate=""
                          action=""
                          className="space-y-12 ng-untouched ng-pristine ng-valid"
                        >
                          <div className="space-y-4  ">
                            <div className="m-2">
                              <div className="w-full gap-2 flex">
                                <div className="w-3/4 dark:placeholder-gray-700 cursor:text my-auto">
                                  <input
                                    method="post"
                                    type="text"
                                    name="email"
                                    onChange={handleShare}
                                    id="first name"
                                    className="w-full px-3 py-2 border rounded-md dark:border-gray-700 hover:cursor-text  dark:text-gray-900 "
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    data-dropdown-toggle="dropdownSearch"
                                    value={ValueShare}
                                  />
                                  <div
                                    id="dropdownSearch"
                                    className=" dropdown-menu
              min-w-max
              absolute
              hidden
              bg-white
              py-2
              shadow
              list-none
              text-left
              rounded-lg
              mt-1
              hidden
              m-0
              border-none
              bg-white z-10 list-none divide-y-2 divide-gray-100 rounded py-2 my-1 w-44 w-64 "
                                    aria-labelledby="dropdownMenuButton2"
                                  >
                                    <div className="flex flew-col gap-3">
                                      <ul
                                        className="py-1 rounded-sm text-black "
                                        aria-labelledby="dropdownLargeButton"
                                      >
                                        {dataSearch.map((item) => (
                                          <li
                                            onClick={() => {
                                              setValueShare(item);
                                            }}
                                          >
                                            <a className="text-sm block px-4 py-2">
                                              {item}
                                            </a>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                                <div className="w-1/8 items-center justify-center p-2 my-auto border border-gray-400">
                                  {roleMember === "admin" || !roleMember ? (
                                    <select
                                      onChange={(e) => {
                                        setRole(e.target.value);
                                      }}
                                    >
                                      <option className="mt-2" value="">
                                        Lựa chọn
                                      </option>
                                      <option value="member">Thành viên</option>
                                      <option value="admin">
                                        Quản trị viên
                                      </option>
                                    </select>
                                  ) : (
                                    <select
                                      onChange={(e) => {
                                        setRole(e.target.value);
                                      }}
                                    >
                                      npn
                                      <option value="">Lựa chọn</option>
                                      <option value="menber">Thành viên</option>
                                    </select>
                                  )}
                                </div>
                                <a
                                  onClick={handleSendEmail}
                                  className="w-1/8 bg-sky-500 hover:cursor-pointer text-center hover:bg-sky-400 text-white rounded-sm"
                                >
                                  Chia sẻ
                                </a>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2 ml-2"></div>
                        </form>
                        <div>Danh sách thành viên</div>
                        <table className="w-full whitespace-no-wrap">
                          <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                            {a.map((value) => (
                              <tr className="text-gray-700 dark:text-gray-400">
                                <td className="px-4 py-3">
                                  <div className="flex items-center text-sm">
                                    {/* Avatar with inset shadow */}
                                    <div className="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                                      {!value.image ? (
                                        <Avatar
                                          title={value.name}
                                          style={{
                                            height: 33 + "px",
                                            width: 33 + "px",
                                            fontSize: 13 + "px",
                                          }}
                                          {...stringAvatar(value.name)}
                                        />
                                      ) : (
                                        <Avatar
                                          title={value.name}
                                          style={{
                                            height: 30 + "px",
                                            width: 30 + "px",
                                          }}
                                          src={`${value.image}`}
                                        />
                                      )}
                                      <div
                                        className="absolute inset-0 rounded-full shadow-inner"
                                        aria-hidden="true"
                                      />
                                    </div>
                                    <div>
                                      {emailIdUser === value.email ? (
                                        <div>
                                          {" "}
                                          <p className="font-semibold">
                                            {value.name}(bạn)
                                          </p>
                                        </div>
                                      ) : (
                                        <div>
                                          {" "}
                                          <p className="font-semibold">
                                            {value.name}
                                          </p>
                                        </div>
                                      )}

                                      <p className="text-xs text-gray-600 dark:text-gray-400">
                                        {value.email} . Quản trị viên không gian
                                        làm việc
                                      </p>
                                    </div>
                                  </div>
                                </td>

                                <td className="px-4 py-3 text-xs"></td>
                                <td className="px-4 py-3 text-sm">
                                  <div class="flex justify-center">
                                    <div>
                                      {valueMember &&
                                        valueMember.map((item, index) => (
                                          <div>
                                            {item.email == value.email ? (
                                              <div
                                                className="w-24 text-black dropdown relative group inline-block rounded"
                                                style={{
                                                  backgroundColor:
                                                    item.role == "admin"
                                                      ? "rgb(248,135,77)"
                                                      : "rgb(0,132,199)",
                                                }}
                                              >
                                                <button
                                                  data-bs-toggle="dropdown"
                                                  data-dropdown-toggle={index}
                                                  className=" dropdown
            px-6
            py-2.5
            text-white
            rounded
            flex
            items-center
            whitespace-nowrap
            text-white pl-3  pr-4 py-1 px-2 rounded md:p-0 flex items-center justify-between w-full md:w-auto"
                                                  disabled={
                                                    item.role == "admin"
                                                      ? true
                                                      : false
                                                  }
                                                >
                                                  {item.role}

                                                  <svg
                                                    className="w-6 h-6 ml-1"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                  >
                                                    <path
                                                      fillRule="evenodd"
                                                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                      clipRule="evenodd"
                                                    />
                                                  </svg>
                                                </button>
                                                <div
                                                  id={index}
                                                  className=" dropdown-menu
            min-w-max
            absolute
            hidden
            bg-white
            py-2
            shadow

            list-none
            text-left
            rounded-lg
            mt-1
            hidden
            m-0
            border-none
            bg-white z-10 list-none divide-y-2 divide-gray-100 rounded py-2 my-1 w-44 w-64 "
                                                  aria-labelledby="dropdownMenuButton2"
                                                >
                                                  <div className="flex w-64 flew-col gap-3">
                                                    {item.role === "member" ? (
                                                      <div>
                                                        {emailIdUser ===
                                                        item.email ? (
                                                          <>
                                                            {" "}
                                                            <ul
                                                              className="py-1 rounded-sm text-black "
                                                              aria-labelledby="dropdownLargeButton"
                                                            >
                                                              <li>
                                                                <a className="text-sm  block px-4 py-2 cursor-pointer">
                                                                  <i class="fa-solid fa-table "></i>{" "}
                                                                  &ensp;Member
                                                                </a>
                                                              </li>
                                                              <li>
                                                                <div
                                                                  onClick={
                                                                    handleOutBoard
                                                                  }
                                                                >
                                                                  {" "}
                                                                  <a className="disabled text-sm block px-4 py-2 cursor-pointer">
                                                                    <i class="fa-solid fa-arrow-right-from-bracket"></i>
                                                                    &ensp; Rời
                                                                    khỏi bảng
                                                                  </a>
                                                                </div>
                                                              </li>
                                                            </ul>
                                                          </>
                                                        ) : (
                                                          <div>
                                                            {" "}
                                                            <ul
                                                              className="py-1 rounded-sm text-black "
                                                              aria-labelledby="dropdownLargeButton"
                                                            >
                                                              <li>
                                                                <a className="text-sm  block px-4 py-2 cursor-pointer">
                                                                  <i class="fa-solid fa-table "></i>{" "}
                                                                  &ensp;Member
                                                                </a>
                                                              </li>
                                                              <li>
                                                                <a
                                                                  onClick={() => {
                                                                    handleDeleteUserBoard(
                                                                      item.email
                                                                    );
                                                                  }}
                                                                  className="disabled text-sm block px-4 py-2 cursor-pointer"
                                                                >
                                                                  <i class="fa-solid fa-arrow-right-from-bracket"></i>
                                                                  &ensp; Xóa
                                                                  khỏi bảng
                                                                </a>
                                                              </li>
                                                            </ul>
                                                          </div>
                                                        )}
                                                      </div>
                                                    ) : (
                                                      <div
                                                        className="disabled"
                                                        disabled
                                                      >
                                                        <ul
                                                          className="py-1 rounded-sm text-black "
                                                          aria-labelledby="dropdownLargeButton"
                                                        >
                                                          <li>
                                                            <a className="text-sm  block px-4 py-2 cursor-pointer">
                                                              <i class="fa-solid fa-table "></i>{" "}
                                                              &ensp; Admin
                                                            </a>
                                                          </li>
                                                          <li>
                                                            <a className="text-sm block px-4 py-2 cursor-pointer">
                                                              <i class="fa-solid fa-arrow-right-from-bracket"></i>
                                                              &ensp; Rời khỏi
                                                              bảng
                                                            </a>
                                                          </li>
                                                        </ul>
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            ) : null}
                                          </div>
                                        ))}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
              </>
            ) : null}
          </div>

          <Droppable droppableId="broad" direction="horizontal" type="column">
            {(provided) => (
              <div
                className="columns"
                style={{ display: "flex" }}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {dataByStore &&
                  dataByStore.columns &&
                  dataByStore.columnOrder.length > 0 &&
                  dataByStore.columnOrder.map((column, index) => (
                    <Column
                      className="column"
                      key={column}
                      column={dataByStore.columns[column]}
                      role={roleMember}
                      index={index}
                    />
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </div>
    </DragDropContext>
  );
}

export default Broad;
