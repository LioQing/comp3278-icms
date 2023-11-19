from enum import StrEnum


class SessionType(StrEnum):
    """Session type enum."""

    LEC = "Lecture"
    TUT = "Tutorial"
    LAB = "Lab"
    OTH = "Other"

    @classmethod
    def choices(cls):
        """Return a list of choices."""
        return [(choice.name, choice.value) for choice in cls]
