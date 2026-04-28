import { NextResponse } from "next/server";

const startTime = Date.now();

export async function GET() {
  const uptime = (Date.now() - startTime) / 1000;

  const metrics = `
# HELP app_uptime_seconds Total uptime of the application
# TYPE app_uptime_seconds gauge
app_uptime_seconds ${uptime}

# HELP nodejs_memory_heap_used_bytes Node.js heap memory used
# TYPE nodejs_memory_heap_used_bytes gauge
nodejs_memory_heap_used_bytes ${process.memoryUsage().heapUsed}

# HELP nodejs_memory_heap_total_bytes Node.js heap memory total
# TYPE nodejs_memory_heap_total_bytes gauge
nodejs_memory_heap_total_bytes ${process.memoryUsage().heapTotal}
`.trim();

  return new NextResponse(metrics, {
    headers: { "Content-Type": "text/plain; version=0.0.4" },
  });
}