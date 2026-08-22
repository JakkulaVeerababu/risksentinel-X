import asyncio
import json
import logging
from fastapi import APIRouter
from sse_starlette.sse import EventSourceResponse
from app.core.events import simulation_event_queue

router = APIRouter()

async def event_generator():
    """
    Consumes events from the global queue and yields them to SSE clients.
    """
    while True:
        try:
            # Wait for an event with a timeout to send keep-alives
            event = await asyncio.wait_for(simulation_event_queue.get(), timeout=15.0)
            yield event
        except asyncio.TimeoutError:
            yield {"event": "ping", "data": ""}

@router.get("/events")
async def sse_endpoint():
    """
    Server-Sent Events endpoint for real-time frontend updates.
    """
    logging.info("Client connected to SSE stream.")
    return EventSourceResponse(event_generator())
