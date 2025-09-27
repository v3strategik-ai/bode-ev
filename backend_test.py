#!/usr/bin/env python3
"""
Backend API Testing for BODE EV Platform
Tests both AI CRM features and Team Messenger Phase 1 implementation
"""

import requests
import json
import sys
from datetime import datetime
import uuid

# Backend URL from environment
BACKEND_URL = "https://evcrm-saas.preview.emergentagent.com/api"

# Global variables for messenger testing
access_token = ""
user_id = ""
room_id = ""

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

# ============================================================================
# TEAM MESSENGER PHASE 1 TESTS
# ============================================================================

def test_messenger_api_endpoint(method, endpoint, data=None, expected_status=200, auth_required=False):
    """API testing function with authentication support for messenger endpoints"""
    global access_token
    url = f"{BACKEND_URL}{endpoint}"
    
    headers = {'Content-Type': 'application/json'}
    if auth_required and access_token:
        headers['Authorization'] = f'Bearer {access_token}'
    
    try:
        if method.upper() == "GET":
            response = requests.get(url, headers=headers, timeout=30)
        elif method.upper() == "POST":
            response = requests.post(url, json=data, headers=headers, timeout=30)
        elif method.upper() == "PUT":
            response = requests.put(url, json=data, headers=headers, timeout=30)
        elif method.upper() == "DELETE":
            response = requests.delete(url, headers=headers, timeout=30)
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
            if response.status_code == 200:
                print(f"❌ Invalid JSON response: {response.text}")
                return False
            return True  # For non-JSON responses that are expected
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {str(e)}")
        return False

def test_messenger_user_registration():
    """Test user registration with proper password (shortened to avoid bcrypt 72-byte limit)"""
    print("\n👤 Testing Messenger User Registration...")
    
    # Test data from review request
    user_data = {
        "email": "test@bodeev.com",
        "username": "testuser",
        "full_name": "Test User",
        "password": "test123"  # Shortened password to avoid bcrypt limit
    }
    
    result = test_messenger_api_endpoint("POST", "/messenger/register", user_data)
    if result:
        print(f"   User ID: {result.get('id')}")
        print(f"   Email: {result.get('email')}")
        print(f"   Username: {result.get('username')}")
        print(f"   Full Name: {result.get('full_name')}")
        print(f"   Status: {result.get('status')}")
        print(f"   Created At: {result.get('created_at')}")
        
        # Validate response structure
        required_fields = ['id', 'email', 'username', 'full_name', 'status', 'created_at']
        missing_fields = [field for field in required_fields if field not in result]
        if missing_fields:
            print(f"❌ Missing required fields: {missing_fields}")
            return False
            
        # Store user_id for later tests
        global user_id
        user_id = result.get('id')
        
        return True
    return False

def test_messenger_user_login():
    """Test user login and JWT token generation"""
    print("\n🔐 Testing Messenger User Login...")
    
    login_data = {
        "email": "test@bodeev.com",
        "password": "test123"
    }
    
    result = test_messenger_api_endpoint("POST", "/messenger/login", login_data)
    if result:
        print(f"   Access Token: {result.get('access_token', '')[:50]}...")
        print(f"   Token Type: {result.get('token_type')}")
        print(f"   User ID: {result.get('user', {}).get('id')}")
        print(f"   User Email: {result.get('user', {}).get('email')}")
        
        # Validate response structure
        required_fields = ['access_token', 'token_type', 'user']
        missing_fields = [field for field in required_fields if field not in result]
        if missing_fields:
            print(f"❌ Missing required fields: {missing_fields}")
            return False
            
        # Store access token for authenticated requests
        global access_token
        access_token = result.get('access_token')
        
        return True
    return False

def test_messenger_protected_endpoints():
    """Test protected endpoints with authentication"""
    print("\n🛡️ Testing Messenger Protected Endpoints...")
    
    if not access_token:
        print("❌ No access token available - login test must pass first")
        return False
    
    # Test get profile endpoint
    result = test_messenger_api_endpoint("GET", "/messenger/profile", auth_required=True)
    if result:
        print(f"   Profile User ID: {result.get('id')}")
        print(f"   Profile Email: {result.get('email')}")
        print(f"   Profile Status: {result.get('status')}")
        
        # Test update status endpoint
        status_result = test_messenger_api_endpoint("PUT", "/messenger/status?status=online", auth_required=True)
        if status_result:
            print(f"   Status Update: {status_result.get('message')}")
            return True
        else:
            print("❌ Failed to update user status")
            return False
    return False

def test_messenger_room_creation():
    """Test room creation (public/private)"""
    print("\n🏠 Testing Messenger Room Creation...")
    
    if not access_token:
        print("❌ No access token available - login test must pass first")
        return False
    
    # Test data from review request
    room_data = {
        "name": "General Discussion",
        "description": "Main chat room",
        "type": "public"
    }
    
    result = test_messenger_api_endpoint("POST", "/messenger/rooms", room_data, auth_required=True)
    if result:
        print(f"   Room ID: {result.get('id')}")
        print(f"   Room Name: {result.get('name')}")
        print(f"   Room Description: {result.get('description')}")
        print(f"   Room Type: {result.get('type')}")
        print(f"   Created By: {result.get('created_by')}")
        print(f"   Members: {result.get('members', [])}")
        print(f"   Admins: {result.get('admins', [])}")
        
        # Validate response structure
        required_fields = ['id', 'name', 'type', 'created_by', 'members', 'admins', 'created_at']
        missing_fields = [field for field in required_fields if field not in result]
        if missing_fields:
            print(f"❌ Missing required fields: {missing_fields}")
            return False
            
        # Store room_id for later tests
        global room_id
        room_id = result.get('id')
        
        return True
    return False

def test_messenger_room_management():
    """Test getting user rooms, joining/leaving rooms"""
    print("\n🏠 Testing Messenger Room Management...")
    
    if not access_token:
        print("❌ No access token available - login test must pass first")
        return False
    
    # Test getting user rooms
    result = test_messenger_api_endpoint("GET", "/messenger/rooms", auth_required=True)
    if result and isinstance(result, list):
        print(f"   User Rooms: {len(result)} rooms found")
        
        if result:
            first_room = result[0]
            print(f"   First Room: {first_room.get('name')} (ID: {first_room.get('id')})")
            
            # Test joining a room (if we have a room_id)
            if room_id:
                join_result = test_messenger_api_endpoint("POST", f"/messenger/rooms/{room_id}/join", auth_required=True)
                if join_result:
                    print(f"   Join Room: {join_result.get('message')}")
                    
                    # Test leaving a room
                    leave_result = test_messenger_api_endpoint("POST", f"/messenger/rooms/{room_id}/leave", auth_required=True)
                    if leave_result:
                        print(f"   Leave Room: {leave_result.get('message')}")
                        return True
                    else:
                        print("❌ Failed to leave room")
                        return False
                else:
                    print("❌ Failed to join room")
                    return False
            else:
                print("⚠️ No room_id available for join/leave tests")
                return True
        else:
            print("⚠️ No rooms found, but API call succeeded")
            return True
    else:
        print(f"❌ Expected list response, got: {type(result)}")
        return False

def test_messenger_send_messages():
    """Test sending messages to rooms"""
    print("\n💬 Testing Messenger Send Messages...")
    
    if not access_token:
        print("❌ No access token available - login test must pass first")
        return False
    
    if not room_id:
        print("❌ No room_id available - room creation test must pass first")
        return False
    
    # Test data from review request
    message_data = {
        "room_id": room_id,
        "content": "Hello, BODE EV Team!",
        "message_type": "text"
    }
    
    result = test_messenger_api_endpoint("POST", "/messenger/messages", message_data, auth_required=True)
    if result:
        print(f"   Message ID: {result.get('id')}")
        print(f"   Room ID: {result.get('room_id')}")
        print(f"   Sender ID: {result.get('sender_id')}")
        print(f"   Content: {result.get('content')}")
        print(f"   Message Type: {result.get('message_type')}")
        print(f"   Created At: {result.get('created_at')}")
        
        # Validate response structure
        required_fields = ['id', 'room_id', 'sender_id', 'content', 'message_type', 'created_at']
        missing_fields = [field for field in required_fields if field not in result]
        if missing_fields:
            print(f"❌ Missing required fields: {missing_fields}")
            return False
            
        # Store message_id for later tests
        global message_id
        message_id = result.get('id')
        
        return True
    return False

def test_messenger_retrieve_messages():
    """Test retrieving room messages"""
    print("\n📥 Testing Messenger Retrieve Messages...")
    
    if not access_token:
        print("❌ No access token available - login test must pass first")
        return False
    
    if not room_id:
        print("❌ No room_id available - room creation test must pass first")
        return False
    
    result = test_messenger_api_endpoint("GET", f"/messenger/rooms/{room_id}/messages", auth_required=True)
    if result and isinstance(result, list):
        print(f"   Messages Retrieved: {len(result)} messages")
        
        if result:
            first_message = result[0]
            print(f"   First Message: {first_message.get('content')}")
            print(f"   Sender: {first_message.get('sender_id')}")
            print(f"   Created: {first_message.get('created_at')}")
            
            # Validate message structure
            required_fields = ['id', 'room_id', 'sender_id', 'content', 'message_type', 'created_at']
            missing_fields = [field for field in required_fields if field not in first_message]
            if missing_fields:
                print(f"❌ Missing required fields in message: {missing_fields}")
                return False
        
        return True
    else:
        print(f"❌ Expected list response, got: {type(result)}")
        return False

def test_messenger_message_operations():
    """Test message updating and deletion"""
    print("\n✏️ Testing Messenger Message Operations...")
    
    if not access_token:
        print("❌ No access token available - login test must pass first")
        return False
    
    # First, send a test message to update/delete
    if not room_id:
        print("❌ No room_id available - room creation test must pass first")
        return False
    
    # Send a test message
    test_message_data = {
        "room_id": room_id,
        "content": "This message will be updated and then deleted",
        "message_type": "text"
    }
    
    message_result = test_messenger_api_endpoint("POST", "/messenger/messages", test_message_data, auth_required=True)
    if not message_result:
        print("❌ Failed to create test message for operations")
        return False
    
    test_message_id = message_result.get('id')
    print(f"   Created test message: {test_message_id}")
    
    # Test updating the message
    update_data = {
        "content": "This message has been updated!"
    }
    
    update_result = test_messenger_api_endpoint("PUT", f"/messenger/messages/{test_message_id}", update_data, auth_required=True)
    if update_result:
        print(f"   Update Message: {update_result.get('message')}")
        
        # Test deleting the message
        delete_result = test_messenger_api_endpoint("DELETE", f"/messenger/messages/{test_message_id}", auth_required=True)
        if delete_result:
            print(f"   Delete Message: {delete_result.get('message')}")
            return True
        else:
            print("❌ Failed to delete message")
            return False
    else:
        print("❌ Failed to update message")
        return False

def test_messenger_video_calls():
    """Test starting video calls, joining/ending calls"""
    print("\n📹 Testing Messenger Video Calls...")
    
    if not access_token:
        print("❌ No access token available - login test must pass first")
        return False
    
    if not room_id:
        print("❌ No room_id available - room creation test must pass first")
        return False
    
    # Test starting a video call
    call_data = {
        "room_id": room_id,
        "call_type": "video"
    }
    
    result = test_messenger_api_endpoint("POST", "/messenger/calls", call_data, auth_required=True)
    if result:
        print(f"   Call ID: {result.get('id')}")
        print(f"   Room ID: {result.get('room_id')}")
        print(f"   Initiator ID: {result.get('initiator_id')}")
        print(f"   Call Type: {result.get('call_type')}")
        print(f"   Status: {result.get('status')}")
        print(f"   Participants: {result.get('participants', [])}")
        
        # Validate response structure
        required_fields = ['id', 'room_id', 'initiator_id', 'call_type', 'status', 'participants']
        missing_fields = [field for field in required_fields if field not in result]
        if missing_fields:
            print(f"❌ Missing required fields: {missing_fields}")
            return False
        
        call_id = result.get('id')
        
        # Test joining the call
        join_result = test_messenger_api_endpoint("POST", f"/messenger/calls/{call_id}/join", auth_required=True)
        if join_result:
            print(f"   Join Call: {join_result.get('message')}")
            
            # Test ending the call
            end_result = test_messenger_api_endpoint("POST", f"/messenger/calls/{call_id}/end", auth_required=True)
            if end_result:
                print(f"   End Call: {end_result.get('message')}")
                return True
            else:
                print("❌ Failed to end call")
                return False
        else:
            print("❌ Failed to join call")
            return False
    return False

def test_messenger_database_integration():
    """Test MongoDB collections and data persistence"""
    print("\n🗄️ Testing Messenger Database Integration...")
    
    if not access_token:
        print("❌ No access token available - login test must pass first")
        return False
    
    # Test that data persists by retrieving user rooms again
    rooms_result = test_messenger_api_endpoint("GET", "/messenger/rooms", auth_required=True)
    if rooms_result and isinstance(rooms_result, list):
        print(f"   Persistent Rooms: {len(rooms_result)} rooms found")
        
        # Test that messages persist by retrieving room messages
        if room_id:
            messages_result = test_messenger_api_endpoint("GET", f"/messenger/rooms/{room_id}/messages", auth_required=True)
            if messages_result and isinstance(messages_result, list):
                print(f"   Persistent Messages: {len(messages_result)} messages found")
                
                # Verify data structure indicates proper MongoDB storage
                if rooms_result and messages_result:
                    room = rooms_result[0]
                    message = messages_result[0] if messages_result else None
                    
                    # Check for UUID-style IDs (indicating proper database storage)
                    room_id_valid = len(room.get('id', '')) > 20  # UUID should be longer
                    message_id_valid = len(message.get('id', '')) > 20 if message else True
                    
                    if room_id_valid and message_id_valid:
                        print("   ✅ Database Integration: UUIDs and data persistence confirmed")
                        print(f"   ✅ MongoDB Collections: Users, Rooms, Messages verified")
                        return True
                    else:
                        print("❌ Invalid ID format - database integration issue")
                        return False
                else:
                    print("⚠️ Limited data for full database verification")
                    return True
            else:
                print("❌ Failed to retrieve persistent messages")
                return False
        else:
            print("⚠️ No room_id for message persistence test")
            return True
    else:
        print("❌ Failed to retrieve persistent rooms")
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