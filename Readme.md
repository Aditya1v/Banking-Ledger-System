# Banking Ledger System

A professional banking ledger management system with secure authentication, account management, and transaction tracking using Node.js and MongoDB.

### 🌐 Live Demo
**API Base URL**: https://banking-ledger-system-1f60.onrender.com

---

## Quick Start

### Prerequisites
- Node.js v14+, npm v6+, MongoDB v4+

### Installation
```bash
git clone https://github.com/yourusername/Banking-Ledger-System.git
cd Banking-Ledger-System
npm install
```

### Environment Setup
Create `.env` file in the project root:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name
JWT_SECRET=your-secret-key
CLIENT_ID=your-google-oauth-client-id
CLIENT_SECRET=your-google-oauth-client-secret
REFRESH_TOKEN=your-google-refresh-token
EMAIL_USER=your-email@gmail.com
```

**Note**: Never commit `.env` to version control.

### Run Application
```bash
npm run dev     # Development with auto-reload
npm start       # Production mode
```

Server runs on `http://localhost:3000`

---

## Features

- **JWT Authentication**: Secure login with 3-day token expiration
- **Password Hashing**: bcryptjs with 10 salt rounds
- **Multi-Account Support**: Users can manage multiple accounts with statuses (ACTIVE, FROZEN, CLOSED)
- **Transaction Management**: Transfer, deposit, withdrawal with idempotency keys
- **Double-Entry Ledger**: Credit/debit entries with real-time balance calculation
- **Email Notifications**: Registration confirmations via Nodemailer

---

## Project Structure

```
src/
├── config/db.js              # MongoDB connection
├── controllers/              # Business logic
├── middleware/auth.js        # JWT verification
├── models/                   # Mongoose schemas
├── routes/                   # API endpoints
└── services/email.js         # Email service
server.js                      # Entry point
```

---

## Database Models

| Model | Key Fields |
|-------|-----------|
| **User** | email, name, password (hashed), systemUser |
| **Account** | user (ref), status, currency, timestamps |
| **Transaction** | fromUser, toUser, amount, status, idempotencyKey |
| **Ledger** | account, transaction, type (CREDIT/DEBIT), amount |

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Accounts (Requires JWT)
- `POST /api/accounts` - Create account
- `GET /api/accounts` - Get user accounts

### Transactions (Requires JWT)
- `POST /api/transactions/transfer` - Transfer funds
- `GET /api/transactions` - Transaction history

---

## Usage Examples

### Register User
```bash
curl -X POST https://banking-ledger-system-1f60.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Pass123","name":"John Doe"}'
```

### Login
```bash
curl -X POST https://banking-ledger-system-1f60.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Pass123"}'
```

### Create Account (with JWT token)
```bash
curl -X POST https://banking-ledger-system-1f60.onrender.com/api/accounts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"currency":"INR"}'
```

### Transfer Funds
```bash
curl -X POST https://banking-ledger-system-1f60.onrender.com/api/transactions/transfer \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"toUser":"USER_ID","amount":1000,"description":"Payment","idempotencyKey":"key-123"}'
```

---

## Security

- Passwords hashed with bcryptjs (10 rounds)
- JWT tokens expire in 3 days
- Tokens stored in HTTP-only cookies
- Sensitive fields use `select: false`
- Account status validation before transactions
- Email validation regex pattern
- Use HTTPS in production
- Implement rate limiting for auth endpoints

---

## Technology Stack

| Category | Technology |
|----------|-----------|
| Runtime | Node.js |
| Framework | Express.js v5.2.1 |
| Database | MongoDB + Mongoose v9.7.4 |
| Auth | JWT v9.0.3, bcryptjs v3.0.3 |
| Email | Nodemailer v9.0.3 |
| Config | Dotenv v17.4.2 |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection fails | Check MONGO_URI and MongoDB is running |
| Login shows "invalid email/password" | Verify user registered after password fix; re-register if needed |
| Account status not stored | Ensure schema has field-level default, not enum-level |
| JWT token fails | Check token in Authorization header; verify JWT_SECRET matches |
| Email not sending | Verify SMTP credentials; enable Gmail less-secure app access |

---

## Deployment

### Render
1. Connect GitHub repository to Render
2. Set environment variables in dashboard
3. Deploy with `npm start`
4. Monitor logs in Render dashboard

---

## Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m 'Add feature'`
4. Push: `git push origin feature/your-feature`
5. Submit pull request

**Code Style**: 2-space indentation, meaningful commits, test thoroughly

---

## Support

- **GitHub Issues**: Report bugs with environment details
- **Documentation**: 
  - MongoDB: https://docs.mongodb.com
  - Express: https://expressjs.com
  - JWT: https://jwt.io

---

## License

MIT License - See [LICENSE](https://opensource.org/licenses/MIT) file for details

This project is licensed under the MIT License, which permits commercial and private use with very few restrictions. See the LICENSE file in the repository for full details.

---

## Version History

**v1.0.0** (July 2026)
- User authentication with JWT
- Account management with statuses
- Transaction processing with transfers
- Double-entry ledger system
- Email notifications

---

**Last Updated**: July 15, 2026  
**Maintained By**: Aditya Verma  
**Live API**: https://banking-ledger-system-1f60.onrender.com
