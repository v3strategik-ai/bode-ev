import React from 'react';
import { CreditCard, DollarSign, Receipt } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const BillingPayments = () => {
  return (
    <div className="p-8 bg-gradient-to-br from-gray-50/50 via-white to-blue-50/20 min-h-screen">
      <div className="flex items-center mb-8">
        <CreditCard className="h-8 w-8 mr-3 text-green-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing & Payments</h1>
          <p className="text-gray-600">Payment processing and financial management</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">$847K</p>
            <p className="text-sm text-gray-600">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Receipt className="h-5 w-5 mr-2" />
              Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">412</p>
            <p className="text-sm text-gray-600">Processed today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">99.2%</p>
            <p className="text-sm text-gray-600">Payment success</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BillingPayments;