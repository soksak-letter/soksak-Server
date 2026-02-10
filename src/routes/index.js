// src/routes/index.js
import rootRouter from "./root.router.js";
import authRouter from "./auth.router.js";
import usersRouter from "./users.router.js";
import interestsRouter from "./interests.router.js";
import friendsRouter from "./friends.router.js";
import matchingRouter from "./matching.router.js";
import blockRouter from "./block.router.js";
import restrictRouter from "./restrict.router.js";
import reportsRouter from "./reports.router.js";
import weeklyRouter from "./weekly.router.js";
import inquiriesRouter from "./inquiries.router.js";
import letterRouter from "./letter.router.js";
import questionsRouter from "./questions.router.js";
import homeRouter from "./home.router.js";
import mailboxRouter from "./mailbox.router.js";
import policyRouter from "./policy.router.js";
import noticeRouter from "./notice.router.js";

export const registerRoutes = (app) => {
  app.use("/", rootRouter);

  app.use("/auth", authRouter);

  app.use("/users", usersRouter);
  app.use("/interests", interestsRouter);

  app.use("/friends", friendsRouter);

  app.use("/matching", matchingRouter);

  app.use("/block", blockRouter);
  app.use("/restrict", restrictRouter);

  app.use("/reports", reportsRouter);
  app.use("/weekly", weeklyRouter);

  app.use("/inquiries", inquiriesRouter);

  // ✅ /letter-assets, /letter/*, /letters/* 모두 여기서 처리 (URL 깨짐 없음)
  app.use("/", letterRouter);

  app.use("/questions", questionsRouter);
  app.use("/home", homeRouter);

  app.use("/mailbox", mailboxRouter);

  app.use("/policies", policyRouter);
  app.use("/notices", noticeRouter);
};