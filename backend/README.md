# Sentinel Ops Backend

## Setup and Run

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Database Setup**
    - Ensure MySQL is running.
    - Create the database and tables using the provided schema:
      ```bash
      mysql -u root -p < schema.sql
      ```
    - Check `.env` to match your database credentials.

3.  **Run Development Server**
    ```bash
    npm run dev
    ```

4.  **Build and Start**
    ```bash
    npm run build
    npm start
    ```

## API Endpoints
- `GET /` - Health check
- `GET /api/health` - DB Connection check
- `GET /api/incidents` - List all incidents
- `POST /api/incidents` - Create incident
- `POST /api/audit-logs` - Create audit log
