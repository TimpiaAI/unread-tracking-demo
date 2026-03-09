import { defineApp } from "convex/server";
import unreadTracking from "convex-unread-tracking/convex.config";

const app = defineApp();
app.use(unreadTracking);

export default app;
