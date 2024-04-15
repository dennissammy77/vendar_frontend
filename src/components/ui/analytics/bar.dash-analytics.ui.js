'use client'
import moment from 'moment';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BarChartPlot = ({data}) => {
    const TempVArr= data?.map((item)=>{
        return (
            {
                name: moment(item?.createdAt).format("DD MMM YY"),
                amount: item?.payment_total,
            }
        )
    })
    // const data = [
    //     {
    //       name: 'Page A',
    //       total: 2400,
    //     },
    //     {
    //       name: 'Page B',
    //       total: 1398,
    //     },
    //     {
    //       name: 'Page C',
    //       total: 9800,
    //     },
    //     {
    //       name: 'Page D',
    //       total: 3908,
    //     },
    //     {
    //       name: 'Page E',
    //       total: 4800,
    //     },
    //     {
    //       name: 'Page F',
    //       total: 3800,
    //     },
    //     {
    //       name: 'Page G',
    //       total: 4300,
    //     },
    //   ];
    return (
        <>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                width={500}
                height={300}
                data={TempVArr}
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