# HealthBridge Nigeria - National Health Early Warning System

Welcome to the HealthBridge Nigeria 3MTT project. This is a complete, browser-based prototype that visualizes a National Health Early Warning System powered by community USSD reports.

## Features Included

1. **Dashboard Analytics (Frontend Logic)**: 
   - A fully styled, WHO/CDC-inspired dashboard using Vanilla JS, CSS grid, Chart.js, and D3.js.
   - Real-time updates ticker.
   - Interactive SVG map of Nigeria. Clicking any state filters the charts and alert clusters to that specific state.
   - Trend prediction charts and Lassa/Cholera early warning alerts dynamically generated based on report volume.

2. **USSD Simulator Engine**: 
   - A fully functional state-machine simulating a Twilio/Africa's Talking USSD session.
   - Complete multilingual support for English, Yoruba, Igbo, and Hausa.
   - Triggers simulated SMS popups for emergency medical conditions (e.g., severe bleeding, prolonged fever with rat exposure).

3. **Mock Data Generator**:
   - `data.js` script procedurally generates 100 dummy USSD reports across Nigeria's 36 states to populate the dashboard.
   - Injects randomized timestamps and medically accurate symptoms, intentionally clustering Cholera in the North (Kano/Bauchi) and Lassa Fever in the South (Edo/Ondo) for demonstration purposes.

4. **USSD JSON Flow**:
   - `ussd_flow.json` containing the translated map structure ready for backend serialization into an Africa's Talking workflow.

## How to Run & Test

1. **Open the Application**:
   Simply open `index.html` in any modern web browser (Chrome, Firefox, Edge). No Node.js server is required.

2. **Test the USSD Simulator**:
   - Navigate to the **USSD Simulator** tab.
   - Dial `*123#` on the phone screen and click Call.
   - Follow the prompts by typing numerical options (e.g., `1` for English, then `1` for Prevent Diseases, then `4` for Lassa Fever).
   - Test the back button `0` and main menu button `00`.
   - Test an emergency trigger: Select English -> Emergency Signs -> Watch the SMS Alert pop up on the screen!

3. **Test the Dashboard**:
   - Navigate to the **Dashboard Analytics** tab.
   - Observe the National Alert Status indicator in the top right.
   - Hover over the interactive Nigeria map to see report volumes by state.
   - **Click on a state** (e.g., Kano, Edo, or Lagos) to filter the "Symptom Trend" and "Disease Trend" charts specifically to that state.
   - Look at the "Symptom Report Clusters" table to view hot zones requiring immediate public health response.

## Architecture & Code Handling

- **`data.js`**: Contains the USSD menu tree and the procedural mocked reporting. 
- **`app.js`**: Houses the "backend logic" for dashboard filtering, D3 map topology loading, and Chart.js instantiation. It groups the array of objects into state buckets and calculates alert severities dynamically.
- **`ussd.js`**: The state machine engine reading `data.js` text blobs and managing user session state paths.
- **`styles.css`**: All layout styling utilizing modern grid, flexbox, and custom SVG styling.
