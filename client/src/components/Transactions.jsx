import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Table, Input, message, Image } from 'antd';
import axios from 'axios';

const { Search } = Input;

// Table column definitions
const columns = [
    {
        title: "#",
        dataIndex: "id",
        width: "40px",
    },
    {
        title: "Title",
        dataIndex: "title",
        width: "200px",
    },
    {
        title: "Price",
        dataIndex: "price",
        render: (price) => parseFloat(price).toFixed(2),
        width: "80px",
    },
    {
        title: "Description",
        dataIndex: "description",
    },
    {
        title: "Category",
        dataIndex: "category",
        width: "120px",
    },
    {
        title: "Sold",
        dataIndex: "sold",
        render: (sold) => (sold ? "Yes" : "No"),
        width: "50px",
    },
    {
        title: "Date",
        dataIndex: "dateOfSale",
        render: (date) => moment(date).format("DD MMM YYYY"),
        width: "100px",
    },
    {
        title: "Image",
        dataIndex: "image",
        render: (url) => <Image src={url} alt="Product Image" width={50} />,
        width: "80px",
    },
];

// Main Transactions component
function Transactions({ month, monthText }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
        search: "",
    });

    // Fetch data from the updated API based on month and search parameters
    const getData = async () => {
        try {
            setLoading(true);
            const { data: response } = await axios.get('https://roxiler-pvpf.onrender.com/transactions', {
                params: {
                    month,
                    page: tableParams.pagination.current,
                    limit: tableParams.pagination.pageSize,
                    search: tableParams.search || "",
                },
            });

            // Assuming the new API returns results in "results" and total count in "count"
            setData(response.results);
            setTableParams((prevParams) => ({
                ...prevParams,
                pagination: {
                    ...prevParams.pagination,
                    total: response.count,
                },
            }));
            setLoading(false);
            message.success('Data loaded successfully');
        } catch (error) {
            console.error("Error loading data:", error);
            message.error('Error loading data');
            setLoading(false);
        }
    };

    // Handle table change for pagination and sorting
    const handleTableChange = (pagination) => {
        setTableParams((prevParams) => ({
            ...prevParams,
            pagination,
        }));
    };

    // Handle search input
    const handleSearch = (value) => {
        setTableParams({
            pagination: { ...tableParams.pagination, current: 1 }, // Reset to first page on new search
            search: value,
        });
    };

    // Fetch data when month or table parameters change
    useEffect(() => {
        getData();
    }, [month, tableParams]);

    return (
        <>
            {/* Search input */}
            <Search
                placeholder="Search"
                allowClear
                onSearch={handleSearch}
                style={{
                    width: 300,
                    padding: "12px 0px",
                }}
            />

            {/* Data Table */}
            <Table
                columns={columns}
                rowKey={(record) => record.id}
                dataSource={data}
                pagination={tableParams.pagination}
                loading={loading}
                onChange={handleTableChange}
                size="small"
                bordered
                title={() => <strong>Transactions for {monthText}</strong>}
                scroll={{ y: 540 }}
            />
        </>
    );
}

export default Transactions;
