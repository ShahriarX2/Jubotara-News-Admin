# Jubotara News API

Standalone Express + MongoDB API for the Jubotara News project.

This repository is the backend extracted from the original full-stack project. It is intended to serve:

- `frontend`: public news website
- `admin`: admin dashboard and content management

This API does **not** include:

- `epaper` endpoints
- `ads` management

## Stack

- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication
- Cloudinary for file uploads

## Project Structure

```text
.
|-- server.js
|-- src
|   |-- app.js
|   |-- config
|   |-- controllers
|   |-- middleware
|   |-- models
|   |-- routes
|   `-- utils
`-- package.json
```

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Run

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

## Base URL

Production:

```text
https://api.jubotaranews.com/api/v1
```

Local default:

```text
http://localhost:5000/api/v1
```

## Authentication

The API uses JWT in the `Authorization` header:

```http
Authorization: Bearer <token>
```

### Roles

Supported user roles in the API:

- `administrator`
- `admin`
- `author`
- `reporter`
- `user`

Role behavior:

- Admin-only endpoints accept `admin` and `administrator`
- Writer endpoints accept `admin`, `administrator`, `user`, `author`, and `reporter`
- Non-admin news authors cannot update or delete published news

## API Summary

### Public Endpoints

- `GET /health`
- `POST /auth/register`
- `POST /auth/login`
- `GET /frontend/settings`
- `GET /frontend/menu`
- `GET /frontend/logo`
- `GET /frontend/news`
- `GET /frontend/news/:slug`
- `GET /frontend/news/:slug/related`
- `GET /frontend/news/trending`
- `GET /frontend/news/search`
- `GET /frontend/categories`
- `GET /frontend/categories/:slug`
- `GET /frontend/team`
- `GET /frontend/videos`
- `POST /communication/newsletter/subscribe`
- `POST /communication/contact`
- `GET /sitemap.xml`
- `GET /rss.xml`
- `GET /news`
- `GET /news/search`
- `GET /news/resolve-slug/:id` (MongoDB id → slug; legacy redirects)
- `GET /news/:id`
- `GET /category`
- `GET /team`
- `GET /video`
- `GET /admin/navbar`
- `GET /admin/settings`
- `GET /settings/logo`

### Protected Endpoints

- `GET /auth/me`
- `POST /news`
- `PUT /news/:id`
- `DELETE /news/:id`
- `POST /category`
- `DELETE /category/:slug`
- `POST /team`
- `PUT /team/:id`
- `DELETE /team/:id`
- `POST /video`
- `DELETE /video/:id`
- `POST /upload`
- `GET /users`
- `PATCH /users/:id/role`
- `POST /admin/navbar`
- `PUT /admin/navbar/:id`
- `DELETE /admin/navbar/:id`
- `POST /admin/settings`
- `GET /admin/metrics`
- `GET /communication/newsletter/subscribers`
- `GET /communication/contact/messages`
- `POST /settings/logo`
- `DELETE /settings/logo/:id`

## Endpoints

### Health

#### `GET /api/v1/health`

Check if the API is running.

Response:

```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2026-04-05T07:59:00.000Z",
  "uptime": 123.45,
  "mongoStatus": "Connected"
}
```

### Public Frontend API

New stable endpoints for the public website. These are under `/api/v1/frontend/*` and provide stable, read-only data shapes.

#### `GET /api/v1/frontend/settings`

Get all public settings.

#### `GET /api/v1/frontend/menu`

Get all navbar items sorted by order.

#### `GET /api/v1/frontend/logo`

Get the current site logo.

#### `GET /api/v1/frontend/news`

Get published news with pagination and filtering.

Query params:
- `page`: default `1`
- `per_page`: default `10`
- `category_slug`: filter by category slug
- `featured`: set to `true` to get only featured news
- `search`: search headline by keyword

#### `GET /api/v1/frontend/news/:slug`

Get a single news item by slug. Also increments `viewsCount`.

#### `GET /api/v1/frontend/news/:slug/related`

Get related articles from the same category.

#### `GET /api/v1/frontend/news/trending`

Get most viewed published news articles.

#### `GET /api/v1/frontend/news/search?q=...`

Full search of published news by headline or content.

#### `GET /api/v1/frontend/categories`

Get all categories.

#### `GET /api/v1/frontend/categories/:slug`

Get a single category by slug.

#### `GET /api/v1/frontend/team`

Get all team members sorted by order.

#### `GET /api/v1/frontend/videos`

Get all videos sorted by latest.

#### Standard Response Shapes

**List Endpoints:**
```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "perPage": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

**Single Resource Endpoints:**
```json
{
  "success": true,
  "data": {}
}
```

### Auth

#### `POST /api/v1/auth/register`

Create a new user.

Request body:

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "secret123"
}
```

Response:

```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "user",
    "isActivated": false
  }
}
```

#### `POST /api/v1/auth/login`

Authenticate a user and get a JWT.

Request body:

```json
{
  "email": "admin@example.com",
  "password": "secret123"
}
```

Response:

```json
{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin",
    "isActivated": true
  }
}
```

#### `GET /api/v1/auth/me`

Get the authenticated user.

Auth required: yes

Response:

```json
{
  "user": {
    "id": "user_id",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin",
    "isActivated": true
  }
}
```

### News

#### `GET /api/v1/news`

Get paginated news.

Query params:

- `page`: number, default `1`
- `limit`: number, default `10`
- `category`: category name or `all`
- `status`: `published`, `pending`, `draft`, or `all`

Notes:

- Public requests default to `published`
- Authenticated non-admin users can only view their own non-published news when `status` is requested

Response:

```json
{
  "success": true,
  "data": [],
  "newsheadline": [],
  "totalCount": 0,
  "filteredCount": 0,
  "currentPage": 1,
  "totalPages": 1
}
```

#### `GET /api/v1/news/search?q=keyword`

Search published news by headline, content, or category.

Response:

```json
{
  "success": true,
  "data": []
}
```

#### `GET /api/v1/news/resolve-slug/:id` and `GET /api/news/resolve-slug/:id`

Resolve the canonical `slug` for a news item by its MongoDB `_id`. Use this when redirecting old ID-based links to slug-based URLs (for example from a Next.js middleware or `getServerSideProps`).

Auth: not required.

The handler is the same on both paths:

- `GET /api/v1/news/resolve-slug/:id` — consistent with the rest of the API under `/api/v1`.
- `GET /api/news/resolve-slug/:id` — available without the `v1` segment if your redirect or proxy targets `/api/news/...`.

Only the `slug` field is read from the database.

**200 OK**

```json
{
  "slug": "example-news-slug"
}
```

**404 Not Found** — no document, no `slug` on the document, or invalid ObjectId string:

```json
{
  "error": "News not found"
}
```

**500 Internal Server Error** — unexpected failure:

```json
{
  "error": "Internal server error"
}
```

#### `GET /api/v1/news/:id`

Get a single news item by MongoDB id.

#### `POST /api/v1/news`

Create a news item.

Auth required: yes

Accepted multipart fields:

- `image`
- `imageSrc`

Accepted body fields:

- `headline` required
- `content` required
- `category` required
- `imageSrc` required if no file uploaded
- `reporterInfo`
- `imageCaption`
- `authorName`
- `status`
- `isFeatured`
- `tags` (JSON array or comma-separated string)
- `publishedAt`
- `metaTitle`
- `metaDescription`

Notes:

- If a file is uploaded, it is sent to Cloudinary and `imageSrc` is replaced with the uploaded URL
- Non-admin users are forced to `status: "pending"`
- `authorId` is taken from the JWT

Response:

```json
{
  "success": true,
  "data": {
    "_id": "news_id"
  }
}
```

#### `PUT /api/v1/news/:id`

Update a news item.

Auth required: yes

Rules:

- Admins can update any news
- Non-admin users can update only their own non-published news
- Non-admin users cannot change `status` or `approvedBy`

#### `DELETE /api/v1/news/:id`

Delete a news item.

Auth required: yes

Rules:

- Admins can delete any news
- Non-admin users can delete only their own non-published news

Response:

```json
{
  "success": true,
  "id": "news_id"
}
```

### Communication

#### `POST /api/v1/communication/newsletter/subscribe`

Add an email to the newsletter list.

#### `POST /api/v1/communication/contact`

Submit a contact form message.

#### `GET /api/v1/communication/newsletter/subscribers`

Get all newsletter subscribers. (Admin only)

#### `GET /api/v1/communication/contact/messages`

Get all contact form messages. (Admin only)

### SEO & Syndication

#### `GET /sitemap.xml`

Dynamic XML sitemap.

#### `GET /rss.xml`

Dynamic RSS feed.

### Category

#### `GET /api/v1/category`

Get all categories.

Response:

```json
{
  "success": true,
  "categories": []
}
```

#### `POST /api/v1/category`

Create a category.

Auth required: admin

Request body:

```json
{
  "name": "Politics",
  "slug": "politics"
}
```

Notes:

- `slug` must be provided by the client
- the API does not auto-generate category slugs

#### `DELETE /api/v1/category/:slug`

Delete a category by slug.

Auth required: admin

### Team

#### `GET /api/v1/team`

Get all team members.

#### `POST /api/v1/team`

Create a team member.

Auth required: admin

Request body:

```json
{
  "name": "Member Name",
  "designation": "Editor",
  "image": "https://example.com/image.jpg",
  "section": "Newsroom",
  "isHead": false,
  "order": 0
}
```

#### `PUT /api/v1/team/:id`

Update a team member.

Auth required: admin

#### `DELETE /api/v1/team/:id`

Delete a team member.

Auth required: admin

### Video

#### `GET /api/v1/video`

Get all videos.

Response:

```json
{
  "success": true,
  "data": []
}
```

#### `POST /api/v1/video`

Create a YouTube video entry.

Auth required: admin

Request body:

```json
{
  "title": "Video title",
  "youtubeUrl": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

Notes:

- The API extracts and stores `videoId` from the YouTube URL

#### `DELETE /api/v1/video/:id`

Delete a video.

Auth required: admin

### Upload

#### `POST /api/v1/upload`

Upload a file to Cloudinary.

Auth required: writer

Request type:

- `multipart/form-data`

Field:

- `file`

Response:

```json
{
  "success": true,
  "secure_url": "https://res.cloudinary.com/...",
  "public_id": "jubotara-news/..."
}
```

### Users

#### `GET /api/v1/users`

Get all users.

Auth required: admin

Response:

```json
{
  "users": [],
  "totalUser": 0
}
```

#### `PATCH /api/v1/users/:id/role`

Update a user role.

Auth required: admin

Request body:

```json
{
  "role": "admin"
}
```

### Admin Navbar

#### `GET /api/v1/admin/navbar`

Get navbar items.

#### `POST /api/v1/admin/navbar`

Create a navbar item.

Auth required: admin

Request body:

```json
{
  "label": "Sports",
  "href": "/category/sports",
  "order": 1,
  "isExternal": false
}
```

#### `PUT /api/v1/admin/navbar/:id`

Update a navbar item.

Auth required: admin

#### `DELETE /api/v1/admin/navbar/:id`

Delete a navbar item.

Auth required: admin

### Admin Settings

#### `GET /api/v1/admin/settings`

Get settings as a flattened key-value object.

Response:

```json
{
  "success": true,
  "data": {
    "footerText": "Example"
  }
}
```

#### `POST /api/v1/admin/settings`

Create or update a setting.

Auth required: admin

Request body:

```json
{
  "key": "footerText",
  "value": "Example text",
  "description": "Footer text"
}
```

### Logo Settings

#### `GET /api/v1/settings/logo`

Get all logo entries.

#### `POST /api/v1/settings/logo`

Create a logo entry.

Auth required: admin

Request body:

```json
{
  "logoUrl": "https://example.com/logo.png",
  "publicId": "jubotara-news/logo"
}
```

#### `DELETE /api/v1/settings/logo/:id`

Delete a logo entry.

Auth required: admin

### Admin Metrics

#### `GET /api/v1/admin/metrics`

Get dashboard counters.

Auth required: admin

Response:

```json
{
  "success": true,
  "data": {
    "news": 0,
    "users": 0,
    "videos": 0
  }
}
```

## Data Models

### User

Fields:

- `name`
- `email`
- `password`
- `role`
- `isActivated`
- `emailVerified`
- `activationToken`
- `activationDate`
- `activationTokenExpires`
- `activationExpires`

### News

Fields:

- `headline`
- `slug`
- `reporterInfo`
- `content`
- `category`
- `imageSrc`
- `imageCaption`
- `authorId`
- `authorName`
- `status`
- `approvedBy`
- `isFeatured`
- `publishedAt`
- `metaTitle`
- `metaDescription`
- `tags`
- `likesCount`
- `viewsCount`
- `comments`

### Category

Fields:

- `name`
- `slug`

### Team Member

Fields:

- `name`
- `designation`
- `image`
- `section`
- `isHead`
- `order`

### Video

Fields:

- `title`
- `youtubeUrl`
- `videoId`

### Subscriber

Fields:
- `email`
- `isActive`

### Contact Message

Fields:
- `name`
- `email`
- `subject`
- `message`
- `isRead`

### Navbar Item

Fields:

- `label`
- `href`
- `order`
- `isExternal`

### Setting

Fields:

- `key`
- `value`
- `description`

### Logo

Fields:

- `logoUrl`
- `publicId`

## Error Behavior

Common responses:

- `400` invalid request or validation error
- `401` missing or invalid token
- `403` authenticated but forbidden
- `404` resource not found
- `500` internal server error

Examples:

```json
{
  "message": "Unauthorized"
}
```

```json
{
  "error": "Validation failed"
}
```

## Security

### Rate Limiting

The API implements rate limiting to prevent abuse:

- **General API**: 100 requests per 15 minutes per IP.
- **Login**: 10 attempts per hour per IP.

## Frontend / Admin Integration

Both separated clients should call this API through a configurable base URL, for example:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
```

Prefer this API’s base URL for data fetching instead of Next.js **internal** API route handlers. The backend also exposes `GET /api/news/resolve-slug/:id` for ID→slug redirects; that path is served by this Express app, not by Next.js.

## Current Scope

This API is intended to own:

- authentication
- users
- news content
- categories
- team members
- videos
- navbar config
- settings
- logo config
- file upload

Out of scope in this repository:

- epaper service
- ads management

## Current Gaps

The API is functional, but these items are still open if you want production completeness:

- auth activation flow
- password change/reset flow
- request validation improvements
- automated tests
- deployment documentation
