
import './ColumnHandler.css';
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
function ColumnHandler(props) 
{
    //console.log(props);
    const column=props.column;
    let options=null;
    if(column=="Start" || column=="End")
    {
        options=props.unique_values.map(
            unique_value => <option value={decimal_to_written_time(unique_value)}>{decimal_to_written_time(unique_value)}</option>
        );
    }
    else
    {
        options=props.unique_values.map(
            unique_value => <option value={unique_value}>{unique_value}</option>
        );
    }
    options.splice(0, 0, <option value="">Any</option>);

    //Make sure the name prop is set so that the parent knows which dictionary key to modify.
    return(
        <td>
        <button onClick={() => props.update_sort(column,"ASC")}>ASC</button>
        <button onClick={() => props.update_sort(column,"DESC")}>DESC</button>
        <input value={props.input_value} name={column} id={column} list={column+"_values"} onChange={props.handleInputs}/>
        <datalist id={column+"_values"}>
        {options}
        </datalist>
        </td>
    )
}

export default ColumnHandler;