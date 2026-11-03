# Dynamic-Web-Technologies
This is my implementation for coursework 4 idea in assessment for dynamic web technologies.


<!------------------------------------------------------------------------------------------------> 
# Overview of Project:
# Outdoor Site Reporting App

A React and Vite coursework project for creating reports about issues or observations at a large outdoor site. A report includes a title, category, description, location, photo, and date/time.

## Features

- It creates reports using a title, description, and category: Wildlife, Fault, Fly-tipping, or Maintenance.
- It retreives the device's location with the browser Geolocation API.
- This can capture a photo with the device camera or choose an existing image.
- This web application allow CRUD as in read, update, and delete saved reports.
- It can keep reports in browser `localStorage` so they remain available in the same browser on the same device after closing and reopening the app.

These reports are stored locally in the browser however, this project does not upload or synchronise them with a server.

## Requirements

- Node.js and npm
- A modern browser
- Requires GeoLocation settings to be enabled within device.
- Requires Camera settings to be enabled within device. 

## Install and run

1. Clone the repository:

   ```bash
   git clone https://github.com/asimmian12/Dynamic-Web-Technologies.git
   ```

2. Open the app folder:

   ```bash
   cd Dynamic-Web-Technologies/dynamic-web-technologies
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL printed by Vite in your browser (usually `http://localhost:5173`) Or Open it from VSCode with Integreated Browser feature.

## Using the app

1. Use the navigation to open the new report page.
2. Enter a title and description, then select a category.
3. Select **Get Location** and allow the browser to access your location.
4. Allow camera access and select **Take Photo**, or choose an existing image.
5. Submit the report. The title, category, description, location, photo, and creation time are saved in the browser.
6. Open the reports page to view saved reports. Use **Update** to edit a report or **Delete** to remove it.

## Device permissions and troubleshooting

- The browser will ask permission before using the camera or location. Allow access when prompted.
- Camera and geolocation generally require a secure context: use `localhost` for local development or an HTTPS deployment. They may not work on an ordinary HTTP address on another device.
- If location is unavailable, check the device's location settings and browser permissions.
- Reports are stored per browser and device. Clearing the browser's site data will remove them.
- Photos are stored with the report in browser storage, which has limited capacity. Avoid storing large or numerous images.

## Available scripts

Run these commands from the `dynamic-web-technologies` app folder:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Create a production build in `dist`. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run ESLint. |

## Technology

- React
- Vite
- React Router
- `react-webcam`
- Browser Geolocation API
- Browser `localStorage`
