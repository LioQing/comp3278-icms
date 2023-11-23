"""Code from https://github.com/LioQing/chat-composer by LioQing 2023"""
from enum import StrEnum
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field, model_serializer


class Role(StrEnum):
    """Role enumeration for conversation messages.

    Attributes:
        SYSTEM: system.
        USER: user.
        ASSISTANT: assistant.
        FUNCTION: function.
    """

    SYSTEM = "system"
    USER = "user"
    ASSISTANT = "assistant"
    FUNCTION = "function"

    def __repr__(self) -> str:
        """Get the string representation of the role"""
        return repr(self.value)


class FinishReason(StrEnum):
    """Finish reason enumeration for conversation messages.

    Attributes:
        STOP: stop.
        LENGTH: length.
        CONTENT_FILTER: content_filter.
        FUNCTION_CALL: function_call.
    """

    STOP = "stop"
    LENGTH = "length"
    CONTENT_FILTER = "content_filter"
    FUNCTION_CALL = "function_call"

    def __repr__(self) -> str:
        """Get the string representation of the finish reason"""
        return repr(self.value)


class FunctionCall(BaseModel):
    """Function call by chat completion.

    Attributes:
        arguments (str): The arguments to be passed to the function.
        name (str): The name of the function.
    """

    arguments: str
    name: str


class Message(BaseModel):
    """Message by chat completion.

    Attributes:
        content (str): The content of the message.
        name (str, optional): The name of the message. Defaults to None.
        function_call (FunctionCall, optional): The function call. Defaults to
            None.
        role (Role): The role of the message.
    """

    content: Optional[str] = Field(None)
    name: Optional[str] = Field(None)
    function_call: Optional[FunctionCall] = Field(None)
    role: Role

    @model_serializer
    def model_dump(self) -> Dict[str, Any]:
        """Dump the model"""
        dump = {"role": self.role, "content": self.content}

        if self.name is not None:
            dump["name"] = self.name

        if self.function_call is not None:
            dump["function_call"] = self.function_call

        return dump


class Choice(BaseModel):
    """Message choice by chat completion.

    Attributes:
        finish_reason (FinishReason): The finish reason.
        index (int): The index of the message.
        message (Message): The message.
    """

    finish_reason: FinishReason
    index: int
    message: Message


class Usage(BaseModel):
    """Token usage by chat completion.

    Attributes:
        completion_tokens (int): The number of completion tokens.
        prompt_tokens (int): The number of prompt tokens.
        total_tokens (int): The number of total tokens.
    """

    completion_tokens: int
    prompt_tokens: int
    total_tokens: int


class Chatcmpl(BaseModel):
    """Chat completion response by OpenAI API.

    Attributes:
        choices (List[Choice]): The choices.
        created (int): The created timestamp.
        model (str): The model.
        object (str): The object.
        usage (Usage): The usage.
    """

    id: str
    choices: List[Choice]
    created: int
    model: str
    object: str
    usage: Usage
