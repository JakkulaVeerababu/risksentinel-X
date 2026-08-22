import asyncio

# Global event queue for SSE broadcasting
# In production, this would be Redis Pub/Sub or Kafka
simulation_event_queue = asyncio.Queue()
