import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Input, Button } from "antd";
import { isEmpty } from "lodash";

const Datatable = () => {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortedInfo, setSortedInfo] = useState({});
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await axios.get("https://jsonplaceholder.typicode.com/comments");
    setGridData(response.data);
    setLoading(false);
  };

  const handleChange = (...sorter) => {
    const { order, field } = sorter[2];
    setSortedInfo({ columnKey: field, order });
  };

  const modifiedData = gridData.map(({ body, ...item }) => ({
    ...item,
    key: item.id,
    comment: isEmpty(body) ? item.comment : body,
  }));

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      sorter: (a, b) => a.id - b.id,
      sortOrder: sortedInfo.columnKey === "id" && sortedInfo.order,
      className: "text-xs sm:text-sm text-center",
    },
    {
      title: "Name",
      dataIndex: "name",
      align: "center",
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortOrder: sortedInfo.columnKey === "name" && sortedInfo.order,
      className: "text-xs sm:text-sm",
    },
    {
      title: "Email",
      dataIndex: "email",
      align: "center",
      sorter: (a, b) => a.email.localeCompare(b.email),
      sortOrder: sortedInfo.columnKey === "email" && sortedInfo.order,
      className: "text-xs sm:text-sm",
    },
    {
      title: "Comment",
      dataIndex: "comment",
      align: "center",
      sorter: (a, b) => a.comment.length - b.comment.length,
      sortOrder: sortedInfo.columnKey === "comment" && sortedInfo.order,
      className: "text-xs sm:text-sm",
    },
  ];

  // 🔍 Live Search (by Name only)
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    if (value === "") {
      setFilteredData([]);
    } else {
      const filtered = modifiedData.filter((item) =>
        item.name.toLowerCase().includes(value)
      );
      setFilteredData(filtered);
    }
  };

  // 🔄 Reset filters
  const clearAll = () => {
    setSortedInfo({});
    setSearchText("");
    setFilteredData([]);
    loadData();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-3">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
          📊 Data Table Assignment
        </h1>

        {/* Search + Reset */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
          <Input
            placeholder="🔍 Search by Name"
            onChange={handleSearch}
            type="text"
            allowClear
            value={searchText}
            className="w-full sm:w-80"
          />
          <Button
            onClick={clearAll}
            className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300"
          >
            Reset Filters
          </Button>
        </div>

        {/* Data Table */}
        <Table
          columns={columns}
          dataSource={filteredData.length ? filteredData : modifiedData}
          bordered
          loading={loading}
          pagination={{ pageSize: 10 }}
          onChange={handleChange}
          tableLayout="auto" // ✅ allow columns to shrink naturally
          className="text-xs sm:text-sm"
          rowClassName="hover:bg-blue-50 transition-colors"
        />
      </div>
    </div>
  );
};

export default Datatable;
