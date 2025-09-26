#!/usr/bin/env python3
"""
Backend API Testing for BODE EV CRM AI Features
Tests all AI-powered endpoints with realistic EV charging industry data
"""

import requests
import json
import sys
from datetime import datetime
import uuid

# Backend URL from environment
BACKEND_URL = "https://evcrm-saas.preview.emergentagent.com/api"

def test_api_endpoint(method, endpoint, data=None, expected_status=200):
    """Generic API testing function"""
    url = f"{BACKEND_URL}{endpoint}"
    
    try:
        if method.upper() == "GET":
            response = requests.get(url, timeout=30)
        elif method.upper() == "POST":
            response = requests.post(url, json=data, timeout=30)
        else:
            print(f"❌ Unsupported method: {method}")
            return False
            
        print(f"📡 {method} {endpoint}")
        print(f"   Status: {response.status_code}")
        
        if response.status_code != expected_status:
            print(f"❌ Expected {expected_status}, got {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
        try:
            response_data = response.json()
            print(f"✅ Success - Response received")
            return response_data
        except json.JSONDecodeError:
            print(f"❌ Invalid JSON response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {str(e)}")
        return False

def test_basic_connectivity():
    """Test basic API connectivity"""
    print("\n🔍 Testing Basic API Connectivity...")
    result = test_api_endpoint("GET", "/")
    if result:
        print(f"   Message: {result.get('message', 'No message')}")
        return True
    return False

def test_ai_lead_scoring():
    """Test AI Lead Scoring API with realistic EV industry data"""
    print("\n🧠 Testing AI Lead Scoring API...")
    
    # Test data based on the review request
    lead_data = {
        "company_name": "Tesla Fleet Services",
        "contact_email": "fleet.manager@teslafleet.com",
        "contact_phone": "+1-650-555-0123",
        "industry": "Technology",
        "company_size": "201-1000",
        "estimated_budget": 500000.0,
        "location": "California",
        "current_ev_infrastructure": "basic",
        "timeline": "3-6 months",
        "lead_source": "website_inquiry"
    }
    
    result = test_api_endpoint("POST", "/ai/lead-scoring", lead_data)
    if result:
        print(f"   Lead ID: {result.get('lead_id')}")
        print(f"   Score: {result.get('score')}/100")
        print(f"   Priority: {result.get('priority')}")
        print(f"   Estimated Value: ${result.get('estimated_value', 0):,.2f}")
        print(f"   Reasoning: {result.get('reasoning', '')[:100]}...")
        print(f"   Actions: {len(result.get('recommended_actions', []))} recommended actions")
        
        # Validate response structure
        required_fields = ['lead_id', 'score', 'priority', 'reasoning', 'recommended_actions', 'estimated_value']
        missing_fields = [field for field in required_fields if field not in result]
        if missing_fields:
            print(f"❌ Missing required fields: {missing_fields}")
            return False
            
        # Validate score range
        score = result.get('score', 0)
        if not (0 <= score <= 100):
            print(f"❌ Invalid score range: {score} (should be 0-100)")
            return False
            
        return True
    return False

def test_dynamic_pricing():
    """Test Dynamic Pricing API with realistic EV charging station data"""
    print("\n💰 Testing Dynamic Pricing API...")
    
    # Test data for FastCharge Pro 150kW as mentioned in review request
    pricing_data = {
        "product_id": "fastcharge_pro_150kw",
        "customer_type": "commercial",
        "quantity": 5,
        "location": "California",
        "installation_complexity": "moderate",
        "timeline": "3-6 months",
        "competitor_pricing": 47000.0
    }
    
    result = test_api_endpoint("POST", "/ai/dynamic-pricing", pricing_data)
    if result:
        print(f"   Base Price: ${result.get('base_price', 0):,.2f}")
        print(f"   Recommended Price: ${result.get('recommended_price', 0):,.2f}")
        print(f"   Discount: {result.get('discount_percentage', 0):.1f}%")
        print(f"   Strategy: {result.get('pricing_strategy', '')}")
        print(f"   Confidence: {result.get('confidence_level', 0):.2f}")
        print(f"   Reasoning: {result.get('reasoning', '')[:100]}...")
        
        # Validate response structure
        required_fields = ['base_price', 'recommended_price', 'discount_percentage', 'pricing_strategy', 'confidence_level', 'reasoning']
        missing_fields = [field for field in required_fields if field not in result]
        if missing_fields:
            print(f"❌ Missing required fields: {missing_fields}")
            return False
            
        # Validate confidence level range
        confidence = result.get('confidence_level', 0)
        if not (0.0 <= confidence <= 1.0):
            print(f"❌ Invalid confidence level: {confidence} (should be 0.0-1.0)")
            return False
            
        return True
    return False

def test_demand_forecasting():
    """Test Seasonal Demand Forecasting API"""
    print("\n📈 Testing Demand Forecasting API...")
    
    forecast_data = {
        "product_category": "fast_charging_stations",
        "region": "California",
        "time_horizon": "6_months"
    }
    
    result = test_api_endpoint("POST", "/ai/demand-forecast", forecast_data)
    if result and isinstance(result, list):
        print(f"   Forecast Periods: {len(result)}")
        
        if result:
            first_forecast = result[0]
            print(f"   First Period: {first_forecast.get('period')}")
            print(f"   Predicted Demand: {first_forecast.get('predicted_demand')} units")
            print(f"   Confidence Range: {first_forecast.get('confidence_interval', {})}")
            print(f"   Seasonal Factors: {len(first_forecast.get('seasonal_factors', []))} factors")
            print(f"   Recommended Inventory: {first_forecast.get('recommended_inventory')} units")
            
            # Validate response structure for first item
            required_fields = ['period', 'predicted_demand', 'confidence_interval', 'seasonal_factors', 'recommended_inventory']
            missing_fields = [field for field in required_fields if field not in first_forecast]
            if missing_fields:
                print(f"❌ Missing required fields in forecast: {missing_fields}")
                return False
                
        return True
    else:
        print(f"❌ Expected list response, got: {type(result)}")
        return False

def test_clv_prediction():
    """Test Customer Lifetime Value Prediction API"""
    print("\n💎 Testing Customer Lifetime Value Prediction API...")
    
    customer_data = {
        "customer_id": "cust_tesla_fleet_001",
        "acquisition_cost": 15000.0,
        "monthly_revenue": 8500.0,
        "customer_segment": "enterprise_fleet",
        "tenure_months": 18,
        "support_tickets": 3,
        "expansion_purchases": 2
    }
    
    result = test_api_endpoint("POST", "/ai/clv-prediction", customer_data)
    if result:
        print(f"   Customer ID: {result.get('customer_id')}")
        print(f"   Predicted CLV: ${result.get('predicted_clv', 0):,.2f}")
        print(f"   Risk Score: {result.get('risk_score', 0):.3f}")
        print(f"   Recommended Actions: {len(result.get('recommended_actions', []))} actions")
        print(f"   Value Drivers: {len(result.get('value_drivers', []))} drivers")
        
        # Validate response structure
        required_fields = ['customer_id', 'predicted_clv', 'risk_score', 'recommended_actions', 'value_drivers']
        missing_fields = [field for field in required_fields if field not in result]
        if missing_fields:
            print(f"❌ Missing required fields: {missing_fields}")
            return False
            
        # Validate risk score range
        risk_score = result.get('risk_score', 0)
        if not (0.0 <= risk_score <= 1.0):
            print(f"❌ Invalid risk score: {risk_score} (should be 0.0-1.0)")
            return False
            
        return True
    return False

def test_data_retrieval_apis():
    """Test data retrieval APIs"""
    print("\n📊 Testing Data Retrieval APIs...")
    
    # Test leads endpoint
    print("   Testing GET /api/leads...")
    leads_result = test_api_endpoint("GET", "/leads")
    if leads_result and isinstance(leads_result, list):
        print(f"   ✅ Retrieved {len(leads_result)} leads")
    else:
        print(f"   ❌ Failed to retrieve leads or invalid format")
        return False
    
    # Test lead scores endpoint
    print("   Testing GET /api/ai/lead-scores...")
    scores_result = test_api_endpoint("GET", "/ai/lead-scores")
    if scores_result and isinstance(scores_result, list):
        print(f"   ✅ Retrieved {len(scores_result)} lead scores")
        return True
    else:
        print(f"   ❌ Failed to retrieve lead scores or invalid format")
        return False

def test_error_handling():
    """Test error handling with invalid data"""
    print("\n🚨 Testing Error Handling...")
    
    # Test with invalid lead data (missing required fields)
    invalid_lead = {
        "company_name": "Test Company"
        # Missing required fields
    }
    
    result = test_api_endpoint("POST", "/ai/lead-scoring", invalid_lead, expected_status=422)
    if result is not False:  # We expect this to fail with 422
        print("   ✅ Properly handled invalid lead data")
        return True
    else:
        print("   ❌ Error handling test failed")
        return False

def main():
    """Run all backend API tests"""
    print("🚀 Starting BODE EV CRM Backend AI API Tests")
    print(f"   Backend URL: {BACKEND_URL}")
    print("=" * 60)
    
    test_results = []
    
    # Run all tests
    tests = [
        ("Basic Connectivity", test_basic_connectivity),
        ("AI Lead Scoring", test_ai_lead_scoring),
        ("Dynamic Pricing", test_dynamic_pricing),
        ("Demand Forecasting", test_demand_forecasting),
        ("CLV Prediction", test_clv_prediction),
        ("Data Retrieval", test_data_retrieval_apis),
        ("Error Handling", test_error_handling)
    ]
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            test_results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {str(e)}")
            test_results.append((test_name, False))
    
    # Summary
    print("\n" + "=" * 60)
    print("📋 TEST SUMMARY")
    print("=" * 60)
    
    passed = 0
    failed = 0
    
    for test_name, result in test_results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {test_name}")
        if result:
            passed += 1
        else:
            failed += 1
    
    print(f"\nTotal: {passed + failed} tests")
    print(f"Passed: {passed}")
    print(f"Failed: {failed}")
    
    if failed == 0:
        print("\n🎉 All tests passed! AI backend APIs are working correctly.")
        return True
    else:
        print(f"\n⚠️  {failed} test(s) failed. Please check the issues above.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)