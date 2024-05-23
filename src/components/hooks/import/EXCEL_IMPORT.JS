import Excel from 'exceljs';
import moment from 'moment';

export const IMPORT_MANY_PRODUCTS_FROM_EXCEL =async(DATA,USER_ID,STORE_ID)=>{
    const FILE = DATA.products[0];
    if(!FILE){
        return {
            error: true,
            message: 'You did not provide any files to extract products from.'
        }
    }
    const wb = new Excel.Workbook();
    const reader = new FileReader();


    reader.readAsArrayBuffer(FILE);
    let IMPORTED_PRODUCTS_DATA = [];
    reader.onload = async() => {
        const buffer = reader.result;
        wb.xlsx.load(buffer).then((workbook) => {
            console.log(workbook, 'workbook instance');
            workbook.eachSheet((sheet, id) => {
                sheet.eachRow((row, rowIndex) => {
                    const row_data = {
                        name: row.values[1],
                        description: row.values[2],
                        price: row.values[3],
                        buying_price: row.values[4],
                        category: row.values[5],
                        items: row.values[6],
                        discount: false,
                        discountprice: 0,
                        store_ref: STORE_ID,
                        product_image: '',
                        owner_ref_id: USER_ID
                    }
                    if(rowIndex === 1 || rowIndex === 2){
                        return;
                    }
                    IMPORTED_PRODUCTS_DATA.push(row_data);
                });
            });
            console.log(IMPORTED_PRODUCTS_DATA)
        });
    };
    return(IMPORTED_PRODUCTS_DATA)
}