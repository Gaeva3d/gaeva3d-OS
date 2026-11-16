"""
MQTT Event System

Captures critical events from printers for AI workers to consume.
Events are stored in a rolling buffer (last N events).
"""

from enum import Enum
from datetime import datetime
from typing import Dict, Any, List, Optional
from dataclasses import dataclass, field
from collections import deque
import threading


class EventType(str, Enum):
    """Types of events that can occur."""
    CONNECTED = "connected"
    DISCONNECTED = "disconnected"
    PRINT_STARTED = "print_started"
    PRINT_COMPLETED = "print_completed"
    PRINT_FAILED = "print_failed"
    PRINT_PAUSED = "print_paused"
    PRINTER_ERROR = "printer_error"
    FILAMENT_RUNOUT = "filament_runout"
    TEMPERATURE_ANOMALY = "temperature_anomaly"


@dataclass
class TelemetryEvent:
    """A single telemetry event."""
    event_type: EventType
    printer_id: int
    timestamp: datetime
    data: Dict[str, Any] = field(default_factory=dict)
    production_order_id: Optional[int] = None  # Link to PO if known

    def to_dict(self) -> Dict[str, Any]:
        return {
            "event_type": self.event_type.value,
            "printer_id": self.printer_id,
            "timestamp": self.timestamp.isoformat(),
            "data": self.data,
            "production_order_id": self.production_order_id,
        }


class EventQueue:
    """
    Thread-safe rolling event queue.

    Stores the last N events for AI workers to poll.
    """

    def __init__(self, max_events: int = 1000):
        self._events: deque = deque(maxlen=max_events)
        self._lock = threading.Lock()
        self._event_id = 0

    def push(self, event: TelemetryEvent) -> int:
        """Add an event to the queue. Returns event ID."""
        with self._lock:
            self._event_id += 1
            event_with_id = {
                "id": self._event_id,
                **event.to_dict()
            }
            self._events.append(event_with_id)
            return self._event_id

    def get_since(self, since_id: int = 0, limit: int = 100) -> List[Dict]:
        """Get events since a given ID."""
        with self._lock:
            events = [e for e in self._events if e["id"] > since_id]
            return events[-limit:]

    def get_recent(self, limit: int = 50) -> List[Dict]:
        """Get most recent events."""
        with self._lock:
            return list(self._events)[-limit:]

    def get_by_type(self, event_type: EventType, limit: int = 50) -> List[Dict]:
        """Get events of a specific type."""
        with self._lock:
            events = [e for e in self._events if e["event_type"] == event_type.value]
            return events[-limit:]

    def get_by_printer(self, printer_id: int, limit: int = 50) -> List[Dict]:
        """Get events for a specific printer."""
        with self._lock:
            events = [e for e in self._events if e["printer_id"] == printer_id]
            return events[-limit:]

    def clear(self):
        """Clear all events."""
        with self._lock:
            self._events.clear()

    def __len__(self) -> int:
        """Get number of events in queue."""
        with self._lock:
            return len(self._events)
