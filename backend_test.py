#!/usr/bin/env python3
"""
Backend API Tests for Valentine's Week App
Tests the progress API endpoints for the 8-day Valentine's Week progression
"""

import requests
import json
from datetime import datetime
import time

# Get backend URL from environment
BACKEND_URL = "https://love-puzzle-week.preview.emergentagent.com/api"

def print_test_header(test_name):
    print(f"\n{'='*60}")
    print(f"TEST: {test_name}")
    print(f"{'='*60}")

def print_test_result(passed, message):
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"{status}: {message}")

def test_api_root():
    """Test the root API endpoint"""
    print_test_header("API Root Endpoint")
    
    try:
        response = requests.get(f"{BACKEND_URL}/")
        print(f"Response Status: {response.status_code}")
        print(f"Response Body: {response.json()}")
        
        if response.status_code == 200:
            data = response.json()
            if "message" in data and "Valentine's Week App API" in data["message"]:
                print_test_result(True, "API root endpoint working correctly")
                return True
            else:
                print_test_result(False, f"Unexpected response format: {data}")
                return False
        else:
            print_test_result(False, f"API root returned status {response.status_code}")
            return False
            
    except Exception as e:
        print_test_result(False, f"API root endpoint failed: {str(e)}")
        return False

def test_reset_progress():
    """Reset progress for clean testing"""
    print_test_header("Reset Progress (Setup)")
    
    try:
        response = requests.post(f"{BACKEND_URL}/progress/reset")
        print(f"Reset Response Status: {response.status_code}")
        print(f"Reset Response Body: {response.json()}")
        
        if response.status_code == 200:
            print_test_result(True, "Progress reset successfully")
            return True
        else:
            print_test_result(False, f"Reset failed with status {response.status_code}")
            return False
            
    except Exception as e:
        print_test_result(False, f"Reset progress failed: {str(e)}")
        return False

def test_initial_progress():
    """Test GET /api/progress - should return initial progress with 8 days, only day 1 unlocked"""
    print_test_header("Initial Progress Check")
    
    try:
        response = requests.get(f"{BACKEND_URL}/progress")
        print(f"Response Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Progress Data: {json.dumps(data, indent=2, default=str)}")
            
            # Validate structure
            required_fields = ["user_id", "days", "replay_mode", "all_completed"]
            missing_fields = [field for field in required_fields if field not in data]
            
            if missing_fields:
                print_test_result(False, f"Missing required fields: {missing_fields}")
                return False, None
                
            # Check days array
            if len(data["days"]) != 8:
                print_test_result(False, f"Expected 8 days, got {len(data['days'])}")
                return False, None
                
            # Check day 1 is unlocked, others are locked
            day1 = data["days"][0]
            if not day1["is_unlocked"] or day1["is_completed"]:
                print_test_result(False, "Day 1 should be unlocked but not completed initially")
                return False, None
                
            # Check other days are locked
            for i in range(1, 8):
                day = data["days"][i]
                if day["is_unlocked"]:
                    print_test_result(False, f"Day {i+1} should be locked initially")
                    return False, None
                    
            # Check initial flags
            if data["replay_mode"] or data["all_completed"]:
                print_test_result(False, "replay_mode and all_completed should be False initially")
                return False, None
                
            print_test_result(True, "Initial progress structure is correct")
            return True, data
        else:
            print_test_result(False, f"Progress endpoint returned status {response.status_code}")
            return False, None
            
    except Exception as e:
        print_test_result(False, f"Initial progress test failed: {str(e)}")
        return False, None

def test_complete_day(day_number, expected_next_unlocked=None):
    """Test POST /api/progress/complete with specific day_number"""
    print_test_header(f"Complete Day {day_number}")
    
    try:
        payload = {"day_number": day_number}
        response = requests.post(f"{BACKEND_URL}/progress/complete", json=payload)
        print(f"Response Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Updated Progress: {json.dumps(data, indent=2, default=str)}")
            
            # Check that the day is marked as completed
            completed_day = data["days"][day_number - 1]
            if not completed_day["is_completed"]:
                print_test_result(False, f"Day {day_number} should be marked as completed")
                return False, None
                
            if not completed_day["completion_time"]:
                print_test_result(False, f"Day {day_number} should have completion_time set")
                return False, None
                
            # Check next day is unlocked (if not the last day)
            if expected_next_unlocked and expected_next_unlocked <= 8:
                next_day = data["days"][expected_next_unlocked - 1]
                if not next_day["is_unlocked"]:
                    print_test_result(False, f"Day {expected_next_unlocked} should be unlocked after completing day {day_number}")
                    return False, None
                    
            print_test_result(True, f"Day {day_number} completed successfully")
            return True, data
        else:
            print_test_result(False, f"Complete day endpoint returned status {response.status_code}")
            return False, None
            
    except Exception as e:
        print_test_result(False, f"Complete day {day_number} failed: {str(e)}")
        return False, None

def test_sequential_completion():
    """Test completing all 8 days sequentially"""
    print_test_header("Sequential Day Completion (Days 1-8)")
    
    success_count = 0
    final_data = None
    
    for day in range(1, 9):
        expected_next = day + 1 if day < 8 else None
        success, data = test_complete_day(day, expected_next)
        
        if success:
            success_count += 1
            final_data = data
            
            # After completing day 8, check special conditions
            if day == 8:
                if not data["all_completed"]:
                    print_test_result(False, "all_completed should be True after completing day 8")
                    return False, None
                    
                if not data["replay_mode"]:
                    print_test_result(False, "replay_mode should be True after completing day 8")
                    return False, None
                    
                # Check all days are unlocked in replay mode
                for i, day_data in enumerate(data["days"]):
                    if not day_data["is_unlocked"]:
                        print_test_result(False, f"All days should be unlocked in replay mode, but day {i+1} is locked")
                        return False, None
                        
                print_test_result(True, "All 8 days completed successfully with correct replay mode setup")
        else:
            break
            
        # Small delay between requests
        time.sleep(0.5)
    
    return success_count == 8, final_data

def test_progress_persistence():
    """Test that progress persists across requests"""
    print_test_header("Progress Persistence Check")
    
    try:
        response = requests.get(f"{BACKEND_URL}/progress")
        print(f"Response Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            
            # Check that all days are still completed
            completed_count = sum(1 for day in data["days"] if day["is_completed"])
            if completed_count != 8:
                print_test_result(False, f"Expected 8 completed days, found {completed_count}")
                return False, None
                
            # Check flags are still set
            if not data["all_completed"] or not data["replay_mode"]:
                print_test_result(False, "all_completed and replay_mode should still be True")
                return False, None
                
            print_test_result(True, "Progress persisted correctly across requests")
            return True, data
        else:
            print_test_result(False, f"Progress persistence check failed with status {response.status_code}")
            return False, None
            
    except Exception as e:
        print_test_result(False, f"Progress persistence test failed: {str(e)}")
        return False, None

def run_all_tests():
    """Run all backend API tests"""
    print(f"\n{'='*80}")
    print("VALENTINE'S WEEK APP - BACKEND API TESTS")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"{'='*80}")
    
    test_results = []
    
    # Test 1: API Root
    result = test_api_root()
    test_results.append(("API Root", result))
    
    if not result:
        print_test_result(False, "Cannot continue testing - API root endpoint failed")
        return test_results
    
    # Test 2: Reset Progress for Clean State
    result = test_reset_progress()
    test_results.append(("Progress Reset", result))
    
    # Test 3: Initial Progress
    result, _ = test_initial_progress()
    test_results.append(("Initial Progress", result))
    
    if not result:
        print_test_result(False, "Cannot continue testing - initial progress failed")
        return test_results
    
    # Test 4: Sequential Completion
    result, final_data = test_sequential_completion()
    test_results.append(("Sequential Completion", result))
    
    # Test 5: Progress Persistence
    if result:  # Only if sequential completion passed
        result, _ = test_progress_persistence()
        test_results.append(("Progress Persistence", result))
    
    # Print Final Summary
    print_test_header("TEST SUMMARY")
    passed_count = 0
    for test_name, passed in test_results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status}: {test_name}")
        if passed:
            passed_count += 1
    
    print(f"\nOverall Result: {passed_count}/{len(test_results)} tests passed")
    
    if passed_count == len(test_results):
        print("🎉 ALL TESTS PASSED - Valentine's Week App backend is working correctly!")
    else:
        print("⚠️  SOME TESTS FAILED - Check the detailed results above")
    
    return test_results

if __name__ == "__main__":
    run_all_tests()