const teachers = [
  {
    teacherId: '11-1111',
    firstName: 'John',
    lastName: 'Doe',
    image:
      'https://res.cloudinary.com/dppgyhery/image/upload/v1631456010/samples/people/kitchen-bar.jpg',
    type: 'part-time',
    preferredDays: [0, 1],
    schedules: [
      {
        day: 'monday',
        dayIndex: 0,
        slots: [
          {
            subject: {
              code: 'NLP',
            },
            room: {
              code: 'CB205',
              name: 'Computer Laboratory 205',
            },
            time: {
              start: '8:00 AM',
              end: '11:00 AM',
            },
          },
        ],
      },
      {
        day: 'tuesday',
        dayIndex: 1,
        slots: [
          {
            subject: {
              code: 'CSTHESIS1',
            },
            room: {
              code: 'CB205',
              name: 'Computer Laboratory 205',
            },
            time: {
              start: '7:00 AM',
              end: '10:00 AM',
            },
          },
          {
            subject: {
              code: 'CSTHESIS2',
            },
            room: {
              code: 'CB205',
              name: 'Computer Laboratory 205',
            },
            time: {
              start: '11:30 AM',
              end: '2:30 PM',
            },
          },
        ],
      },
    ],
  },
  {
    teacherId: '11-1112',
    firstName: 'Jane',
    lastName: 'Doe',
    image:
      'https://res.cloudinary.com/dppgyhery/image/upload/v1631456014/samples/people/boy-snow-hoodie.jpg',
    type: 'full-time',
    preferredDays: [],
    schedules: [
      {
        day: 'monday',
        dayIndex: 0,
        slots: [
          {
            subject: {
              code: 'APPSDEV',
            },
            room: {
              code: 'CB206',
              name: 'Computer Laboratory 206',
            },
            time: {
              start: '8:00 AM',
              end: '11:00 AM',
            },
          },
        ],
      },
      {
        day: 'wednesday',
        dayIndex: 1,
        slots: [
          {
            subject: {
              code: 'PROG1',
            },
            time: {
              start: '7:00 AM',
              end: '10:00 AM',
            },
            room: {
              code: 'CB206',
              name: 'Computer Laboratory 206',
            },
          },
          {
            subject: {
              code: 'CSTHESIS1',
            },
            room: {
              code: 'CB206',
              name: 'Computer Laboratory 206',
            },
            time: {
              start: '11:30 AM',
              end: '2:30 PM',
            },
          },
        ],
      },
    ],
  },
];

export { teachers };
