import React, { useState } from 'react';
import { Zap, Plus, Search, Filter, MapPin, Activity, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';

const ChargingStations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const stations = [
    {
      id: 'CS001',
      name: 'Tesla Supercharger - Downtown Phoenix',
      location: '123 Main St, Phoenix, AZ',
      status: 'online',
      power: '250kW',
      connectors: 8,
      utilization: 78,
      revenue: '$12,450',
      lastService: '2025-09-15'
    },
    {
      id: 'CS002', 
      name: 'Walmart Fleet Hub - Denver',
      location: '456 Commerce Dr, Denver, CO',
      status: 'maintenance',
      power: '150kW',
      connectors: 12,
      utilization: 0,
      revenue: '$0',
      lastService: '2025-09-20'
    },
    {
      id: 'CS003',
      name: 'Amazon Distribution - Seattle',
      location: '789 Industrial Blvd, Seattle, WA',
      status: 'online',
      power: '350kW',
      connectors: 24,
      utilization: 92,
      revenue: '$28,900',
      lastService: '2025-09-10'
    },
    {
      id: 'CS004',
      name: 'Target Corporate - Minneapolis',
      location: '321 Corporate Ave, Minneapolis, MN',
      status: 'offline',
      power: '100kW',
      connectors: 6,
      utilization: 0,
      revenue: '$0',
      lastService: '2025-08-25'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800';
      case 'offline': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online': return <CheckCircle className="h-4 w-4" />;
      case 'offline': return <AlertCircle className="h-4 w-4" />;
      case 'maintenance': return <Activity className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const filteredStations = stations.filter(station => {
    const matchesSearch = station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         station.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || station.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50/50 via-white to-blue-50/20 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Zap className="h-8 w-8 mr-3 text-green-600" />
            Charging Stations
          </h1>
          <p className="text-gray-600 mt-2">Monitor and manage EV charging infrastructure</p>
        </div>
        <div className="flex space-x-3">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Station
          </Button>
          <Button variant="outline">
            <MapPin className="h-4 w-4 mr-2" />
            Map View
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Stations</p>
                <p className="text-3xl font-bold text-gray-900">856</p>
              </div>
              <Zap className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Online</p>
                <p className="text-3xl font-bold text-green-600">742</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Maintenance</p>
                <p className="text-3xl font-bold text-yellow-600">89</p>
              </div>
              <Activity className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Offline</p>
                <p className="text-3xl font-bold text-red-600">25</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex space-x-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search stations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg bg-white"
        >
          <option value="all">All Status</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>

      {/* Stations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Station Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Station</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Power</th>
                  <th className="text-left py-3 px-4 font-semibold">Connectors</th>
                  <th className="text-left py-3 px-4 font-semibold">Utilization</th>
                  <th className="text-left py-3 px-4 font-semibold">Revenue</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStations.map((station) => (
                  <tr key={station.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-semibold text-gray-900">{station.name}</div>
                        <div className="text-sm text-gray-500">{station.location}</div>
                        <div className="text-xs text-gray-400">ID: {station.id}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={`flex items-center space-x-1 ${getStatusColor(station.status)}`}>
                        {getStatusIcon(station.status)}
                        <span className="capitalize">{station.status}</span>
                      </Badge>
                    </td>
                    <td className="py-4 px-4 font-medium">{station.power}</td>
                    <td className="py-4 px-4">{station.connectors}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div 
                            className={`h-full rounded-full ${
                              station.utilization > 80 ? 'bg-red-500' : 
                              station.utilization > 50 ? 'bg-yellow-500' : 
                              'bg-green-500'
                            }`}
                            style={{ width: `${station.utilization}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{station.utilization}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-green-600">{station.revenue}</td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">Manage</Button>
                        <Button size="sm" className="bg-blue-600">Details</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChargingStations;