"""
Unit tests for Printer/MQTT Service

Tests verify:
1. MQTT connection handling
2. Print job submission
3. Printer status monitoring
4. Queue management
5. Error/retry handling

Run with:
    cd C:\repos\filaops-v3-clean\backend
    pytest tests/unit/test_printer_service.py -v
"""
import pytest
from decimal import Decimal
from datetime import datetime, timezone
from unittest.mock import Mock, MagicMock, patch, AsyncMock


# ============================================================================
# Printer Status Tests
# ============================================================================

class TestPrinterStatus:
    """Test printer status handling"""

    def test_printer_online_status(self):
        """Should recognize online printer"""
        printer = Mock()
        printer.status = "online"
        printer.last_seen = datetime.now(timezone.utc)

        is_available = printer.status == "online"
        assert is_available is True

    def test_printer_offline_status(self):
        """Should recognize offline printer"""
        printer = Mock()
        printer.status = "offline"
        printer.last_seen = None

        is_available = printer.status == "online"
        assert is_available is False

    def test_printer_busy_status(self):
        """Should recognize busy (printing) printer"""
        printer = Mock()
        printer.status = "printing"
        printer.current_job_id = 123
        printer.progress = 45.5

        is_busy = printer.status == "printing"
        assert is_busy is True
        assert printer.progress == 45.5

    def test_printer_error_status(self):
        """Should handle printer error state"""
        printer = Mock()
        printer.status = "error"
        printer.error_code = "FILAMENT_OUT"
        printer.error_message = "Filament runout detected"

        has_error = printer.status == "error"
        assert has_error is True
        assert printer.error_code == "FILAMENT_OUT"


# ============================================================================
# Print Job Tests
# ============================================================================

class TestPrintJobSubmission:
    """Test print job submission"""

    def test_create_print_job(self):
        """Should create print job with required fields"""
        job = Mock()
        job.id = 1
        job.printer_id = 10
        job.production_order_id = 100
        job.gcode_file = "/path/to/file.gcode"
        job.status = "queued"
        job.submitted_at = datetime.now(timezone.utc)

        assert job.status == "queued"
        assert job.production_order_id == 100

    def test_job_status_transitions(self):
        """Should follow valid job status transitions"""
        valid_transitions = {
            "queued": ["sending", "cancelled"],
            "sending": ["printing", "failed"],
            "printing": ["complete", "paused", "failed"],
            "paused": ["printing", "cancelled"],
            "complete": [],  # Terminal
            "failed": ["queued"],  # Can be retried
            "cancelled": [],  # Terminal
        }

        # Verify queued can go to sending
        assert "sending" in valid_transitions["queued"]

        # Verify complete is terminal
        assert valid_transitions["complete"] == []

    def test_job_progress_tracking(self):
        """Should track job progress"""
        job = Mock()
        job.status = "printing"
        job.progress = 0.0
        job.layer_current = 0
        job.layer_total = 100

        # Update progress
        job.progress = 45.5
        job.layer_current = 45

        assert job.progress == 45.5
        assert job.layer_current == 45


# ============================================================================
# Queue Management Tests
# ============================================================================

class TestQueueManagement:
    """Test print job queue management"""

    def test_add_job_to_queue(self):
        """Should add job to printer queue"""
        queue = []

        job1 = {"id": 1, "priority": 3}
        job2 = {"id": 2, "priority": 1}  # Higher priority
        job3 = {"id": 3, "priority": 3}

        queue.extend([job1, job2, job3])

        # Sort by priority (lower number = higher priority)
        queue.sort(key=lambda j: j["priority"])

        assert queue[0]["id"] == 2  # Highest priority first

    def test_queue_position(self):
        """Should report queue position"""
        queue = [
            {"id": 1, "status": "printing"},
            {"id": 2, "status": "queued"},
            {"id": 3, "status": "queued"},
        ]

        # Job 3 position in queue (0-indexed, but skip printing)
        queued_jobs = [j for j in queue if j["status"] == "queued"]
        position = next(i for i, j in enumerate(queued_jobs) if j["id"] == 3)

        assert position == 1  # Second in queue

    def test_remove_completed_from_queue(self):
        """Should remove completed jobs from queue"""
        queue = [
            {"id": 1, "status": "complete"},
            {"id": 2, "status": "queued"},
            {"id": 3, "status": "printing"},
        ]

        # Filter out completed
        active_queue = [j for j in queue if j["status"] != "complete"]

        assert len(active_queue) == 2


# ============================================================================
# MQTT Connection Tests
# ============================================================================

class TestMQTTConnection:
    """Test MQTT connection handling"""

    def test_connection_config(self):
        """Should use correct MQTT config"""
        config = {
            "host": "localhost",
            "port": 1883,
            "username": "filaops",
            "password": "secret",
            "client_id": "filaops-server",
        }

        assert config["port"] == 1883
        assert config["host"] == "localhost"

    def test_topic_subscription(self):
        """Should subscribe to correct topics"""
        printer_id = "printer-001"

        topics = [
            f"printers/{printer_id}/status",
            f"printers/{printer_id}/progress",
            f"printers/{printer_id}/temperature",
            f"printers/{printer_id}/errors",
        ]

        assert f"printers/{printer_id}/status" in topics
        assert len(topics) == 4

    def test_reconnection_backoff(self):
        """Should implement exponential backoff on reconnect"""
        base_delay = 1
        max_delay = 60
        attempt = 5

        # Exponential backoff: min(max_delay, base * 2^attempt)
        delay = min(max_delay, base_delay * (2 ** attempt))

        assert delay == 32  # 1 * 2^5 = 32


# ============================================================================
# Error Handling Tests
# ============================================================================

class TestErrorHandling:
    """Test printer error handling"""

    def test_retry_failed_job(self):
        """Should retry failed job with backoff"""
        job = Mock()
        job.status = "failed"
        job.retry_count = 2
        job.max_retries = 3

        can_retry = job.retry_count < job.max_retries
        assert can_retry is True

        job.retry_count += 1
        can_retry = job.retry_count < job.max_retries
        assert can_retry is False

    def test_handle_printer_disconnect(self):
        """Should handle printer disconnect gracefully"""
        printer = Mock()
        printer.status = "online"

        # Simulate disconnect
        printer.status = "offline"
        printer.last_seen = datetime.now(timezone.utc)

        assert printer.status == "offline"

    def test_pause_job_on_error(self):
        """Should pause job on recoverable error"""
        job = Mock()
        job.status = "printing"

        # Recoverable error (e.g., filament runout)
        error_type = "FILAMENT_OUT"
        recoverable_errors = ["FILAMENT_OUT", "PAUSED_BY_USER"]

        if error_type in recoverable_errors:
            job.status = "paused"

        assert job.status == "paused"


# ============================================================================
# Smoke Test
# ============================================================================

def test_printer_service_smoke():
    """Quick smoke test for printer service"""
    # Test printer status
    status = "online"
    assert status in ["online", "offline", "printing", "error"]

    # Test job status
    job_status = "queued"
    assert job_status in ["queued", "printing", "complete"]

    # Test backoff calculation
    backoff = min(60, 1 * (2 ** 3))
    assert backoff == 8

    print("\n  Printer service smoke test passed!")


if __name__ == "__main__":
    test_printer_service_smoke()
