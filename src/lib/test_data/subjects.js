const subjects = [
  {
    code: 'APPSDEV',
    name: 'Applications Development',
    units: 3,
    schedules: [
      {
        day: 'monday',
        dayIndex: 0,
        slots: [
          {
            room: {
              code: 'CB206',
              name: 'Computer Laboratory 206',
            },
            teacher: {
              firstName: 'John',
              lastName: 'Doe',
              image:
                'https://res.cloudinary.com/dppgyhery/image/upload/v1631456010/samples/people/kitchen-bar.jpg',
            },
            course: {
              code: 'BSCS',
              year: 2,
              section: 'A',
              type: 'college',
            },
            time: {
              start: '8:00 AM',
              end: '11:00 AM',
            },
          },
        ],
      },
    ],
  },
];

export { subjects };
