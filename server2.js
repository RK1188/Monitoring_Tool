// const express = require('express');
// const cors = require('cors');
// const client = require('prom-client');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Prometheus metrics
// const collectDefaultMetrics = client.collectDefaultMetrics;
// collectDefaultMetrics();

// const httpRequestDurationMicroseconds = new client.Histogram({
//   name: 'http_request_duration_ms',
//   help: 'Duration of HTTP requests in ms',
//   labelNames: ['method', 'route', 'code'],
//   buckets: [50, 100, 200, 300, 400, 500, 1000]
// });

// // app.use((req, res, next) => {
// //   const end = httpRequestDurationMicroseconds.startTimer();
// //   res.on('finish', () => {
// //     end({ method: req.method, route: (req.route && req.route.path) || req.path, code: res.statusCode });

// //   });
// //   next();
// // });

// app.use((req, res, next) => {
//   if (req.path === '/metrics') {
//     return next(); // 🔒 Skip metrics route from being tracked
//   }

//   const end = httpRequestDurationMicroseconds.startTimer();
//   res.on('finish', () => {
//     end({ method: req.method, route: (req.route && req.route.path) || req.path, code: res.statusCode });
//   });
//   next();
// });

// app.get('/api/data', (_req, res) => {
//   res.json({ msg: 'Hello from backend' });
// });

// app.get('/metrics', async (_req, res) => {
//   res.set('Content-Type', client.register.contentType);
//   res.end(await client.register.metrics());
// });

// app.listen(3000, () => {
//   console.log(' API running at http://localhost:3000');
// });



const express = require('express');
const cors = require('cors');
const axios = require('axios');
const client = require('prom-client');

const app = express();
app.use(cors());
app.use(express.json());

// Prometheus metrics
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
  buckets: [50, 100, 200, 300, 400, 500, 1000]
});

app.use((req, res, next) => {
  if (req.path === '/metrics') return next();
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.path, code: res.statusCode });
  });
  next();
});

// 🔗 3. Endpoint that fetches data from external API
app.get('/bettercarehospitaldevapi/Appointment/GetRefreshData', async (_req, res) => {
  try {
    const url = 'https://bettercarehospitaldevapi.juzgodigital.com/api/Appointment/GetRefreshData?module=All&deviceId=2&userDetailsID=1048';
    const token = 'Bearer KgdJF3Z36CA3YulXRpJh3iHZYo6cggkaTDEw0c9v6HmNi5DV2QehK7AjVDfnWNl0NTYn3PAOWfTs1uLiu_JwWyhLVtDGno3nRBHMf_UyRqcioQq9B5DKnENKxlf2uEzTwuMatA_RQITY4wPzUbMYUIbZ_FVAgmBqu4BO8TV1zlPMHxK4qt2UoDIPbshJicjUWQkH2jIWQbQtsq0WhnVyLh1aewJ7M_tHPo7M5mkO_iX5qno8pHD7LLYaPOSgceGEe1m0q0tpKaf1un3qmGadBesCut4mVA_WwZjUVl7ltZR__AaKw25w7giHltxck_dljAr2QMOHdc8j9E10sfkIdZzeWvUkjKbkqa3Iio0TY2_K4ikOkj-HiwUz-X1sFOYHk8UobSXbOqrPe6hffhN9aKLDYSuu8HzvhaIfLiiUgkQ';

    const response = await axios.get(url, {
      headers: {
        Authorization: token
      },
      params: {
        module: 'All',
        deviceId: 2,
        userDetailsID: 1048
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error(' External API Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch external data' });
  }
});

// 🔗 4. Another external API - GetClassTypeList
app.get('/bettercarehospitaldevapi/Master/GetClassTypeList', async (_req, res) => {
  try {
    const url = 'https://bettercarehospitaldevapi.juzgodigital.com/api/Master/GetClassTypeList?isParent=true';
    const token = 'Bearer KgdJF3Z36CA3YulXRpJh3iHZYo6cggkaTDEw0c9v6HmNi5DV2QehK7AjVDfnWNl0NTYn3PAOWfTs1uLiu_JwWyhLVtDGno3nRBHMf_UyRqcioQq9B5DKnENKxlf2uEzTwuMatA_RQITY4wPzUbMYUIbZ_FVAgmBqu4BO8TV1zlPMHxK4qt2UoDIPbshJicjUWQkH2jIWQbQtsq0WhnVyLh1aewJ7M_tHPo7M5mkO_iX5qno8pHD7LLYaPOSgceGEe1m0q0tpKaf1un3qmGadBesCut4mVA_WwZjUVl7ltZR__AaKw25w7giHltxck_dljAr2QMOHdc8j9E10sfkIdZzeWvUkjKbkqa3Iio0TY2_K4ikOkj-HiwUz-X1sFOYHk8UobSXbOqrPe6hffhN9aKLDYSuu8HzvhaIfLiiUgk';

    const response = await axios.get(url, {
      headers: {
        Authorization: token
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error(' External API Error (class-types):', error.message);
    res.status(500).json({ error: 'Failed to fetch class type list' });
  }
});


// Prometheus /metrics endpoint
app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(4000, () => {
  console.log('API server running at http://localhost:4000');
});

