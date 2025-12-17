
import readXlsxFile from 'read-excel-file';
const base_url = import.meta.env.BASE_URL

async function to_dictionaries(rows)
{
    //The first row holds the column names. The rest of the rows hold the column values.
    let dictionaries=[];
    for(let i=1;i<rows.length;i++)
    {
        let dictionary={};
        for(let j=0;j<rows[0].length;j++)
        {
            dictionary[rows[0][j]]=rows[i][j];
        }
        dictionaries.push(dictionary)
    }
    return dictionaries;
}
export async function get_excel_data(file_name)
{
    return await fetch(`${base_url}${file_name}`)
  .then(response => response.blob())
  .then(blob => readXlsxFile(blob))
  .then(async(rows) => {
    // `rows` is an array of rows
    // each row being an array of cells.\
    console.log(rows);
    return await to_dictionaries(rows);
  })
}
export default get_excel_data;