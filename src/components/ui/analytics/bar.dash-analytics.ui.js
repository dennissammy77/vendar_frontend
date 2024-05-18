'use client'
import { CHEVRON_LEFT_ICON, CHEVRON_RIGHT_ICON } from '@/components/lib/constants/icons';
import { TERTIARY_BRAND } from '@/components/lib/constants/theme';
import { HStack, Icon, Text } from '@chakra-ui/react';
import moment from 'moment';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar} from 'recharts';

export default function BarChartPlot ({data}){
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
export function PRODUCT_DATA_TRACKER ({data,week,set_week}){
    
    return (
        <ResponsiveContainer width="100%" height="100%" >
            <BarChart
                width={800}
                height={400}
                data={data}
                margin={{
                    top: 15,
                    right: -10,
                    left: -20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dayName" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="sales" stackId="a" fill="#8884d8" />
                <Bar yAxisId="left" dataKey="profit" stackId="a" fill="#82ca9d" />
                <Bar yAxisId="right" dataKey="items" fill="#ffc658" />
            </BarChart>
        </ResponsiveContainer>
      );
}