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


class MaterialOwners(StrEnum):
    """Material Owners"""

    COURSE = "Course"
    SESSION = "Session"

    @classmethod
    def choices(cls):
        """Return a list of choices."""
        return [(choice.name, choice.value) for choice in cls]

    def table_name(self):
        """Return the table name."""
        return f"core_{self.lower()}"


class MaterialTypes(StrEnum):
    """Material Types"""

    FILE = "File"
    HYPERLINK = "Hyperlink"

    @classmethod
    def choices(cls):
        """Return a list of choices."""
        return [(choice.name, choice.value) for choice in cls]

    def table_name(self, owner: MaterialOwners):
        """Return the table name."""
        return f"core_{owner.lower()}{self.lower()}"
