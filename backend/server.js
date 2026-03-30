import 'dotenv/config';
import app from './api.js';
import adminRouter from './admin-api.js';

app.use('/api/admin', adminRouter);

const PORT = process.env.PORT || 3100;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
