import { useState,useEffect } from 'react'
import TaekwondoElement from './TaekwondoElement';
import ColumnHandler from './ColumnHandler.jsx';
import './App.css'
import get_excel_data from './get_excel_data.js'

const file_name="Class_Data.xlsx";
const columns=["ID","Name/Rank","Day","Start","End","Age"];

function App() {
  function decimal_to_written_time(num)
  {
      //Convert
      num*=24;
      let hours = Math.floor(num);
      const minutes = Math.round((num - hours) * 60);
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12; // Convert to 12-hour format
      return `${hours}:${String(minutes).padStart(2, '0')} ${ampm}`;
  }
  function filter_data(sorted_data)
  {
    for(let column of columns)
    {
      //Check input values to filter
      let input_value=inputs[column];
      if(input_value)
      {
        //Filter with includes if the input is a string. Otherwise filter by equality.
        if(column=="Start"||column=="End")
        {
          sorted_data=sorted_data.filter(organization => decimal_to_written_time(organization[column])==input_value);
        }
        else if(isNaN(input_value))
        {
          sorted_data=sorted_data.filter(organization => organization[column].toUpperCase().includes(input_value.toUpperCase()));
        }
        else
        {
          sorted_data=sorted_data.filter(taekwondo_class => taekwondo_class[column]==inputs[column]);
        }
      }

      //Check select values to filter
      if(selects[column])
      {
        //Filter with includes if the input is a string. Otherwise filter by equality.
        if(isNaN(selects[column]))
        {
          sorted_data=sorted_data.filter(organization => organization[column].toUpperCase().includes(selects[column].toUpperCase()));
        }
        else
        {
          sorted_data=sorted_data.filter(taekwondo_class => taekwondo_class[column]==selects[column]);
        }
      }
    }
    return sorted_data;
  }
  function sort_data(sorted_data)
  {
    //console.log(sorted_data[0][sort_column]+" "+isNaN(sorted_data[0][sort_column]));
    if(sort_direction=="DESC")
      {
        //If the first value is not a number, sort by using localeCompare. Otherwise, sort by comparing numerical values.
        if(isNaN(sorted_data[0][sort_column])) 
        {
          sorted_data=sorted_data.sort((a,b) => b[sort_column].localeCompare(a[sort_column]));
        }
        else
        {
          sorted_data=sorted_data.sort((a,b) => b[sort_column]-a[sort_column]);
        }
      }
      else
      {
        //If the first value is not a number, sort by using localeCompare. Otherwise, sort by comparing numerical values.
        if(isNaN(sorted_data[0][sort_column])) 
        {
          sorted_data=sorted_data.sort((a,b) => a[sort_column].localeCompare(b[sort_column]));
        }
        else
        {
          sorted_data=sorted_data.sort((a,b) => a[sort_column]-b[sort_column]);
        }
      }
      return sorted_data;
  }
  function display_data()
  {
      console.log("Sorting with "+sort_column+" "+sort_direction);
      let sorted_data=[...taekwondo_class_dictionaries];

      //Filter and sort data before displaying it
      sorted_data=filter_data(sorted_data)
      sorted_data=sort_data(sorted_data);

      
      console.log(sorted_data);

      //Create a TaekwondoElement for each Taekwondo Class
      let taekwondo_class_elements=sorted_data.map(taekwondo_class => <TaekwondoElement key={taekwondo_class.ID} taekwondo_class={taekwondo_class}></TaekwondoElement>);
      setTaekwondo_Elements_Mapped(taekwondo_class_elements);
  }

  //Update the sort column and sort direction values
  function update_sort(column,direction)
  {
    //Sorting by Day does not make sense. This will sort by Day Number instead.
    if(column=="Day")
    {
      setSort_Column("Day_Number");
    }
    else
    {
      setSort_Column(column);
    }
    setSort_Direction(direction);
  }

  //Update the value of an input.
  function handleInputs(e)
  {
    const column=e.target.name;
    const value=e.target.value;
    setInputs({...inputs,[column]:value});
  }

  //Update the value of a select.
  function handleSelects(e)
  {
    const column=e.target.name;
    const value=e.target.value;
    setSelects({...selects,[column]:value});
  }

  //Get all unique values from a column
  function get_unique_values(column)
  {
    if(column.includes("Rank")||column.includes("Name"))
    {
      return ["Tigers","Children","Teen","Adult","No Belt","White","Yellow","Orange","Green","Blue","Purple","Red","Brown","Jr Black","Black: 1 Dan","Black: 2 Dan","Black: 3 Dan","Sparring (Children)","Sparring (Teen/Adult)","SWAT Demo Team","Leadership Team","Other"]
    }
    let unique_values={};
    if(!taekwondo_class_dictionaries)
    {
      return [];
    }
    for(let taekwondo_class_dictionary of taekwondo_class_dictionaries)
    {
      //Check that the value is not a number before attempting to use split
      if(isNaN(taekwondo_class_dictionary[column]))
      {
        //Spliting on " | " to make sure we get each separate rank.
        const parts=taekwondo_class_dictionary[column].split(" | ")
        for(let part of parts)
        {
          part=part.trim();
          unique_values[part]=true;
        }
      }
      else
      {
        unique_values[taekwondo_class_dictionary[column]]=true;
      }
    }
    return Object.keys(unique_values);
  }
  

  //Creates an input for each column
  const [inputs,setInputs]=useState(Object.fromEntries(columns.map(key => [key, ""])));

  //Creates a select for each column
  const [selects,setSelects]=useState(Object.fromEntries(columns.map(key => [key, ""])));

  const [taekwondo_class_elements_mapped, setTaekwondo_Elements_Mapped ] = useState();

  //Create Buttons that let you sort by taekwondo_class data column
  const [ sort_direction, setSort_Direction ] = useState("ASC");
  const [ sort_column, setSort_Column ] = useState("ID");

  //The main data values
  const [taekwondo_class_dictionaries,setTaekwondoDictionaries]=useState(null);

  //Load the Excel data for the Taekwondo dictionaries when the page first opens.
  useEffect(()=>
  {
    get_excel_data(file_name).then(setTaekwondoDictionaries);
  },[]);

  /*
  The main effect for displaying data. This updates 
  when the data loads for the first time
  when the sort column or sort direction change
  when the filter inputs or filter selects change
  */
  useEffect(() => {
    console.log("Effect Activated");
    if(taekwondo_class_dictionaries!=null)
    {
      display_data();
    }
  }, [taekwondo_class_dictionaries,sort_column,sort_direction,inputs,selects]); // <- this runs every time `data` changes

  const columns_mapped_head=columns.map(column =><th className="big" key={column}>{column}</th>);
  
  let columns_mapped_body=[];
  for(let column of columns)
  {
    let unique_values=get_unique_values(column);

    //Sort the unique values except for name/rank column
    if(!column.includes("Rank")&&!column.includes("Name"))
    {
      unique_values=unique_values.sort();
    }
    else
    {
        console.log(unique_values);
    }

    //For the day column, the unique values are the day of the week.
    if(column=="Day")
    {
      unique_values=["Monday","Tuesday","Wednesday","Thursday","Friday"];
    }

    //Create a column td for each column
    const column_td=
    (
        <ColumnHandler key={column} column={column} input_value={inputs[column]} select_value={selects[column]} handleInputs={handleInputs} handleSelects={handleSelects} update_sort={update_sort} unique_values={unique_values} ></ColumnHandler>
    );
    //console.log(column+" "+selects[column]);
    columns_mapped_body.push(column_td);
  }
  //console.log(columns_mapped_body);

  return (
    <>
    <h1>Talium Classes</h1>
    <table>
    <thead><tr>{columns_mapped_head}</tr></thead>
    <tbody><tr>{columns_mapped_body}</tr></tbody>
    </table>
    <div className="grid">
    {taekwondo_class_elements_mapped}
    </div>
    </>
  )
}

export default App
