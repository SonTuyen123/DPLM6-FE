import React, { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import getBroad from "../../api/GetBroad";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import SettingsIcon from "@mui/icons-material/Settings";
import Avatar from "@mui/material/Avatar";
import { Button } from "@mui/material";
import getDatAWorkSpace from "../../api/GetDataAWorkSpace";
import { dataAWorkspace } from "../../redux/features/showModal.slice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setDataAWorkspace } from "../../redux/features/showModal.slice";
import { useNavigate } from "react-router-dom";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function Project() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const decode = jwtDecode(localStorage.getItem("token"));
  const [open, setOpen] = React.useState(false);
  const [idBoard, setIdBoard] = useState();
  const handleClick = (data) => {
    setOpen(!open);
  }

  const [workspace, setWorkSpace] = useState([]);
  const idUser = jwtDecode(token).id;
  const handleCHangPage = (data) => {
    navigate(`/member/${data}`);
  };

  useEffect(() => {
    getBroad(idUser)
      .then((res) => {
        setWorkSpace([].concat(res.data.listWorkSpace).reverse())
      })
      .catch((e) => console.log(e.message));
  }, []);

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
    <>
      <div
        id="Main"
        class="xl:rounded-r transform  xl:translate-x-0  ease-in-out transition duration-500 flex justify-start items-start h-full  w-full sm:w-64 bg-white-900 flex-col"
      >
        <div class="mt-6 flex flex-col justify-start items-center  pl-4 w-full border-gray-600 border-b space-y-3 pb-5 ">
          {/* Bảng */}
          <button class="flex jusitfy-start items-center space-x-6 w-full  focus:outline-none  focus:text-indigo-400  text-black rounded ">
            <span>
              <i class="fa-brands fa-trello"></i>
            </span>
            <span> Bảng </span>
          </button>
          {/* Trang chủ */}
          <button class="flex jusitfy-start items-center w-full  space-x-4 focus:outline-none text-black focus:text-indigo-400   rounded ">
            <span>
              <i class="fa-solid fa-house"></i>
            </span>
            <span> Trang chủ </span>
          </button>
          {/* Project */}
        </div>

        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Các không gian làm việc
            </ListSubheader>
          }
        >
          {workspace.map((item, index) => (
            <>
              <div>
                <Accordion onClick={handleClick} sx={{ boxShadow: 0 }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id={item._id}
                  >
                      <ListItemButton
                            variant="rounded"
                      >
                        <ListItemIcon>
                          <Avatar
                            style={{ height: 30 + "px", width: 30 + "px",fontSize:15+'px'}}
                            variant="rounded"
                            {...stringAvatar(item.name)}
                          />
                        </ListItemIcon>
                      <ListItemText style={{fontSize:15+'px'}} primary={item.name} />
                      </ListItemButton>
                   
                  </AccordionSummary>
                  <AccordionDetails>
                    <List component="div" disablePadding>
                      <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>
                          <i
                            class="fa-brands fa-trello ml-1"
                            style={{ fontSize: 20 + "px", color: "black" }}
                          ></i>
                        </ListItemIcon>
                        <ListItemText primary="Bảng" />
                      </ListItemButton>
                    </List>
                    <List component="div" disablePadding>
                      <ListItemButton
                        onClick={() => handleCHangPage(item._id)}
                        sx={{ pl: 4 }}
                      >
                        <ListItemIcon>
                          <i
                            class="fa-solid fa-user-group"
                            style={{ fontSize: 17 + "px", color: "black" }}
                          ></i>
                        </ListItemIcon>
                        <ListItemText primary="Thành viên" />
                      </ListItemButton>
                    </List>
                    <List component="div" disablePadding>
                      <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>
                          <SettingsIcon style={{ color: "black" }} />
                        </ListItemIcon>
                        <ListItemText primary="Cài đặt" />
                      </ListItemButton>
                    </List>
                  </AccordionDetails>
                </Accordion>
              </div>
            </>
          ))}
        </List>
      </div>
    </>
  );
}
