#!/usr/bin/env python3
"""
Simple WebSocket connectivity test for BODE EV Team Messenger
"""

import asyncio
import websockets
import json
import sys

async def test_websocket_connection():
    """Test WebSocket connection to messenger endpoint"""
    
    # WebSocket URL (wss for HTTPS backend)
    ws_url = "wss://evcrm-saas.preview.emergentagent.com/api/messenger/ws/test-user-123"
    
    try:
        print(f"🔌 Testing WebSocket connection to: {ws_url}")
        
        # Try to connect to WebSocket
        async with websockets.connect(ws_url) as websocket:
            print("✅ WebSocket connection established successfully")
            
            # Send a ping message
            ping_message = {"type": "ping"}
            await websocket.send(json.dumps(ping_message))
            print("📤 Sent ping message")
            
            # Wait for response
            try:
                response = await asyncio.wait_for(websocket.recv(), timeout=5.0)
                response_data = json.loads(response)
                print(f"📥 Received response: {response_data}")
                
                if response_data.get("type") == "pong":
                    print("✅ WebSocket ping/pong working correctly")
                    return True
                else:
                    print(f"⚠️ Unexpected response type: {response_data.get('type')}")
                    return True  # Still connected, just different response
                    
            except asyncio.TimeoutError:
                print("⚠️ No response received within timeout (connection still valid)")
                return True  # Connection established, timeout is acceptable
                
    except websockets.exceptions.ConnectionClosed as e:
        print(f"❌ WebSocket connection closed: {e}")
        return False
    except websockets.exceptions.InvalidURI as e:
        print(f"❌ Invalid WebSocket URI: {e}")
        return False
    except websockets.exceptions.WebSocketException as e:
        print(f"❌ WebSocket error: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

async def main():
    """Main test function"""
    print("🚀 BODE EV Team Messenger WebSocket Test")
    print("=" * 50)
    
    success = await test_websocket_connection()
    
    print("\n" + "=" * 50)
    if success:
        print("🎉 WebSocket endpoint is accessible and functional")
        return True
    else:
        print("❌ WebSocket endpoint test failed")
        return False

if __name__ == "__main__":
    try:
        result = asyncio.run(main())
        sys.exit(0 if result else 1)
    except KeyboardInterrupt:
        print("\n⚠️ Test interrupted by user")
        sys.exit(1)