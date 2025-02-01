from flask import Flask, request, jsonify
import requests
import time
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

API_KEY = "7325eb38b847fc72fecc7dacbae5ec1fd8bf92bd1eb299a3f4aedd13c5ca34d4"

def format_url(url):
    """Ensure the URL starts with http:// or https://"""
    if not url.startswith("http://") and not url.startswith("https://"):
        url = "http://" + url  # Assume HTTP if missing
    return url.strip()

def check_url_safety(url):
    """Submit the URL to VirusTotal and return the results"""
    url = format_url(url)
    headers = {"x-apikey": API_KEY, "Content-Type": "application/x-www-form-urlencoded"}
    
    # Submit URL to VirusTotal
    response = requests.post("https://www.virustotal.com/api/v3/urls", headers=headers, data={"url": url})
    
    if response.status_code != 200:
        return {"error": f"Error submitting URL: {response.text}"}

    # Get analysis ID
    analysis_id = response.json()["data"]["id"]

    # Fetch analysis results
    analysis_url = f"https://www.virustotal.com/api/v3/analyses/{analysis_id}"
    
    # Poll until the analysis is complete
    while True:
        response = requests.get(analysis_url, headers=headers)
        if response.status_code != 200:
            return {"error": f"Error fetching analysis results: {response.text}"}
        
        scan_results = response.json()
        status = scan_results.get("data", {}).get("attributes", {}).get("status", "")
        
        if status == "completed":
            break  # Analysis is done
        
        time.sleep(10)  # Wait before retrying

    # Extract relevant stats
    stats = scan_results.get("data", {}).get("attributes", {}).get("stats", {})
    malicious = stats.get("malicious", 0)
    suspicious = stats.get("suspicious", 0)
    undetected = stats.get("undetected", 0)

    # Determine safety level
    if malicious > 1:
        safety_status = "Malicious 🚨"
    elif suspicious >= 1 or undetected >= 30:
        safety_status = "Suspicious ⚠️"
    else:
        safety_status = "Safe ✅"

    return {
        "url": url,
        "malicious_reports": malicious,
        "suspicious_reports": suspicious,
        "undetected_reports": undetected,
        "safety_status": safety_status
    }

@app.route("/", methods=["GET", "POST"])
def home():
    if request.method == "POST":
        data = request.get_json()
        url = data.get("url")
        if not url:
            return jsonify({"error": "Please enter a URL."})
        
        result = check_url_safety(url)
        return jsonify(result)

    return jsonify({"error": "Invalid request method."})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
