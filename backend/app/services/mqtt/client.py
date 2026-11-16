"""
Bambu MQTT Client

Direct MQTT connection to a single Bambu printer.
Uses paho-mqtt with TLS (port 8883).
Implements merge-caching for delta-based telemetry.
"""

import json
import ssl
import logging
from datetime import datetime, timezone
from typing import Optional, Dict, Any, Callable
import paho.mqtt.client as mqtt

logger = logging.getLogger(__name__)


class BambuMQTTClient:
    """
    MQTT client for a single Bambu printer.

    Connects to printer's MQTT broker, subscribes to reports,
    and maintains a merged cache of all telemetry data.

    CRITICAL: Uses MERGE pattern - never replaces cache, only updates
    fields that have changed. This preserves data between delta updates.
    """

    def __init__(
        self,
        printer_id: int,
        host: str,
        serial: str,
        access_code: str,
        on_event: Optional[Callable] = None
    ):
        """
        Initialize MQTT client for a printer.

        Args:
            printer_id: Database ID of the printer
            host: Printer IP address
            serial: Printer serial number (for MQTT topic)
            access_code: 8-digit access code from printer
            on_event: Callback for critical events (failures, completions)
        """
        self.printer_id = printer_id
        self.host = host
        self.serial = serial
        self.access_code = access_code
        self.on_event = on_event

        # MQTT client setup
        self.client = mqtt.Client(
            callback_api_version=mqtt.CallbackAPIVersion.VERSION2,
            client_id=f"filaops_{printer_id}"
        )
        self.client.username_pw_set("bblp", access_code)

        # TLS setup (Bambu uses self-signed certs)
        self.client.tls_set(cert_reqs=ssl.CERT_NONE)
        self.client.tls_insecure_set(True)

        # Callbacks
        self.client.on_connect = self._on_connect
        self.client.on_disconnect = self._on_disconnect
        self.client.on_message = self._on_message

        # State - this cache persists between delta updates
        self._status_cache: Dict[str, Any] = {}
        self._connected = False
        self._last_message_time: Optional[datetime] = None
        self._previous_gcode_state: Optional[str] = None

    def connect(self) -> bool:
        """Connect to the printer's MQTT broker."""
        try:
            logger.info(f"Connecting to printer {self.printer_id} at {self.host}:8883")
            self.client.connect(self.host, 8883, keepalive=60)
            self.client.loop_start()  # Background thread for MQTT
            return True
        except Exception as e:
            logger.error(f"Failed to connect to printer {self.printer_id}: {e}")
            return False

    def disconnect(self):
        """Disconnect from the printer."""
        self.client.loop_stop()
        self.client.disconnect()
        self._connected = False
        logger.info(f"Disconnected from printer {self.printer_id}")

    def is_connected(self) -> bool:
        """Check if connected to printer."""
        return self._connected

    def get_cached_status(self) -> Dict[str, Any]:
        """
        Get the current cached status.

        Returns merged status from all received messages.
        This is instant (no network call).
        """
        return {
            "printer_id": self.printer_id,
            "connected": self._connected,
            "last_update": self._last_message_time.isoformat() if self._last_message_time else None,
            **self._status_cache
        }

    def _on_connect(self, client, userdata, flags, reason_code, properties):
        """Handle successful connection."""
        if reason_code == 0:
            self._connected = True
            # Subscribe to printer reports
            topic = f"device/{self.serial}/report"
            client.subscribe(topic)
            logger.info(f"Printer {self.printer_id} connected, subscribed to {topic}")

            # Request full status immediately (Bambu only sends deltas otherwise)
            self.request_full_status()

            # Fire connected event
            if self.on_event:
                self.on_event({
                    "type": "connected",
                    "printer_id": self.printer_id,
                    "timestamp": datetime.now(timezone.utc).isoformat()
                })
        else:
            logger.error(f"Printer {self.printer_id} connection failed with code {reason_code}")

    def request_full_status(self):
        """Request full printer status via pushall command."""
        if not self._connected:
            return
        try:
            request = {"pushing": {"sequence_id": "0", "command": "pushall"}}
            topic = f"device/{self.serial}/request"
            self.client.publish(topic, json.dumps(request))
            logger.debug(f"Sent pushall request to printer {self.printer_id}")
        except Exception as e:
            logger.error(f"Failed to send pushall to printer {self.printer_id}: {e}")

    def _on_disconnect(self, client, userdata, disconnect_flags, reason_code, properties):
        """Handle disconnection."""
        self._connected = False
        logger.warning(f"Printer {self.printer_id} disconnected (rc={reason_code})")

        # Fire disconnected event
        if self.on_event:
            self.on_event({
                "type": "disconnected",
                "printer_id": self.printer_id,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "reason_code": str(reason_code)
            })

    def _on_message(self, client, userdata, msg):
        """
        Handle incoming MQTT message.

        CRITICAL: Uses MERGE pattern to preserve values between delta updates.
        """
        try:
            data = json.loads(msg.payload)
            self._last_message_time = datetime.now(timezone.utc)

            # Extract print status (main telemetry)
            if "print" in data:
                self._merge_print_status(data["print"])

            # Check for critical events
            self._check_for_events(data)

        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON from printer {self.printer_id}: {e}")
        except Exception as e:
            logger.error(f"Error processing message from printer {self.printer_id}: {e}")

    def _merge_print_status(self, print_data: Dict[str, Any]):
        """
        Merge incoming print status with cached data.

        This is the critical delta-merge pattern.
        Only updates fields that have non-None values.
        """
        for key, value in print_data.items():
            if value is not None:
                self._status_cache[key] = value

        # Map raw Bambu fields to friendly names for API consumers
        self._update_friendly_fields()

    def _update_friendly_fields(self):
        """Map raw Bambu fields to friendly names for API consumers."""
        mappings = {
            "gcode_state": "status",
            "mc_percent": "percent_complete",
            "mc_remaining_time": "remaining_minutes",
            "layer_num": "current_layer",
            "total_layer_num": "total_layers",
            "nozzle_temper": "nozzle_temp_current",
            "nozzle_target_temper": "nozzle_temp_target",
            "bed_temper": "bed_temp_current",
            "bed_target_temper": "bed_temp_target",
            "fan_speed": "fan_speed_percent",
            "wifi_signal": "wifi_signal_dbm",
        }

        for raw_key, friendly_key in mappings.items():
            if raw_key in self._status_cache:
                self._status_cache[friendly_key] = self._status_cache[raw_key]

    def _check_for_events(self, data: Dict[str, Any]):
        """Check for critical events that need alerting."""
        if not self.on_event:
            return

        print_data = data.get("print", {})
        current_state = print_data.get("gcode_state")

        if current_state and current_state != self._previous_gcode_state:
            # State changed - check what happened

            # Print completed
            if current_state == "FINISH" and self._previous_gcode_state in ["RUNNING", "PAUSE"]:
                self.on_event({
                    "type": "print_completed",
                    "printer_id": self.printer_id,
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "gcode_file": self._status_cache.get("gcode_file"),
                })

            # Print failed
            elif current_state == "FAILED":
                self.on_event({
                    "type": "print_failed",
                    "printer_id": self.printer_id,
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "gcode_file": self._status_cache.get("gcode_file"),
                    "error": print_data.get("print_error"),
                })

            # Printer went offline/error
            elif current_state in ["OFFLINE", "ERROR"]:
                self.on_event({
                    "type": "printer_error",
                    "printer_id": self.printer_id,
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "state": current_state,
                    "error": print_data.get("print_error"),
                })

            self._previous_gcode_state = current_state

        # Check for filament runout (AMS status code)
        if print_data.get("ams_status") == 2:
            self.on_event({
                "type": "filament_runout",
                "printer_id": self.printer_id,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            })
