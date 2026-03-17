# healthbridge-nigeria-3mtt-
HealthBridge Nigeria is an offline-first, USSD-powered health intelligence system that enables users to access verified health information and report symptoms without internet access.
# HealthBridge Nigeria 🇳🇬
### National Health Early Warning & USSD Information System

**HealthBridge Nigeria** is an offline-first, browser-based prototype created for the **3MTT Program**. It demonstrates a robust, low-tech National Health Early Warning System designed to bridge the healthcare gap between rural communities and national public health agencies using USSD technology and real-time data analytics.

## 🌟 The Impact & Problem Solved
Millions of Nigerians in remote areas lack internet access and timely health information. HealthBridge solves this by:
- **Democratizing Health Access**: Delivering vital, localized health guidance (Malaria, Lassa Fever, Cholera, etc.) via basic feature phones using zero-internet USSD technology.
- **Breaking Language Barriers**: Fully functional in **English, Yoruba, Igbo, and Hausa**.
- **Proactive Epidemic Response**: Transforming community-reported symptoms into real-time epidemiological data to detect disease outbreaks (like Cholera or Lassa Fever) *before* they become national crises.

## ✨ Key Features

### 1. 📊 WHO/CDC-Inspired Command Dashboard
- **Real-Time Active Monitoring**: A visually compelling 3-column command center utilizing Vanilla JS, CSS Grid, Chart.js, and D3.js.
- **Interactive Geospatial Map**: A dynamic SVG map of Nigeria's 36 states. Watch data update instantly as you click different states to filter regional symptom clusters and disease trends.
- **Predictive Analytics & Alerts**: Auto-computed State Risk Summary Cards, live scrolling ticker feeds, and 7-day disease trend predictions generated automatically from the report volume.

### 2. 📱 Multilingual USSD Simulator Engine
- **State-Machine Architecture**: A robust engine simulating a live Twilio/Africa's Talking USSD session directly in the browser.
- **Emergency SMS Triggers**: The system detects critical inputs (e.g., severe bleeding, prolonged fever) and immediately dispatches simulated life-saving SMS alerts to emergency responders.
- **Complete Navigation Flow**: Includes deep multi-language menus, symptom reporting, and real-time health education without needing a backend server.

### 3. 🧠 Smart Data Generation Engine
- **Procedural Mocking**: Automatically synthesizes 100 realistic dummy USSD reports spanning all 36 states within the last 24 hours.
- **Epidemiological Accuracy**: Intentionally clusters specific diseases to mirror real-world scenarios (e.g., Cholera in the North, Lassa Fever in the South) to vividly demonstrate the system's outbreak-detection capabilities to judges.

## 🚀 Live Demo Instructions

No complex setup, backend, or database is required. The entire application runs securely in your browser!

1. **Launch the Prototype**:
   Simply open `index.html` in any modern web browser (Chrome, Firefox, Edge). 

2. **Test the USSD Mobile Experience**:
   - Go to the **USSD Simulator** tab space.
   - Dial `*123#` on the virtual phone and click **Call**.
   - Navigate the menus (e.g., press `1` for English, `1` for Prevent Diseases, `4` for Lassa Fever).
   - **Trigger an Emergency:** Navigate to *Emergency Signs* to watch the system dispatch an automated SMS Alert popup to the phone!

3. **Explore the Command Center**:
   - Go to the **Dashboard Analytics** tab.
   - Observe the global *National Status* indicator and the Live Alerts feed.
   - **Interact with the Map**: Click on any state (e.g., Kano, Lagos, or Edo) to instantly filter the *Symptom Trend* charts, Pie charts, and *Risk Summary Cards* to that specific region's data.

## 🛠 Technical Architecture
To keep the prototype lightweight, fast, and universally accessible, it was built entirely without heavy backend frameworks:
- **`data.js`**: Houses the extensive multilingual USSD menu tree and procedural mock data generator. 
- **`app.js`**: The brains of the dashboard—manages data filtering, D3 map topology rendering, and Chart.js instantiation to compute dynamic alert severities.
- **`ussd.js`**: A custom state-machine engine that parses `data.js` to manage live user session states.
- **`styles.css`**: A sleek, WHO-inspired UI built with modern CSS Grid, Flexbox, and animated visual cues.
- **`ussd_flow.json`**: A translated map structure ready for backend serialization into an Africa's Talking live workflow.
