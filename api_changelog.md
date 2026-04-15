# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-04-05

### Added
- **Content Discovery**: Added `GET /api/v1/frontend/news/:slug/related` endpoint for related articles.
- **Trending News**: Added `GET /api/v1/frontend/news/trending` for most viewed news.
- **News Tags**: Added `tags` array to `News` model and search support.
- **Newsletter Subscription**: Added `Subscriber` model and `POST /api/v1/communication/newsletter/subscribe` endpoint.
- **Contact Form**: Added `Contact` model and `POST /api/v1/communication/contact` endpoint.
- **Admin Communication**: Added `GET /api/v1/communication/newsletter/subscribers` and `GET /api/v1/communication/contact/messages` for administrators.
- **Sitemap**: Added dynamic XML sitemap at `GET /sitemap.xml`.
- **RSS Feed**: Added dynamic RSS feed at `GET /rss.xml`.
- **Security**: Added `express-rate-limit` for API rate limiting.
- **Health Check**: Enhanced `/api/v1/health` with MongoDB status, uptime, and timestamp.

### Changed
- Improved `News` controllers to handle tags during create and update operations.
- Updated `News` search to include tags in query logic.
- Standardized `serializeNews` to always return a `tags` array.

### Fixed
- Fixed inconsistencies in `News` controller response shapes.
