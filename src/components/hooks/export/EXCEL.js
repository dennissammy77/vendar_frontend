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

export const EXPORT_TRANSACTIONS_EXCEL=async (TRANSACTIONS_ARRAY)=>{
    if (TRANSACTIONS_ARRAY?.length === 0){
        throw new Error('No transactions found to export');
    }
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet(`VENDAR TRANSACTIONS`, {views:[{state: 'frozen', xSplit: 1, ySplit:1}]});
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
        { header: 'Sale ID', key: 'id', width: 10 },
        { header: 'Date', key: 'date', width: 10 },
        { header: 'Store Name', key: 'store_name', width: 32 },
        { header: 'Product Name', key: 'product_name', width: 32 },
        { header: 'Product ID', key: 'product_id', width: 32 },
        { header: 'Price', key: 'price', width: 10 },
        { header: 'Category', key: 'category', width: 32 },
        { header: 'Vendor Name', key: 'vendor_name', width: 32 },
        { header: 'Vendor ID', key: 'vendor_id', width: 32 },
        { header: 'Vendor Contact', key: 'vendor_mobile', width: 32 },
        { header: 'Sale made by', key: 'staff_name', width: 32 },
        { header: 'Delivery Status', key: 'delivery_status', width: 32 },
        { header: 'Rider name', key: 'rider_name', width: 32 },
        { header: 'Rider contact', key: 'rider_contact', width: 32 },
        { header: 'Payment status', key: 'payment_status', width: 32 },
        { header: 'Payment method', key: 'payment_method', width: 32 },
        { header: 'Payment reference code', key: 'payment_code', width: 32 },
        { header: 'Items', key: 'items', width: 24 },
        { header: 'SubTotal', key: 'sub_total', width: 32 },
        { header: 'Delivery Fee', key: 'delivery_fee', width: 32 },
        { header: 'Total', key: 'payment_total', width: 32 },
    ];
    worksheet.getRows(1).alignment = { horizontal: 'center', vertical: 'center' };
    for (let i = 0; i <= TRANSACTIONS_ARRAY?.length - 1; i++) {
        let transaction = TRANSACTIONS_ARRAY[i];
        worksheet.addRow({
            id: transaction?._id,
            date: moment(transaction?.createdAt).format("DD MMM YY"),
            store_name: transaction?.store_ref?.name,
            product_name: transaction?.product_ref?.name,
            product_id: transaction?.product_ref?._id,
            price: transaction?.price,
            category: transaction?.product_ref?.category,
            items: transaction?.items,
            delivery_status: transaction?.delivery_status? 'delivered':'N/A',
            rider_name: transaction?.delivery_status? transaction?.delivery_person_name:'N/A',
            rider_contact: transaction?.delivery_status? transaction?.delivery_person_contact:'N/A',
            payment_status: transaction?.status,
            payment_method: transaction?.payment_method || 'N/A',
            payment_code: transaction?.payment_code || 'N/A',
            sub_total: transaction?.price,
            delivery_fee: transaction?.delivery_fee || 0,
            payment_total: transaction?.payment_total,
            vendor_name: transaction?.vendor?.name,
            vendor_id: transaction?.vendor?._id,
            vendor_mobile: transaction?.vendor?.mobile,
            staff_name: transaction?.created_by?.name,
        })
    };
    try{
        const buffer = await workbook.xlsx.writeBuffer();
        const file_type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8';
        let EXTENSION = '.xlsx';
        const blob = new Blob([buffer], { type: file_type });

        if(navigator.msSaveBlog){
            navigator.msSaveBlog(blob, `VENDAR Trasactions Excel`+ EXTENSION);
        }else{
            const link = document.createElement('a');
            if (link.download !== undefined){
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', `VENDAR Transactions Excel`+ EXTENSION);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            };
        }
    }catch(error){
        throw new Error("Could not export your transactions");
    };
}

export const EXPORT_PICKUPS_EXCEL=async (PICKUP_ARRAY)=>{
    if (PICKUP_ARRAY?.length === 0){
        throw new Error('No pickups found to export');
    }
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet(`VENDAR PICKUPS`, {views:[{state: 'frozen', xSplit: 1, ySplit:1}]});
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
        { header: 'PickUp ID', key: 'id', width: 10 },
        { header: 'PickUp Date', key: 'pickup_date', width: 10 },
        { header: 'Status', key: 'pickup_stage', width: 10 },
        { header: 'Code', key: 'code', width: 32 },
        { header: 'Customer Name', key: 'customer_name', width: 32 },
        { header: 'Customer Mobile', key: 'customer_mobile', width: 32 },
        { header: 'Vendor Name', key: 'on_the_go_client_name', width: 32 },
        { header: 'Vendor Contact', key: 'on_the_go_client_mobile', width: 32 },
        { header: 'Product Name', key: 'name', width: 10 },
        { header: 'Items', key: 'items', width: 32 },
        { header: 'Comment', key: 'comment', width: 32 },
    ];
    worksheet.getRows(1).alignment = { horizontal: 'center', vertical: 'center' };
    for (let i = 0; i <= PICKUP_ARRAY?.length - 1; i++) {
        let pickup = PICKUP_ARRAY[i];
        worksheet.addRow({
            id: pickup?._id,
            pickup_date: moment(pickup?.pickup_date).format("DD MMM YY"),
            pickup_stage: pickup?.pickup_stage,
            code: pickup?.code,
            customer_name: pickup?.customer_name,
            customer_mobile: pickup?.customer_mobile,
            on_the_go_client_name: pickup?.on_the_go_client_name,
            on_the_go_client_mobile: pickup?.on_the_go_client_mobile,
            name: pickup?.name,
            items: pickup?.items,
            comment: pickup?.comment
        })
    };
    try{
        const buffer = await workbook.xlsx.writeBuffer();
        const file_type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8';
        let EXTENSION = '.xlsx';
        const blob = new Blob([buffer], { type: file_type });

        if(navigator.msSaveBlog){
            navigator.msSaveBlog(blob, `VENDAR PICK_UPS Excel`+ EXTENSION);
        }else{
            const link = document.createElement('a');
            if (link.download !== undefined){
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', `VENDAR PICK_UPS Excel`+ EXTENSION);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            };
        }
    }catch(error){
        throw new Error("Could not export your pickups");
    };
}