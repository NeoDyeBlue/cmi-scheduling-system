This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Todo

- [ ] Dashboard (f,b)
- [ ] Table searches (f,b)
- [x] Fix subject teachers not updating in form (b)
- [x] Fix year sections count not showing in updating of courses (b)
- [x] add sem tabs in viewing of course schedules (f)
- [ ] fix scheduler initial schedules for showing the confirmation modal (f)
- [x] fix room schedules not updating when room is removed (f)
- [ ] fix onClick is triggering the restrictions and when dragged does not trigger them (f)
- [x] add scheduler course statuses (b)
- [ ] show info on row click or layout item click (f)
- [x] add special and summer semesters (f,b)
- [x] show schedules on tables (b)
- [ ] fix scheduler bugs (f,b)
- [x] pagination problem in subjects (f,b)
- [x] some subjects does not appear on search (f,b)
- [x] fix on course, room, teacher, and subject delete should also update the schedules collection (b)
- [x] 1st, 2nd and summer semesters should check their existing schedules only on the same sem (f,b)
- [x] schedule not updating when room is removed with one subject and same room or when schedules array is empty (b)
- [x] add where the subject is offered, if its for shs or college (f,b)
- [x] course schedules page
- [ ] fix room code update should not affect schedules
- [x] Filter room by year and secion of schedulerData.rooms (I figured it out that if we remove schedules on that room it the section wont seeing the scheduels on that room)
- [ ] Fix fetching of room schedules.
- [x] update teacher day and time, should response all schedules that were affected of teacher's day time.
- [x] update subject
- [x] update course
- [x] on save of the same room and section but differnt sem, the different sem schedule is also deleting.
