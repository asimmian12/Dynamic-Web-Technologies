# Dynamic-Web-Technologies:
This is my implementation for coursework 4 idea in assessment for dynamic web technologies.

# Overview of Project:
# Outdoor Site Reporting App:
A React and Vite coursework project for creating reports about issues or observations at a large outdoor site. A report includes a title, category, description, location, photo, and date/time.

## Live app 
https://dynamic-web-technologies.vercel.app

## Features

- Create reports with a title, description, status (Open, In Progress, Resolved) and a category: Wildlife, Fault, Fly-tipping or Maintenance.
- Get the device location with the browser Geolocation API.
- Take a photo with the device camera (`react-webcam`) or choose existing images.
- Read: a reports page with a summary, search, a status filter, and a details page for each report with an "Open in Maps" link.
- Update: edit a report's details, status and photos.
- Delete: remove a report from the list.
- Persistence: reports are kept in `localStorage`, so they remain after closing and reopening the app in the same browser on the same device.
- Messages for missing fields, location errors, camera errors and full browser storage.

## Requirements

- Node.js and npm (tested with Node.js 24.19.0)
- A modern browser
- Location permission for the browser (for the Geolocation API)
- Camera permission for the browser (for taking photos)

## Install and run

1. Clone the repository:

   ```bash
   git clone https://github.com/asimmian12/Dynamic-Web-Technologies.git
   ```

2. Open the app folder. The app is in the `dynamic-web-technologies` subfolder, so every command below must be run from inside it:

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

5. Open the local address printed by Vite in your browser (usually `http://localhost:5173`).

### Production build

```bash
npm run build
npm run preview
```

`npm run build` creates the `dist` folder and `npm run preview` serves it locally. The live app is deployed from this repository to Vercel.

## Using the app

1. Select **New report** in the navigation bar.
2. Enter a title and description, then choose a category and a status.
3. Select **Use my location** and allow the browser to access your location.
4. Select **Take photo** and allow camera access, or select **Choose photos** to add existing images.
5. Check the live preview, then select **Save report**. A title, category, description, location and at least one photo are required.
6. Select **Reports** in the navigation bar to see saved reports. Search by text or filter by status.
7. Select **View report** to open the details page, **Edit** to change a report and press **Save changes**, or **Delete** to remove it.

## Routes

| Path | Page |
| --- | --- |
| `/` | Home |
| `/reports` | Reports list |
| `/reports/new` | Create a report |
| `/reports/:id` | Report details |
| `/reports/:id/edit` | Edit a report |

## Device permissions and troubleshooting

- The browser asks for permission before using the camera or location. Allow access when prompted.
- Camera and geolocation need a secure context: use `localhost` during development or the HTTPS live app. They may not work on an ordinary HTTP address on another device.
- If location fails, check the device location settings and the browser's site permissions. The browser's error message is shown on the form.
- Reports are stored per browser and per device. Clearing the browser's site data removes them.
- Photos are saved as Base64 text in `localStorage`, which holds roughly 5 MB per site. If storage is full the app shows "There is not enough browser storage." Use fewer or smaller images.

## Available scripts

Run these from the `dynamic-web-technologies` folder:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Create a production build in `dist`. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run ESLint. |

## Technology

- React and React Router
- Vite (with Progressive Web App configuration and a service worker)
- Geolocation API (hardware API 1)
- Camera API through `react-webcam` (hardware API 2)
- `localStorage` for on-device persistence
- Vercel for deployment

## Known limitations

- Reports are not uploaded to or synchronised with a server.
- The service worker is registered but does not yet cache assets, so the app does not load offline.
- Photos stored in `localStorage` are limited by the browser's storage capacity.
