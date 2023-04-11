const roomSampleDataForFetchingPerSemScheds = [
  {
    semester: '1',
    schedules: [
      {
        teacher: {
          _id: '6424d33e95a8a0e1a611508c',
          firstName: 'Venti',
          lastName: 'Bartobas',
          teacherId: '11-1111',
        },
        subject: {
          _id: '6424d38595a8a0e1a61150ab',
          code: 'swirl',
          name: 'Swirl',
          units: 3,
        },
        //remove this
        // course: {
        //   code: 'bsgi',
        //   name: 'Bachelor of Science in Genshin Impact',
        //   year: 1,
        //   section: 'A',
        // },
        dayTimes: [
          {
            day: 1,
            //room can be omitted
            room: {
              _id: '6424d89f95a8a0e1a61150fe',
              code: 'cb205',
            },
            times: [
              {
                //add courses array here
                courses: [
                  {
                    code: 'bsgi',
                    name: 'Bachelor of Science in Genshin Impact',
                    year: 1,
                    section: 'A',
                  },
                ],
                start: '8:00 AM',
                end: '9:00 AM',
                _id: '642537e0eaca9cecb03b0c22',
              },
            ],
            _id: '642537e0eaca9cecb03b0c21',
          },
          {
            day: 3,
            //room can be omitted
            room: {
              _id: '6424d89f95a8a0e1a61150fe',
              code: 'cb205',
            },
            times: [
              {
                //add courses array here
                courses: [
                  {
                    code: 'bsgi',
                    name: 'Bachelor of Science in Genshin Impact',
                    year: 1,
                    section: 'A',
                  },
                ],
                start: '9:00 AM',
                end: '10:00 AM',
                _id: '642537e0eaca9cecb03b0c24',
              },
            ],
            _id: '642537e0eaca9cecb03b0c23',
          },
        ],
      },
    ],
  },
  {
    semester: '2',
    schedules: [
      //...same as above
    ],
  },
];

const rooms = [
  {
    code: 'CB205',
    name: 'Computer Laboratory 205',
    schedules: [
      {
        day: 'monday',
        dayIndex: 0,
        slots: [
          {
            teacher: {
              firstName: 'John',
              lastName: 'Doe',
              image:
                'https://res.cloudinary.com/dppgyhery/image/upload/v1631456010/samples/people/kitchen-bar.jpg',
            },
            subject: {
              code: 'NLP',
            },
            course: {
              code: 'BSCS',
              year: 4,
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
      {
        day: 'tuesday',
        dayIndex: 1,
        slots: [
          {
            teacher: {
              firstName: 'John',
              lastName: 'Doe',
              image:
                'https://res.cloudinary.com/dppgyhery/image/upload/v1631456010/samples/people/kitchen-bar.jpg',
            },
            course: {
              code: 'BSCS',
              year: 4,
              section: 'A',
              type: 'college',
            },
            subject: {
              code: 'CSTHESIS1',
            },
            time: {
              start: '7:00 AM',
              end: '10:00 AM',
            },
          },
          {
            teacher: {
              firstName: 'John',
              lastName: 'Doe',
              image:
                'https://res.cloudinary.com/dppgyhery/image/upload/v1631456010/samples/people/kitchen-bar.jpg',
            },
            subject: {
              code: 'CSTHESIS2',
            },
            course: {
              code: 'BSCS',
              year: 4,
              section: 'A',
              type: 'college',
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
    code: '206',
    name: 'Computer Laboratory 206',
    schedules: [],
  },
  {
    code: 'AUDI',
    name: 'Auditorium',
    schedules: [],
  },
];

export { rooms };
