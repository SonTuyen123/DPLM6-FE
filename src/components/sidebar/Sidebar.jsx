import { useEffect, useState } from "react";
import MediaCard from "../Card/Card";
import { useSelector } from "react-redux";
import Project from "./Project";
import Avatar from "@mui/material/Avatar";
import { Button } from "@mui/material";
import Member from "../../api/DataMember";
import jwtDecode from "jwt-decode";
import { useLocation, useNavigate } from "react-router-dom";
import getBroad from "../../api/GetBroad";
import getDatAWorkSpace from "../../api/GetDataAWorkSpace";

export default function Sidebar(props) {
  let decode = jwtDecode(localStorage.getItem("token"));
  const dataWorkSpace = [].concat(props.WorkSpace).reverse();

  const columnsOrder = [].concat(props.columnsOrder).reverse();

  const navigate = useNavigate();

  const handleGetIdWorkspace = (id) => {
    navigate(`/member/${id}`);
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
        fontSize: 30,
      },
      children: `${name.split(" ")[0][0]}`,
    };
  }
  return (
    <div className="flex flex-cols gap-12 justify-center mt-8 mb-10">
      <Project />

      {/* oulet */}

      <div className="pl-5  ">
        <div className="text-slate-400 text-xl pb-5 ">
          Các không gian làm việc của bạn
        </div>
        <div className="flex flex-col gap-5">
          {dataWorkSpace.map((item, index) => (
            <div>
              <div className="flex grid grid-cols-3">
                <div className=" flex gap-2">
                  <div className="my-auto">
                    <Avatar
                      style={{ height: 40 + "px", width: 40 + "px" }}
                      variant="rounded"
                      {...stringAvatar(item.name)}
                    />
                  </div>

                  <span className="my-auto text-lg font-bold">{item.name}</span>
                </div>

                <div className=" col-span-2 ml-40  flex flex-row gap-3 mb-6">
                  <div className="flex hover:bg-slate-300 bg-slate-200 mt-2 p-1 px-2 rounded cursor-pointer inline-block">
                    <span className="block mr-1">
                      <i class="fa-brands fa-trello"></i>
                    </span>
                    <span> Bảng </span>
                  </div>
                  <div
                    type="button"
                    onClick={() => handleGetIdWorkspace(item._id)}
                    className="flex hover:bg-slate-300 bg-slate-200 mt-2 p-1 px-2 rounded cursor-pointer"
                  >
                    <span className="block mr-1">
                      <i class="fa-solid fa-user-group"></i>
                    </span>
                    <span> Thành viên </span>
                  </div>
                </div>
              </div>
              <div className=" ">
                <div className="grid grid-cols-3 gap-4 ">
                  {columnsOrder ? (
                    columnsOrder.map((broad) => {
                      if (item.id_listIdBroad.includes(broad._id)) {
                        return (
                          <MediaCard broad={broad} idWorkSpace={item._id} />
                        );
                      }
                    })
                  ) : (
                    <MediaCard>Trello</MediaCard>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* <Content/> */}
      </div>
    </div>
  );
}
