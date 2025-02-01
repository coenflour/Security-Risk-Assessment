from flask import Flask, request, render_template, jsonify
import requests
import json
import time

app = Flask(__name__)

# Replace with your VirusTotal API key
API_KEY = "aa111abfc7a05610f1e30043bdebd98a9702c46f5665e6867253f067395c38fd"

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
    response = requests.get(analysis_url, headers=headers)
    scan_results = response.json()

    # Extract relevant stats
    stats = scan_results["data"]["attributes"]["stats"]
    malicious = stats.get("malicious", 0)
    suspicious = stats.get("suspicious", 0)
    undetected = stats.get("undetected", 0)

    # Determine safety level
    if undetected > 20:
        safety_status = "Malicious 🚨"
    elif undetected > 10:
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
        url = request.form.get("url")
        if not url:
            return render_template("index.html", error="Please enter a URL.")
        
        result = check_url_safety(url)
        return render_template("index.html", result=result)

    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)