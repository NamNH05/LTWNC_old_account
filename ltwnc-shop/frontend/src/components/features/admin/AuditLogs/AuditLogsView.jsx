import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, Space, Spin, Pagination, Row, Col } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { mockAuditLogs } from '../../../../data/adminMockData';
import './AuditLogsView.css';

const AuditLogsView = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [filterUser, setFilterUser] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterEntity, setFilterEntity] = useState('');

    useEffect(() => {
        fetchLogs(0, '', '', '');
    }, []);

    const fetchLogs = async (pageNum = 0, user = filterUser, actionType = filterType, entity = filterEntity) => {
        setLoading(true);

        const filtered = mockAuditLogs.filter((log) => {
            const matchesUser = !user || `${log.userId}`.includes(`${user}`);
            const matchesType = !actionType || log.actionType === actionType;
            const matchesEntity = !entity || log.entityName === entity;
            return matchesUser && matchesType && matchesEntity;
        });

        const start = pageNum * size;
        const pageItems = filtered.slice(start, start + size);

        setLogs(pageItems);
        setTotal(filtered.length);
        setPage(pageNum);
        setLoading(false);
    };

    const handleSearch = () => {
        fetchLogs(0);
    };

    const handleReset = () => {
        setFilterUser('');
        setFilterType('');
        setFilterEntity('');
        fetchLogs(0, '', '', '');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    const getActionColor = (actionType) => {
        const colors = {
            'CREATE': '#52c41a',
            'UPDATE': '#1890ff',
            'DELETE': '#f5222d',
            'LOGIN': '#faad14',
            'LOGOUT': '#722ed1'
        };
        return colors[actionType] || '#1890ff';
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 60,
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Hành động',
            dataIndex: 'actionType',
            width: 100,
            render: (text) => (
                <span style={{
                    backgroundColor: getActionColor(text),
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                }}>
                    {text}
                </span>
            ),
        },
        {
            title: 'Entity',
            dataIndex: 'entityName',
            width: 100,
        },
        {
            title: 'Entity ID',
            dataIndex: 'entityId',
            width: 120,
            render: (text) => <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{text || '-'}</span>,
        },
        {
            title: 'User ID',
            dataIndex: 'userId',
            width: 100,
            render: (text) => text || '-',
        },
        {
            title: 'Service',
            dataIndex: 'sourceService',
            width: 120,
        },
        {
            title: 'Thời gian',
            dataIndex: 'createdAt',
            width: 180,
            render: (text) => formatDate(text),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        },
    ];

    return (
        <div className="audit-logs-view">
            <div className="audit-logs-header">
                <h1>📋 Audit Logs</h1>
            </div>

            <div className="audit-logs-filters">
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={6}>
                        <Input
                            placeholder="Tìm theo User ID"
                            value={filterUser}
                            onChange={(e) => setFilterUser(e.target.value)}
                            prefix={<SearchOutlined />}
                        />
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="-- Loại hành động --"
                            value={filterType || undefined}
                            onChange={(value) => setFilterType(value || '')}
                        >
                            <Select.Option value="">-- Chọn --</Select.Option>
                            <Select.Option value="CREATE">CREATE</Select.Option>
                            <Select.Option value="UPDATE">UPDATE</Select.Option>
                            <Select.Option value="DELETE">DELETE</Select.Option>
                            <Select.Option value="LOGIN">LOGIN</Select.Option>
                            <Select.Option value="LOGOUT">LOGOUT</Select.Option>
                        </Select>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="-- Entity --"
                            value={filterEntity || undefined}
                            onChange={(value) => setFilterEntity(value || '')}
                        >
                            <Select.Option value="">-- Chọn --</Select.Option>
                            <Select.Option value="ORDER">ORDER</Select.Option>
                            <Select.Option value="PRODUCT">PRODUCT</Select.Option>
                            <Select.Option value="USER">USER</Select.Option>
                        </Select>
                    </Col>

                    <Col xs={24} sm={12} md={6}>
                        <Space>
                            <Button 
                                type="primary" 
                                icon={<SearchOutlined />}
                                onClick={handleSearch}
                            >
                                Tìm
                            </Button>
                            <Button 
                                icon={<ReloadOutlined />}
                                onClick={handleReset}
                            >
                                Reset
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </div>

            <Spin spinning={loading}>
                <Table
                    columns={columns}
                    dataSource={logs.map((log) => ({ ...log, key: log.id }))}
                    pagination={false}
                    scroll={{ x: 1000 }}
                    bordered
                    size="middle"
                />
            </Spin>

            {total > size && (
                <div className="audit-logs-pagination">
                    <Pagination
                        current={page + 1}
                        pageSize={size}
                        total={total}
                        onChange={(pageNum) => fetchLogs(pageNum - 1)}
                        showTotal={(total) => `Tổng cộng ${total} logs`}
                    />
                </div>
            )}
        </div>
    );
};

export default AuditLogsView;
