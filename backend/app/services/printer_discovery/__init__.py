"""
Printer Discovery Service

Brand-agnostic printer discovery and management.
Supports multiple printer brands through adapter pattern.
"""

from .models import (
    PrinterBrand,
    PrinterStatus,
    DiscoveredPrinter,
    PrinterCapabilities,
    PrinterConnectionConfig,
)
from .base import PrinterDiscoveryAdapter
from .orchestrator import PrinterDiscoveryOrchestrator, get_orchestrator

__all__ = [
    "PrinterBrand",
    "PrinterStatus",
    "DiscoveredPrinter",
    "PrinterCapabilities",
    "PrinterConnectionConfig",
    "PrinterDiscoveryAdapter",
    "PrinterDiscoveryOrchestrator",
    "get_orchestrator",
]
