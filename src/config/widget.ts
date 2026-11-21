export const WIDGET_SCRIPT_URL =
  process.env.NEXT_PUBLIC_WIDGET_URL ?? "https://pulsedesk-widget.vercel.app/widget.js";

// Mirrors WIDGET_DEFAULTS in the backend (company.settings.ts).
export const WIDGET_DEFAULTS = {
  welcomeMessage: "Hi! 👋 Ask me anything — I'll get you to a human if needed.",
  primaryColor: "#4B4FE0",
  secondaryColor: "#EEF0FF",
  widgetEnabled: true,
};

export const MAX_ALLOWED_ORIGINS = 20;

export const buildInstallSnippet = (siteId: string) =>
  `<script src="${WIDGET_SCRIPT_URL}" data-site-id="${siteId}" async></script>`;
