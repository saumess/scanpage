# Mess Scan Page

Web page used by mess workers to scan a student's mess card (QR/barcode) and verify
whether the student is allowed a meal. Part of the SAU Mess Management System.

## Features
- Scan a student's mess card with the device camera
- Verify the student against payment/status data
- Show an instant allowed / denied result
- Log every scan (student, timestamp, meal) for reports

## Tech Stack
- Vite + <React/Vue/vanilla JS>
- <Scanner library, e.g. html5-qrcode>
- Backend: <API URL / Firebase / Sheets API>

## Getting Started
```bash
git clone https://github.com/saumess/scanpage.git
cd scanpage
npm install
cp .env.example .env   # add your API URL / keys
npm run dev
```

## Environment Variables
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend base URL |

## How It Works
Scan card -> read student ID -> call verify API -> show result -> write to scan log.

## Related
- [admin](https://github.com/saumess/admin): dashboard for managing students, cards and reports

## Screenshots
<add 1-2 screenshots or a GIF of a scan>
