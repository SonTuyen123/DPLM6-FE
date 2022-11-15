import {
  Avatar,
  Container,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
} from "@mui/material";

import React, {useState} from "react";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";

const ItemsList = () => {
  const itemData = [
    {
      id: 0,
      title: "Breakfast",
      author: "@bkristastucchio",
    },
    {
      id: 1,
      title: "Burger",
      author: "@rollelflex_graphy726",
    },
    {
      id: 2,
      title: "Camera",
      author: "@helloimnik",
    },
    {
      id: 3,
      title: "Coffee",
      author: "@nolanissac",
    },
    {
      id: 4,
      title: "Hats",
      author: "@hjrc33",
    },
  ];

  const [data, setData] = useState(itemData);
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(data);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    console.log(items);
    setData(items);
  };
  return (
    <div>
      <div style={{width: "100%", border: "1px solid #ccc"}}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="list">
            {(provided) => (
              <List
                {...provided.droppableProps}
                ref={provided.innerRef}
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "background.paper",
                }}
              >
                {data &&
                  data.map((item, index) => {
                    return (
                      <Draggable
                        key={item.id}
                        draggableId={item.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <Paper
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            elevation={2}
                            sx={{marginBottom: "10px"}}
                          >
                            <ListItem>
                              <ListItemAvatar>
                                <Avatar src={item.img} />
                              </ListItemAvatar>
                              <ListItemText
                                primary={item.title}
                                secondary={`Author: ${item.author}`}
                              />
                            </ListItem>
                          </Paper>
                        )}
                      </Draggable>
                    );
                  })}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default ItemsList;
