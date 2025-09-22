import React from 'react';
import { Box, Package, Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const EquipmentInventory = () => {
  return (
    <div className="p-8 bg-gradient-to-br from-gray-50/50 via-white to-blue-50/20 min-h-screen">
      <div className="flex items-center mb-8">
        <Box className="h-8 w-8 mr-3 text-purple-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Equipment Inventory</h1>
          <p className="text-gray-600">Track and manage charging equipment and supplies</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Total Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">2,847</p>
            <p className="text-sm text-gray-600">Equipment pieces</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              In Transit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">156</p>
            <p className="text-sm text-gray-600">Items being delivered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Box className="h-5 w-5 mr-2" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">7</p>
            <p className="text-sm text-gray-600">Items need reorder</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EquipmentInventory;