'use client'
import moment from 'moment';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BarChartPlot = ({data}) => {
    const TempVArr= data?.filter((item)=>item?.payment)?.map((item)=>{
        return (
            {
                name: moment(item?.createdAt).format("DD MMM YY"),
                amount: item?.payment_total,
            }
        )
    });
    
    const GroupedByDateArray = Object.groupBy(TempVArr || [], ({ name }) => name);

    let temp_arr = [];
    for(let i = 0; i <= Object.entries(GroupedByDateArray).length - 1; i++){
        temp_arr.push(
            {
                name: Object.entries(GroupedByDateArray)[i][0],
                amount: Object.entries(GroupedByDateArray)[i][1].reduce(
                    (accumulator, currentValue) => accumulator + currentValue.amount,
                    0,
                ),
            }
        )
    };
    return (
        <>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                width={500}
                height={300}
                data={temp_arr}
                margin={{
                    top: 5,
                    right: 0,
                    left: -20,
                    bottom: 5,
                }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </>
      );
  } 

  export default BarChartPlot;