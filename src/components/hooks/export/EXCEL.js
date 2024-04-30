import Excel from 'exceljs';
import moment from 'moment';

export const EXPORT_PRODUCT_EXCEL=async (PRODUCTS_ARRAY)=>{
    if (PRODUCTS_ARRAY?.length === 0){
        throw new Error('No products to export');
    }
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet(`VENDAR Products`, {views:[{state: 'frozen', xSplit: 1, ySplit:1}]});
    let date = new Date()
    workbook.creator = 'VENDAR';
    workbook.created = date;
    workbook.modified = date;
    workbook.views = [
        {
          x: 0, y: 0, width: 10000, height: 20000,
          firstSheet: 0, activeTab: 1, visibility: 'visible'
        }
    ]
    worksheet.columns = [
        { header: 'Product ID', key: 'id', width: 10 },
        { header: 'Date', key: 'date', width: 10 },
        { header: 'Name', key: 'name', width: 32 },
        { header: 'Description', key: 'description', width: 32 },
        { header: 'Price', key: 'price', width: 10 },
        { header: 'Category', key: 'category', width: 32 },
        { header: 'Items', key: 'items', width: 10 },
        { header: 'Discount', key: 'discount', width: 32 },
        { header: 'Discount price', key: 'discountprice', width: 32 },
        { header: 'Store ID', key: 'store_ref', width: 32 },
        { header: 'Store Name', key: 'store_name', width: 32 },
        { header: 'Owner ID', key: 'owner_ref_id', width: 32 },
        { header: 'Owner Name', key: 'owner_ref_name', width: 32 },
        { header: 'Owner Contact', key: 'owner_ref_mobile', width: 32 },
        { header: 'Owner Account type', key: 'owner_ref_acc_type', width: 32 },
        { header: 'Transactions', key: 'transactions', width: 32 },
        { header: 'Status', key: 'status', width: 32 },
    ];
    worksheet.getRows(1).alignment = { horizontal: 'center', vertical: 'center' };
    for (let i = 0; i <= PRODUCTS_ARRAY?.length - 1; i++) {
        let product = PRODUCTS_ARRAY[i];
        worksheet.addRow({
            id: product?._id,
            date: moment(product?.createdAt).format("DD MMM YY"),
            name: product?.name,
            description: product?.description,
            price: product?.price,
            category: product?.category,
            items: product?.items,
            discount: product?.discount,
            discountprice: product?.discountprice,
            store_ref: product?.store_ref?._id,
            store_name: product?.store_ref?.name,
            owner_ref_id: product?.owner_ref_id?._id,
            owner_ref_name: product?.owner_ref_id?.name,
            owner_ref_mobile: product?.owner_ref_id?.mobile,
            owner_ref_acc_type: product?.owner_ref_id?.account_type,
            transactions: product?.transactions?.length,
            status: product?.product_status?.approval_status ? 'approved' : 'pending',
        })
    };
    try{
        const buffer = await workbook.xlsx.writeBuffer();
        const file_type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8';
        let EXTENSION = '.xlsx';
        const blob = new Blob([buffer], { type: file_type });

        if(navigator.msSaveBlog){
            navigator.msSaveBlog(blob, `VENDAR Products Excel`+ EXTENSION);
        }else{
            const link = document.createElement('a');
            if (link.download !== undefined){
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', `VENDAR Products Excel`+ EXTENSION);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            };
        }
    }catch(error){
        throw new Error("Could not export your products");
    };
}