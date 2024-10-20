import { Statistic, message } from 'antd'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Bar, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS } from "chart.js/auto";

export default function Stats({ month, monthText }) {
    let [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    
    
    const getData = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`https://roxiler-pvpf.onrender.com/combined-data?month=${month}`);
            setLoading(false);
            setData(res.data);
            message.success('Data loaded successfully');
        } catch (error) {
            console.log(error);
            message.error('Error loading data');
        }
    }

    useEffect(() => {
        getData();
        return () => {
            setData(null);
        }
    }, [month])

    return (
        <>
            <h2>Stats for {monthText} </h2>

            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '48px',
                }}>

                <div style={{ minWidth: '720px' }}>
                    <Totals stats={data?.statsData} loading={loading} />
                    {data && <BarChart data={data?.barChartData} />}
                </div>
                
                {data && <PieChart data={data?.pieChartData} />}
            </div>
        </>
    )
}

function Totals({ stats, loading }) {
    return (
        <div className='stats'
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                maxWidth: '900px',
                padding: '12px 0px',
                borderTop: '1px solid #0C0C0C',
                borderBottom: '1px solid #0C0C0C',
            }}
        >
            <Statistic
                valueStyle={{ fontSize: '32px' }}
                title="Total Sale"
                value={stats?.totalSale}
                loading={loading}
                prefix="₹"
            />

            <Statistic
                valueStyle={{ fontSize: '32px' }}
                title="Total Sold Items"
                value={stats?.soldCount}
                loading={loading}
            />
            <Statistic
                valueStyle={{ fontSize: '32px' }}
                title="Total Unsold Items"
                value={stats?.unsoldCount}
                loading={loading}
            />
        </div>
    )
}

function BarChart({ data }) {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            }
        },
        scales: {
            x: {
                stacked: true,
                title: {
                    display: true,
                    text: 'Price Range'
                }
            },
            y: {
                stacked: true,
                title: {
                    display: true,
                    text: 'Product Count'
                },
                ticks: {
                    stepSize: 4
                }
            }
        },
        aspectRatio: 1.6,
        plugins: {
            title: {
                display: true,
                text: 'No of products per price range'
            },
        },


    };

    let labels = Object.keys(data);
    let values = Object.values(data);

    const chartData = {
        labels,
        datasets: [
            {
                label: 'No of products per price range',
                data: values,
                backgroundColor: [
                    '#1B4242'
                ]
            }
        ]
    }

    return (
        <Bar
            data={chartData}
            options={options}
            style={{ margin: '24px 0px', maxWidth: '800px', maxHeight: '500px'}}
        />
    )
}

function PieChart({ data }) {
    let labels = Object.keys(data);
    let values = Object.values(data);

    const chartData = {
        labels,
        datasets: [
            {
                label: '# of Products',
                data: values,
                backgroundColor: [
                    '#7B113A', 
                    '#150E56', 
                    '#1597BB', 
                    '#8FD6E1', 
                    '#B85C38', 
                    '#362222', 
                ],
                hoverBackgroundColor: [
                    '#7B113A', 
                    '#150E56', 
                    '#1597BB', 
                    '#8FD6E1',
                    '#B85C38', 
                    '#362222', 
                ],
            }
        ]
    };

    return (
        <Doughnut
            data={chartData}
            style={{ margin: '24px 0px', maxHeight: '400px', maxWidth: '400px' }}
        />
    );
}
