import * as React from 'react';
import { pink } from '@mui/material/colors';
import Checkbox from '@mui/material/Checkbox';
import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setDataBroad } from '../../redux/features/broad.slice';
let checkBoxhandle = (dataByStore , itemTarget , listChecked ,dispatch) =>{
  if(itemTarget){
    dataByStore.columnOrder.forEach(column =>{
      dataByStore.columns[`${column}`].items.forEach((e,index) =>{
        if(e.id == itemTarget.id){
            let replaceItems = [...dataByStore.columns[column].items]
            let newItem = {
                ...itemTarget ,
                listCheckBox : [...listChecked]
            }
            replaceItems.splice(index,1,{
              ...newItem})
            let newData = {
              ...dataByStore ,
              columns : {
                ...dataByStore.columns ,
                [`${column}`] : {
                  ...dataByStore.columns[`${column}`],
                  items : [...replaceItems]
                }
              }
            }
            dispatch(setDataBroad(newData))
        }
      })
    })
  }
}
export default function CheckBox(props) {
    const dispatch = useDispatch()
    const dataByStore = useSelector((state) => state.broad.data);
    const itemTarget = props.itemTarget
    const [target , setTarget] = useState() ;
    let [listCheck , setListCheck] = useState([])
    let listChecked = [] ;
    const handleChecked = (e) =>{
        if(e.target.checked){
            if(listChecked.indexOf(e.target.value) == -1){
                listChecked.push(e.target.value)
                checkBoxhandle(dataByStore ,itemTarget , listChecked ,dispatch)
            }
        }else{
            listChecked.splice(listChecked.indexOf(e.target.value) ,1)
            checkBoxhandle(dataByStore ,itemTarget , listChecked ,dispatch)
        }
    }
    useEffect(() =>{
      if(itemTarget){
        dataByStore.columnOrder.forEach(column =>{
          dataByStore.columns[`${column}`].items.forEach((e,index) =>{
            if(e.id == itemTarget.id && e.listCheckBox){
                setListCheck([...e.listCheckBox])
            }
          })
        })
      }
    }, [dataByStore])
  return (
    <div style={{display: 'flex'}}>
      <div className="checkboxasdasd">
      <Checkbox  id='medium' value={'medium'} 
      onChange={handleChecked}
      name="checkbox"
      checked={listCheck.length > 0 && listCheck[0] == 'medium' ? true : false}
      />

      <label htmlFor="fit">Thấp</label>
      <Checkbox id='fit' value={'fit'}  color="secondary" 
      onChange={handleChecked}
      name="checkbox"
      checked={listCheck.length > 0 && listCheck[0] == 'fit' ? true : false}

      />

      <label htmlFor="hight">Vừa</label>
      <Checkbox id='hight' value={'hight'}
      name="checkbox"
        sx={{
          color: pink[800],
          '&.Mui-checked': {
            color: pink[600],
          },
        }}
      onChange={handleChecked}
      checked={listCheck.length > 0 && listCheck[0] == 'hight' ? true : false}
      />
      <label htmlFor="hight">Cao</label>
      </div>

      <div className="listChecked" style={{marginLeft : '8px'}}>
        <ul style={{display : 'flex'}}>
            {listCheck.length > 0 && listCheck.map((e ,index )=>{
               return <li key={index} style={{color : "white",padding : '8px' , width : '80px' , backgroundColor : e == 'medium' ? '#1976d2' : e == 'fit' ? '#9c27b0' :  e == 'hight' ? '#d81b60' : 'green' , borderRadius : '8px' , textAlign: 'center' , margin : '0 10px'}}>
                {e == 'hight'? "Cao" : e == 'fit' ? 'Vừa' : e == 'medium' ? 'Thấp' : ''}
                </li>
            })}
        </ul>
      </div>
    </div>
  );
}