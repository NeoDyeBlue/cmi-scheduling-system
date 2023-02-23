const rooms = [
  {
    code: "CB205",
    name: "Computer Laboratory 205",
    schedules: [
      {
        day: "monday",
        dayIndex: 0,
        slots: [
          {
            teacher: {
              firstName: "John",
              lastName: "Doe",
              image:
                "https://res.cloudinary.com/dppgyhery/image/upload/v1631456010/samples/people/kitchen-bar.jpg",
            },
            subject: {
              code: "NLP",
            },
            time: {
              start: "8:00 AM",
              end: "11:00 AM",
            },
          },
        ],
      },
      {
        day: "tuesday",
        dayIndex: 1,
        slots: [
          {
            teacher: {
              firstName: "John",
              lastName: "Doe",
              image:
                "https://res.cloudinary.com/dppgyhery/image/upload/v1631456010/samples/people/kitchen-bar.jpg",
            },
            subject: {
              code: "CSTHESIS1",
            },
            time: {
              start: "7:00 AM",
              end: "10:00 AM",
            },
          },
          {
            teacher: {
              firstName: "John",
              lastName: "Doe",
              image:
                "https://res.cloudinary.com/dppgyhery/image/upload/v1631456010/samples/people/kitchen-bar.jpg",
            },
            subject: {
              code: "CSTHESIS2",
            },
            time: {
              start: "11:30 AM",
              end: "2:30 PM",
            },
          },
        ],
      },
    ],
  },
  {
    code: "206",
    name: "Computer Laboratory 206",
    schedules: [],
  },
  {
    code: "AUDI",
    name: "Auditorium",
    schedules: [],
  },
];

export { rooms };
