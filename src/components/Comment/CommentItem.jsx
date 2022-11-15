import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Divider } from "@mui/material";
import jwtDecode from "jwt-decode";
import { useEffect } from "react";
import getImage from "../../api/getImage";
import { useState } from "react";
export default function CommentItem(props) {
  const data = props.data;
  const idUser = props.data.idUser;
  const [urlAvatar, setUrlAvatar] = useState();
  const [name, setName] = useState("");
  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    if (string) {
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
    return;
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

  useEffect(() => {
    getImage(idUser)
      .then((res) => {
        console.log(res.data);
        setName(res.data.name);
        if (res.data.message != "") {
          setUrlAvatar(res.data.message);
        }
      })
      .catch((e) => console.log(e.message));
  }, []);

  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        {urlAvatar != "Không có ảnh!" ? (
          <Avatar src={urlAvatar} />
        ) : (
          <Avatar {...stringAvatar(name)} />
        )}
      </ListItemAvatar>
      <ListItemText
        primary={name && name}
        secondary={
          <React.Fragment>
            <Typography
              sx={{ display: "inline" }}
              component="span"
              variant="body2"
              color="text.primary"
            ></Typography>
            {data.content}
          </React.Fragment>
        }
      />
    </ListItem>
  );
}
