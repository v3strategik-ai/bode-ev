import React, { useState } from 'react';
import { Zap, DollarSign, TrendingUp, Activity, Target, Users, FileText, Calculator, Calendar, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import RevenueChart from './charts/RevenueChart';
import MarketSegmentsChart from './charts/MarketSegmentsChart';

const MainContent = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const kpiCards = [
    {
      title: 'Active Leads',
      value: '127',
      change: '+23% this month',
      icon: Target,
      trend: 'up',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100'
    },
    {
      title: 'Pending Quotes',
      value: '$2.4M',
      change: '18 quotes pending',
      icon: Calculator,
      trend: 'up',
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100'
    },
    {
      title: 'Win Rate',
      value: '68.3%',
      change: '+12% vs last quarter',
      icon: TrendingUp,
      trend: 'up',
      gradient: 'from-indigo-500 to-purple-500',
      bgGradient: 'from-indigo-50 to-purple-50'
    },
    {
      title: 'Avg Quote Time',
      value: '2.3hrs',
      change: '45% faster delivery',
      icon: Activity,
      trend: 'up',
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50'
    }
  ];

  const hotLeads = [
    { id: 1, company: 'Tesla Supercharger Network', contact: 'Sarah Johnson', value: '$2.4M', score: 95, status: 'Hot', lastActivity: '2 hours ago', location: 'Phoenix, AZ' },
    { id: 2, company: 'Walmart Distribution Center', contact: 'Mike Chen', value: '$890K', score: 88, status: 'Warm', lastActivity: '1 day ago', location: 'Denver, CO' },
    { id: 3, company: 'Amazon Logistics Hub', contact: 'Emily Rodriguez', value: '$1.8M', score: 92, status: 'Hot', lastActivity: '4 hours ago', location: 'Seattle, WA' },
    { id: 4, company: 'Target Corporate Fleet', contact: 'David Park', value: '$650K', score: 76, status: 'Qualified', lastActivity: '3 days ago', location: 'Minneapolis, MN' }
  ];

  const pendingQuotes = [
    { id: 1, project: 'Tesla Supercharger - Phase 2', client: 'Tesla Inc.', value: '$2.4M', stations: 48, deadline: '2025-09-28', status: 'In Review' },
    { id: 2, project: 'Walmart Fleet Charging', client: 'Walmart', value: '$890K', stations: 24, deadline: '2025-09-25', status: 'Pending Approval' },
    { id: 3, project: 'Amazon Distribution Hub', client: 'Amazon', value: '$1.2M', stations: 32, deadline: '2025-09-30', status: 'Quote Sent' }
  ];

  const organizationMetrics = [
    { label: 'Lead Response Time', value: '< 2 hours', color: 'green' },
    { label: 'Quote Accuracy', value: '94.2%', color: 'blue' },
    { label: 'Follow-up Rate', value: '98.7%', color: 'indigo' },
    { label: 'Project Completion', value: '96.8%', color: 'purple' }
  ];

  if (activeTab === 'leads') {
    return (
      <div className="flex-1 p-8 bg-gradient-to-br from-gray-50/50 via-white to-blue-50/20 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Lead Generation Hub</h2>
            <p className="text-gray-600 mt-2">Manage and nurture your EV charging prospects</p>
          </div>
          <div className="flex space-x-3">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Target className="h-4 w-4 mr-2" />
              Add New Lead
            </Button>
            <Button variant="outline">
              Import Leads
            </Button>
          </div>
        </div>

        {/* Lead Generation Tools */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Target className="h-5 w-5 mr-2 text-blue-600" />
                Lead Capture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Automated lead capture from website, events, and referrals</p>
              <Button size="sm" className="w-full">Configure</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Users className="h-5 w-5 mr-2 text-green-600" />
                Lead Scoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">AI-powered lead qualification and scoring system</p>
              <Button size="sm" variant="outline" className="w-full">View Rules</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
                Follow-up Automation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Automated email sequences and reminder systems</p>
              <Button size="sm" variant="outline" className="w-full">Setup Flows</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-purple-600" />
                Territory Planning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Geographic lead distribution and territory management</p>
              <Button size="sm" variant="outline" className="w-full">View Map</Button>
            </CardContent>
          </Card>
        </div>

        {/* Hot Leads Table */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">High-Priority Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Company</th>
                    <th className="text-left py-3 px-4 font-semibold">Contact</th>
                    <th className="text-left py-3 px-4 font-semibold">Value</th>
                    <th className="text-left py-3 px-4 font-semibold">Score</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Location</th>
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {hotLeads.map((lead) => (
                    <tr key={lead.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-semibold text-gray-900">{lead.company}</div>
                          <div className="text-sm text-gray-500">{lead.lastActivity}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-900">{lead.contact}</td>
                      <td className="py-4 px-4 font-semibold text-green-600">{lead.value}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="w-12 h-2 bg-gray-200 rounded-full mr-2">
                            <div 
                              className={`h-full rounded-full ${lead.score >= 90 ? 'bg-green-500' : lead.score >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${lead.score}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{lead.score}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={`${
                          lead.status === 'Hot' ? 'bg-red-100 text-red-800' :
                          lead.status === 'Warm' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {lead.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{lead.location}</td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Contact</Button>
                          <Button size="sm" className="bg-green-600">Quote</Button>
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
  }

  if (activeTab === 'quotes') {
    return (
      <div className="flex-1 p-8 bg-gradient-to-br from-gray-50/50 via-white to-blue-50/20 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Quote Management</h2>
            <p className="text-gray-600 mt-2">Create, track, and manage EV charging installation quotes</p>
          </div>
          <div className="flex space-x-3">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Calculator className="h-4 w-4 mr-2" />
              New Quote
            </Button>
            <Button variant="outline">
              Quote Templates
            </Button>
          </div>
        </div>

        {/* Quote Tools */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Calculator className="h-5 w-5 mr-2 text-green-600" />
                Smart Calculator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">AI-powered pricing with real-time cost calculations</p>
              <Button size="sm" className="w-full">Launch Calculator</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Quote Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Pre-built templates for different charging scenarios</p>
              <Button size="sm" variant="outline" className="w-full">Manage Templates</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
                Price Optimization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Dynamic pricing based on market conditions</p>
              <Button size="sm" variant="outline" className="w-full">View Analytics</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                Approval Workflow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Automated approval process for large projects</p>
              <Button size="sm" variant="outline" className="w-full">Configure Flow</Button>
            </CardContent>
          </Card>
        </div>

        {/* Pending Quotes */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Pending Quotes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Project</th>
                    <th className="text-left py-3 px-4 font-semibold">Client</th>
                    <th className="text-left py-3 px-4 font-semibold">Value</th>
                    <th className="text-left py-3 px-4 font-semibold">Stations</th>
                    <th className="text-left py-3 px-4 font-semibold">Deadline</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingQuotes.map((quote) => (
                    <tr key={quote.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="font-semibold text-gray-900">{quote.project}</div>
                      </td>
                      <td className="py-4 px-4 text-gray-900">{quote.client}</td>
                      <td className="py-4 px-4 font-semibold text-green-600">{quote.value}</td>
                      <td className="py-4 px-4 text-gray-600">{quote.stations}</td>
                      <td className="py-4 px-4 text-gray-600">{quote.deadline}</td>
                      <td className="py-4 px-4">
                        <Badge className={`${
                          quote.status === 'In Review' ? 'bg-yellow-100 text-yellow-800' :
                          quote.status === 'Pending Approval' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {quote.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" className="bg-blue-600">Send</Button>
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
  }

  return (
    <div className="flex-1 p-8 bg-gradient-to-br from-gray-50/50 via-white to-blue-50/20 min-h-screen">
      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
            activeTab === 'dashboard' 
              ? 'bg-white text-blue-600 shadow-md' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('leads')}
          className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
            activeTab === 'leads' 
              ? 'bg-white text-blue-600 shadow-md' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Lead Generation
        </button>
        <button
          onClick={() => setActiveTab('quotes')}
          className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
            activeTab === 'quotes' 
              ? 'bg-white text-blue-600 shadow-md' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Quote Management
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-8 mb-10">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 shadow-lg overflow-hidden bg-white/80 backdrop-blur-sm">
              <div className={`h-1 w-full bg-gradient-to-r ${kpi.gradient}`}></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-6">
                <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  {kpi.title}
                </CardTitle>
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${kpi.bgGradient} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                  <Icon className={`h-6 w-6 bg-gradient-to-br ${kpi.gradient} bg-clip-text text-transparent`} />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {kpi.value}
                </div>
                <p className={`text-sm font-semibold bg-gradient-to-r ${kpi.gradient} bg-clip-text text-transparent`}>
                  {kpi.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts and Organization Metrics */}
      <div className="grid grid-cols-3 gap-8 mb-8">
        {/* Revenue Chart */}
        <div className="col-span-2">
          <Card className="hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-green-500 to-blue-500"></div>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent flex items-center">
                <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-blue-500 rounded-full mr-3"></div>
                Revenue Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RevenueChart />
            </CardContent>
          </Card>
        </div>

        {/* Organization Metrics */}
        <div className="col-span-1">
          <Card className="hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden h-full">
            <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent flex items-center">
                <div className="w-2 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full mr-3"></div>
                Organization KPIs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {organizationMetrics.map((metric, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                  <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                    metric.color === 'green' ? 'bg-green-100 text-green-700' :
                    metric.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                    metric.color === 'indigo' ? 'bg-indigo-100 text-indigo-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {metric.value}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions for Core Business Functions */}
      <div className="grid grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => setActiveTab('leads')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Target className="h-8 w-8 text-blue-600" />
              <Badge className="bg-blue-600 text-white">High Priority</Badge>
            </div>
            <h3 className="text-lg font-bold text-blue-900 mb-2">Lead Generation</h3>
            <p className="text-sm text-blue-700 mb-4">Capture, score, and nurture prospects with automated workflows</p>
            <div className="text-2xl font-bold text-blue-600">{hotLeads.length} Active Leads</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => setActiveTab('quotes')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Calculator className="h-8 w-8 text-green-600" />
              <Badge className="bg-green-600 text-white">Revenue Focus</Badge>
            </div>
            <h3 className="text-lg font-bold text-green-900 mb-2">Quote Management</h3>
            <p className="text-sm text-green-700 mb-4">Smart pricing, templates, and approval workflows</p>
            <div className="text-2xl font-bold text-green-600">{pendingQuotes.length} Pending Quotes</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Activity className="h-8 w-8 text-indigo-600" />
              <Badge className="bg-indigo-600 text-white">Efficiency</Badge>
            </div>
            <h3 className="text-lg font-bold text-indigo-900 mb-2">Organization Hub</h3>
            <p className="text-sm text-indigo-700 mb-4">Streamlined processes and automated workflows</p>
            <div className="text-2xl font-bold text-indigo-600">98.7% Follow-up Rate</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MainContent;