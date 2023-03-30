const courseSampleData = {
  //course fields here only more importantly how many years
};

//for on tab change
const fetchExample1stYearSchedules = [
  {
    year: 1,
    section: 'A',
    schedules: [
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
            course: {
              code: 'bsgi',
              name: 'Bachelor of Science in Genshin Impact',
              year: 1,
              section: 'A',
            },
            dayTimes: [
              {
                day: 1,
                room: {
                  _id: '6424d89f95a8a0e1a61150fe',
                  code: 'cb205',
                },
                times: [
                  {
                    start: '8:00 AM',
                    end: '9:00 AM',
                    _id: '642537e0eaca9cecb03b0c22',
                  },
                ],
                _id: '642537e0eaca9cecb03b0c21',
              },
              {
                day: 3,
                room: {
                  _id: '6424d89f95a8a0e1a61150fe',
                  code: 'cb205',
                },
                times: [
                  {
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
    ],
  },
  {
    year: 1,
    section: 'B',
    schedules: [
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
            course: {
              code: 'bsgi',
              name: 'Bachelor of Science in Genshin Impact',
              year: 1,
              section: 'A',
            },
            dayTimes: [
              {
                day: 1,
                room: {
                  _id: '6424d89f95a8a0e1a61150fe',
                  code: 'cb205',
                },
                times: [
                  {
                    start: '8:00 AM',
                    end: '9:00 AM',
                    _id: '642537e0eaca9cecb03b0c22',
                  },
                ],
                _id: '642537e0eaca9cecb03b0c21',
              },
              {
                day: 3,
                room: {
                  _id: '6424d89f95a8a0e1a61150fe',
                  code: 'cb205',
                },
                times: [
                  {
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
    ],
  },
];

const collegeCourses = [
  {
    code: 'BSCS',
    name: 'Bachelor of Science in Computer Science',
    years: 4,
    sections: 5,
  },
];

const bscs = {
  code: 'bscs',
  name: 'Bachelor of Science in Computer Science',
  yearSections: [
    {
      year: 1,
      sections: [
        {
          section: 'A',
          schedules: [
            {
              day: 'monday',
              dayIndex: 0,
              slots: [
                {
                  subject: {
                    code: 'NLP',
                  },
                  teacher: {
                    firstName: 'John',
                    lastName: 'Doe',
                    image:
                      'https://res.cloudinary.com/dppgyhery/image/upload/v1631456010/samples/people/kitchen-bar.jpg',
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
                  teacher: {
                    firstName: 'John',
                    lastName: 'Doe',
                    image:
                      'https://res.cloudinary.com/dppgyhery/image/upload/v1631456010/samples/people/kitchen-bar.jpg',
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
                  teacher: {
                    firstName: 'John',
                    lastName: 'Doe',
                    image:
                      'https://res.cloudinary.com/dppgyhery/image/upload/v1631456010/samples/people/kitchen-bar.jpg',
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
          section: 'B',
          schedules: [
            {
              day: 'monday',
              dayIndex: 0,
              slots: [
                {
                  subject: {
                    code: 'NLP',
                  },
                  teacher: {
                    firstName: 'John',
                    lastName: 'Doe',
                    image:
                      'https://res.cloudinary.com/dppgyhery/image/upload/v1631456010/samples/people/kitchen-bar.jpg',
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
                  teacher: {
                    firstName: 'John',
                    lastName: 'Doe',
                    image:
                      'https://res.cloudinary.com/dppgyhery/image/upload/v1631456010/samples/people/kitchen-bar.jpg',
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
                  teacher: {
                    firstName: 'John',
                    lastName: 'Doe',
                    image:
                      'https://res.cloudinary.com/dppgyhery/image/upload/v1631456010/samples/people/kitchen-bar.jpg',
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
      ],
    },
    {
      year: 2,
      sections: [
        {
          section: 'A',
          schedules: [],
        },
      ],
    },
    {
      year: 3,
      sections: [
        {
          section: 'A',
          schedules: [],
        },
      ],
    },
    {
      year: 4,
      sections: [
        {
          section: 'A',
          schedules: [],
        },
      ],
    },
  ],
};

export { collegeCourses, bscs };
