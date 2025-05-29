export default function extractErrorMessages(errorData) {
  if (!errorData) return "Unknown error occurred.";
  if (typeof errorData === "string") return errorData;

  return Object.entries(errorData)
    .map(([field, messages]) => {
      const flat = Array.isArray(messages) ? messages.join(" ") : messages;
      return `${field}: ${flat}`;
    })
    .join(" | ");
}