import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react", "@wxt-dev/auto-icons"],
  autoIcons: {
    baseIconPath: 'assets/icon.svg', // Specify your SVG file here
  },

  manifest: {
    permissions: ["storage"],
    browser_specific_settings: {
      gecko: {
        id: 'extension@xyz',
        // @ts-ignore - WXT doesn't support this field yet
        data_collection_permissions: {
          required: ['none'],
        },
      },
    },

  },
});
