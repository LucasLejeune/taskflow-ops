import client from 'prom-client'

export const register = new client.Registry()

client.collectDefaultMetrics({ register })

export const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Nombre total de requêtes HTTP',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
})

export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Durée des requêtes HTTP en secondes',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2],
  registers: [register],
})

export const tasksGauge = new client.Gauge({
  name: 'taskflow_tasks_total',
  help: 'Nombre de tâches actuellement stockées',
  registers: [register],
})

export function setTasksGauge(n) {
  tasksGauge.set(n)
}

export function metricsMiddleware(req, res, next) {
  const end = httpRequestDuration.startTimer()
  res.on('finish', () => {
    const route = req.route?.path ?? req.path
    const labels = { method: req.method, route, status_code: res.statusCode }
    httpRequestsTotal.inc(labels)
    end(labels)
  })
  next()
}

export async function metricsHandler(_req, res) {
  res.set('Content-Type', register.contentType)
  res.end(await register.metrics())
}
