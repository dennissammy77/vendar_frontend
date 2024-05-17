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
export function PRODUCT_DATA_TRACKER ({data_A,week}){
const [page,set_page] = useState(moment().week());

  const dataArray = [
    {
        "_id": "6645e76a4da056378a6d4e45",
        "buying_price": 70,
        "items": 10,
        "status": "paid",
        "payment": true,
        "payment_method": "cash",
        "payment_total": 980,
        "base_total": 700,
        "createdAt": "2024-05-09T11:00:58.170Z"
    },
    {
        "_id": "6645e76a4da056378a6d4e46",
        "buying_price": 75,
        "items": 12,
        "status": "paid",
        "payment": true,
        "payment_method": "cash",
        "payment_total": 900,
        "base_total": 700,
        "createdAt": "2024-05-16T11:00:58.170Z"
    },
    {
        "_id": "6645e76a4da056378a6d4e47",
        "buying_price": 65,
        "items": 15,
        "status": "unpaid",
        "payment": false,
        "payment_method": "card",
        "payment_total": 975,
        "base_total": 875,
        "createdAt": "2024-05-15T10:30:58.170Z"
    },
    {
        "_id": "6645e76a4da056378a6d4e48",
        "buying_price": 80,
        "items": 8,
        "status": "paid",
        "payment": true,
        "payment_method": "cash",
        "payment_total": 875,
        "base_total": 640,
        "createdAt": "2024-05-15T10:30:58.170Z"
    },
    {
        "_id": "6645e76a4da056378a6d4e49",
        "buying_price": 60,
        "items": 20,
        "status": "unpaid",
        "payment": false,
        "payment_method": "card",
        "payment_total": 1200,
        "base_total": 900,
        "createdAt": "2024-05-14T09:20:58.170Z"
    },
    {
        "_id": "6645e76a4da056378a6d4e4a",
        "buying_price": 55,
        "items": 18,
        "status": "paid",
        "payment": true,
        "payment_method": "cash",
        "payment_total": 990,
        "base_total": 690,
        "createdAt": "2024-05-06T09:20:58.170Z"
    },
    {
        "_id": "6645e76a4da056378a6d4e4b",
        "buying_price": 90,
        "items": 9,
        "status": "unpaid",
        "payment": false,
        "payment_method": "card",
        "payment_total": 810,
        "base_total": 510,
        "createdAt": "2024-05-13T08:10:58.170Z"
    },
    {
        "_id": "6645e76a4da056378a6d4e4c",
        "buying_price": 85,
        "items": 11,
        "status": "paid",
        "payment": true,
        "payment_method": "cash",
        "payment_total": 935,
        "base_total": 735,
        "createdAt": "2024-05-06T08:10:58.170Z"
    },
    {
        "_id": "6645e76a4da056378a6d4e4d",
        "buying_price": 72,
        "items": 14,
        "status": "paid",
        "payment": true,
        "payment_method": "cash",
        "payment_total": 1008,
        "base_total": 608,
        "createdAt": "2024-05-21T07:00:58.170Z"
    },
    {
        "_id": "6645e76a4da056378a6d4e4e",
        "buying_price": 68,
        "items": 13,
        "status": "unpaid",
        "payment": false,
        "payment_method": "card",
        "payment_total": 884,
        "base_total": 484,
        "createdAt": "2024-05-12T07:00:58.170Z"
    }
];

const getDayName = (dateString) => {
    const date = new Date(dateString);
    const days = ['sun', 'mon', 'tue', 'wed', 'thur', 'fri', 'sat'];
    return days[date.getUTCDay()];
};

const getWeekNumber = (dateString) => {
    const date = new Date(dateString);
    const firstJan = new Date(date.getFullYear(), 0, 1);
    const numberOfDays = Math.floor((date - firstJan) / (24 * 60 * 60 * 1000));
    return Math.ceil((numberOfDays + firstJan.getDay() + 1) / 7);
};

const initialWeekData = (week) => {
  const days = ['sun', 'mon', 'tue', 'wed', 'thur', 'fri', 'sat'];
    return days.map(day => ({
        week: week,
        dayName: day,
        sales: 0,
        profit: 0,
        items: 0
    }));
};

const aggregateDataByWeek = (data) => {
    const weekData = {};

    data.forEach(item => {
        const date = item.createdAt.split('T')[0];
        const dayName = getDayName(item.createdAt);
        const week = getWeekNumber(item.createdAt);

        if (!weekData[week]) {
            weekData[week] = initialWeekData(week);
        }

        const dayData = weekData[week].find(day => day.dayName === dayName);

        if (dayData) {
            dayData.sales += item.payment_total;
            dayData.profit += item.payment_total - item.base_total;
            dayData.items += item.items;
        }
    });

    return Object.values(weekData).flat();
};

let aggregatedArray = aggregateDataByWeek(dataArray);
aggregatedArray = aggregatedArray.filter((item)=>item.week === page);

console.log(aggregatedArray.filter((item)=>item.week === page));


    const HANDLE_PAGE_CHANGE=(sign)=>{
      if (page === 1 && sign === '-'){
          set_page(1)
          return;
      }
      switch (sign) {
          case '+':
              set_page(page + 1)
              break;
          case '-':
              set_page(page - 1)
              break;
          default:
              set_page(1)
              break;
      }
    }
    
    return (
        <>
            <HStack align='center' spacing='2' color='gray.600'>
                <Icon as={CHEVRON_LEFT_ICON} boxSize={'4'} cursor='pointer' onClick={(()=>HANDLE_PAGE_CHANGE('-'))}/>
                <Text fontSize={'xs'}>week {page}</Text>
                <Icon as={CHEVRON_RIGHT_ICON} boxSize={'4'} cursor='pointer' onClick={(()=>HANDLE_PAGE_CHANGE('+'))}/>
            </HStack>
            <ResponsiveContainer width="100%" height="100%" my='2'>
                <BarChart
                    width={500}
                    height={400}
                    data={aggregatedArray}
                    margin={{
                        top: 15,
                        right: 0,
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
        </>
      );
}