This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Task Manager API Documentation

## Assigners

### Create Assigner
- **Method**: POST
- **Endpoint**: `/api/v1/assigners/create`
- **Request Body**:
```json
{
  "name": "John Smith",
  "email": "john@example.com"
}
```
- **Success Response** (201):
```json
{
  "assigner_id": 1,
  "name": "John Smith",
  "email": "john@example.com",
  "message": "Assigner created successfully"
}
```
- **Error Response** (400):
```json
{
  "error": "Bad Request",
  "message": "Invalid email format"
}
```

### Get All Assigners
- **Method**: GET
- **Endpoint**: `/api/v1/assigners`
- **Request Body**: N/A
- **Success Response** (200):
```json
{
  "assigners": [
    {
      "assigner_id": 1,
      "name": "John Smith",
      "email": "john@example.com"
    }
  ]
}
```
- **Error Response** (500):
```json
{
  "error": "Server Error",
  "message": "Failed to retrieve assigners"
}
```

### Get Assigner by ID
- **Method**: GET
- **Endpoint**: `/api/v1/assigners/{id}`
- **Request Body**: N/A
- **Success Response** (200):
```json
{
  "assigner_id": 1,
  "name": "John Smith",
  "email": "john@example.com"
}
```
- **Error Response** (404):
```json
{
  "error": "Not Found",
  "message": "Assigner not found"
}
```

### Update Assigner
- **Method**: PUT
- **Endpoint**: `/api/v1/assigners/{id}`
- **Request Body**:
```json
{
  "name": "John Smith Updated",
  "email": "john.updated@example.com"
}
```
- **Success Response** (200):
```json
{
  "assigner_id": 1,
  "name": "John Smith Updated",
  "email": "john.updated@example.com",
  "message": "Assigner updated successfully"
}
```
- **Error Response** (404):
```json
{
  "error": "Not Found",
  "message": "Assigner not found"
}
```

### Delete Assigner
- **Method**: DELETE
- **Endpoint**: `/api/v1/assigners/{id}`
- **Request Body**: N/A
- **Success Response** (200):
```json
{
  "message": "Assigner deleted successfully"
}
```
- **Error Response** (409):
```json
{
  "error": "Conflict",
  "message": "Cannot delete assigner with associated tasks"
}
```

## Tasks

### Create Task
- **Method**: POST
- **Endpoint**: `/api/v1/tasks/create`
- **Request Body**:
```json
{
  "task_name": "Complete project",
  "description": "Finish the dashboard",
  "due_date": "2025-03-15",
  "assigner_id": 1,
  "status": "Not Started"
}
```
- **Success Response** (201):
```json
{
  "task_id": 1,
  "task_name": "Complete project",
  "description": "Finish the dashboard",
  "created_date": "2025-03-01",
  "due_date": "2025-03-15",
  "assigner_id": 1,
  "assigner_name": "John Smith",
  "status": "Not Started",
  "message": "Task created successfully"
}
```
- **Error Response** (400):
```json
{
  "error": "Bad Request",
  "message": "Invalid assigner ID"
}
```

### Get All Tasks
- **Method**: GET
- **Endpoint**: `/api/v1/tasks`
- **Request Body**: N/A
- **Success Response** (200):
```json
{
  "tasks": [
    {
      "task_id": 1,
      "task_name": "Complete project",
      "description": "Finish the dashboard",
      "created_date": "2025-03-01",
      "due_date": "2025-03-15",
      "assigner_id": 1,
      "assigner_name": "John Smith",
      "status": "Not Started"
    }
  ]
}
```
- **Error Response** (500):
```json
{
  "error": "Server Error",
  "message": "Failed to retrieve tasks"
}
```

### Get Task by ID
- **Method**: GET
- **Endpoint**: `/api/v1/tasks/{id}`
- **Request Body**: N/A
- **Success Response** (200):
```json
{
  "task_id": 1,
  "task_name": "Complete project",
  "description": "Finish the dashboard",
  "created_date": "2025-03-01",
  "due_date": "2025-03-15",
  "assigner_id": 1,
  "assigner_name": "John Smith",
  "status": "Not Started"
}
```
- **Error Response** (404):
```json
{
  "error": "Not Found",
  "message": "Task not found"
}
```

### Update Task
- **Method**: PUT
- **Endpoint**: `/api/v1/tasks/{id}`
- **Request Body**:
```json
{
  "task_name": "Complete updated project",
  "description": "Updated description",
  "due_date": "2025-03-20",
  "assigner_id": 2,
  "status": "In Progress"
}
```
- **Success Response** (200):
```json
{
  "task_id": 1,
  "task_name": "Complete updated project",
  "description": "Updated description",
  "created_date": "2025-03-01",
  "due_date": "2025-03-20",
  "assigner_id": 2,
  "assigner_name": "Jane Doe",
  "status": "In Progress",
  "message": "Task updated successfully"
}
```
- **Error Response** (404):
```json
{
  "error": "Not Found",
  "message": "Task not found"
}
```

### Update Task Status
- **Method**: PATCH
- **Endpoint**: `/api/v1/tasks/{id}/status`
- **Request Body**:
```json
{
  "status": "Completed"
}
```
- **Success Response** (200):
```json
{
  "task_id": 1,
  "status": "Completed",
  "message": "Task status updated successfully"
}
```
- **Error Response** (400):
```json
{
  "error": "Bad Request",
  "message": "Invalid status value"
}
```

### Delete Task
- **Method**: DELETE
- **Endpoint**: `/api/v1/tasks/{id}`
- **Request Body**: N/A
- **Success Response** (200):
```json
{
  "message": "Task deleted successfully"
}
```
- **Error Response** (404):
```json
{
  "error": "Not Found",
  "message": "Task not found"
}
```

### Get Tasks by Assigner
- **Method**: GET
- **Endpoint**: `/api/v1/tasks/assigner/{assigner_id}`
- **Request Body**: N/A
- **Success Response** (200):
```json
{
  "tasks": [
    {
      "task_id": 1,
      "task_name": "Complete project",
      "description": "Finish the dashboard",
      "created_date": "2025-03-01",
      "due_date": "2025-03-15",
      "assigner_id": 1,
      "assigner_name": "John Smith",
      "status": "Not Started"
    }
  ]
}
```
- **Error Response** (404):
```json
{
  "error": "Not Found",
  "message": "Assigner not found"
}
```

### Get Tasks by Status
- **Method**: GET
- **Endpoint**: `/api/v1/tasks/status/{status}`
- **Request Body**: N/A
- **Success Response** (200):
```json
{
  "tasks": [
    {
      "task_id": 1,
      "task_name": "Complete project",
      "description": "Finish the dashboard",
      "created_date": "2025-03-01",
      "due_date": "2025-03-15",
      "assigner_id": 1,
      "assigner_name": "John Smith",
      "status": "Not Started"
    }
  ]
}
```
- **Error Response** (400):
```json
{
  "error": "Bad Request",
  "message": "Invalid status value"
}
```

### Get Tasks by Due Date
- **Method**: GET
- **Endpoint**: `/api/v1/tasks/due-before/{date}`
- **Request Body**: N/A
- **Success Response** (200):
```json
{
  "tasks": [
    {
      "task_id": 1,
      "task_name": "Complete project",
      "description": "Finish the dashboard",
      "created_date": "2025-03-01",
      "due_date": "2025-03-15",
      "assigner_id": 1,
      "assigner_name": "John Smith",
      "status": "Not Started"
    }
  ]
}
```
- **Error Response** (400):
```json
{
  "error": "Bad Request",
  "message": "Invalid date format"
}
```

## Statistics

### Get Tasks Summary
- **Method**: GET
- **Endpoint**: `/api/v1/stats/summary`
- **Request Body**: N/A
- **Success Response** (200):
```json
{
  "total_tasks": 10,
  "completed": 3,
  "in_progress": 5,
  "not_started": 2,
  "overdue": 1
}
```
- **Error Response** (500):
```json
{
  "error": "Server Error",
  "message": "Failed to generate summary"
}
```

### Get Tasks by Assigner Summary
- **Method**: GET
- **Endpoint**: `/api/v1/stats/by-assigner`
- **Request Body**: N/A
- **Success Response** (200):
```json
{
  "assigners": [
    {
      "assigner_id": 1,
      "name": "John Smith",
      "email": "john@example.com",
      "task_count": 5,
      "completed": 2
    },
    {
      "assigner_id": 2,
      "name": "Jane Doe",
      "email": "jane@example.com",
      "task_count": 3,
      "completed": 1
    }
  ]
}
```
- **Error Response** (500):
```json
{
  "error": "Server Error",
  "message": "Failed to generate summary"
}
```